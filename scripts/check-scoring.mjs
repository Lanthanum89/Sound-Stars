// Calibration for src/content/scoring.ts (run with `npm run check:scoring`).
// A score is only useful if it separates a decent attempt from the wrong
// letter, so this writes every letter several ways with seeded synthetic
// handwriting and checks the scores land where a teacher would expect:
//   good attempts earn 3 stars, fair and messy ones 2, other letters never
//   earn 3, backwards strokes and scribbles score low, an empty page earns no
//   stars, and any real attempt earns at least one star and some praise (the
//   screen is built so a child is never told they got nothing).
import { letterStrokes, CELL_WIDTH } from '../src/content/letterStrokes.ts';
import { scoreLetter, scoreWriting, STAR_THRESHOLDS } from '../src/content/scoring.ts';

let seed = Number(process.env.SEED ?? 20261030);
const rand = () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const between = (a, b) => a + (b - a) * rand();
const gauss = () => Math.sqrt(-2 * Math.log(1 - rand())) * Math.cos(2 * Math.PI * rand());

const len = (s) => s.slice(1).reduce((n, p, i) => n + Math.hypot(p.x - s[i].x, p.y - s[i].y), 0);

function along(stroke, t) {
  const total = len(stroke);
  if (total === 0) return stroke[0];
  let want = t * total;
  for (let i = 1; i < stroke.length; i++) {
    const seg = Math.hypot(stroke[i].x - stroke[i - 1].x, stroke[i].y - stroke[i - 1].y);
    if (want <= seg || i === stroke.length - 1) {
      const u = seg === 0 ? 0 : Math.min(1, want / seg);
      return { x: stroke[i - 1].x + (stroke[i].x - stroke[i - 1].x) * u, y: stroke[i - 1].y + (stroke[i].y - stroke[i - 1].y) * u };
    }
    want -= seg;
  }
  return stroke[stroke.length - 1];
}

// A hand-written version of the reference strokes.
function handwrite(strokes, { wobble, jitter, rotate, scale, shift }) {
  const rot = (between(-rotate, rotate) * Math.PI) / 180;
  const sx = between(scale[0], scale[1]);
  const sy = between(scale[0], scale[1]);
  const dx = between(-shift, shift);
  const dy = between(-shift, shift);
  return strokes.map((stroke) => {
    const n = Math.max(2, Math.round(len(stroke) / between(1.5, 4)));
    const waves = [1, 2, 3].map(() => ({ f: between(0.5, 2.5), px: between(0, 6.28), py: between(0, 6.28), a: between(0.3, 1) * wobble }));
    return Array.from({ length: n + 1 }, (_, i) => {
      const t = i / n;
      const p = along(stroke, t);
      let x = p.x + gauss() * jitter;
      let y = p.y + gauss() * jitter;
      for (const w of waves) {
        x += w.a * Math.sin(w.f * 6.28 * t + w.px);
        y += w.a * Math.sin(w.f * 6.28 * t + w.py);
      }
      x = 35 + (x - 35) * sx;
      y = 70 + (y - 70) * sy;
      const rx = 35 + (x - 35) * Math.cos(rot) - (y - 70) * Math.sin(rot);
      const ry = 70 + (x - 35) * Math.sin(rot) + (y - 70) * Math.cos(rot);
      return { x: rx + dx, y: ry + dy };
    });
  });
}

const STYLES = {
  good: { wobble: 2, jitter: 0.7, rotate: 5, scale: [0.88, 1.12], shift: 5 },
  fair: { wobble: 4, jitter: 1.4, rotate: 10, scale: [0.75, 1.3], shift: 9 },
  messy: { wobble: 7, jitter: 2.4, rotate: 18, scale: [0.6, 1.5], shift: 14 },
};

const letters = Object.keys(letterStrokes);
const TRIALS = 30;
const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
const pct = (a, q) => [...a].sort((x, y) => x - y)[Math.min(a.length - 1, Math.floor(q * a.length))];

const results = {};
for (const [name, style] of Object.entries(STYLES)) {
  results[name] = letters.flatMap((l) => Array.from({ length: TRIALS }, () => scoreLetter(handwrite(letterStrokes[l], style), letterStrokes[l]).score));
}

// Other letters, written well, against each target.
const impostors = [];
for (const target of letters) {
  for (const other of letters) {
    if (other === target) continue;
    const scores = Array.from({ length: 10 }, () => scoreLetter(handwrite(letterStrokes[other], STYLES.good), letterStrokes[target]).score);
    impostors.push({ target, other, score: mean(scores), max: Math.max(...scores) });
  }
}

const backwards = [];
const forwards = [];
for (const l of letters) {
  const ref = letterStrokes[l];
  if (ref.every((s) => len(s) < 6)) continue;
  for (let i = 0; i < 10; i++) {
    const w = handwrite(ref, STYLES.good);
    forwards.push(scoreLetter(w, ref).score);
    backwards.push(scoreLetter(w.map((s) => [...s].reverse()), ref).score);
  }
}

const scribbles = letters.flatMap((l) =>
  Array.from({ length: 20 }, () => {
    const strokes = Array.from({ length: Math.round(between(1, 4)) }, () =>
      Array.from({ length: 6 }, () => ({ x: between(0, 70), y: between(30, 120) })),
    );
    return scoreLetter(strokes, letterStrokes[l]).score;
  }),
);

const failures = [];
const check = (ok, message) => {
  if (!ok) failures.push(message);
};

console.log('attempt           mean   p5     p95');
for (const [name, scores] of Object.entries(results)) console.log(`${name.padEnd(16)} ${mean(scores).toFixed(0).padStart(5)} ${pct(scores, 0.05).toFixed(0).padStart(5)} ${pct(scores, 0.95).toFixed(0).padStart(6)}`);
const imp = impostors.map((i) => i.score);
console.log(`other letters    ${mean(imp).toFixed(0).padStart(5)} ${pct(imp, 0.05).toFixed(0).padStart(5)} ${pct(imp, 0.95).toFixed(0).padStart(6)}   (max ${Math.max(...imp).toFixed(0)})`);
console.log(`backwards        ${mean(backwards).toFixed(0).padStart(5)}   (same strokes forwards ${mean(forwards).toFixed(0)})`);
console.log(`scribbles        ${mean(scribbles).toFixed(0).padStart(5)} ${pct(scribbles, 0.05).toFixed(0).padStart(5)} ${pct(scribbles, 0.95).toFixed(0).padStart(6)}`);
console.log('hardest letters to tell apart (mean score of the wrong letter):');
for (const i of [...impostors].sort((a, b) => b.score - a.score).slice(0, 8)) console.log(`  writing ${i.other} for ${i.target}: ${i.score.toFixed(0)}`);

check(pct(results.good, 0.1) >= STAR_THRESHOLDS.three, `good attempts: at least 90% should earn 3 stars (10th percentile is ${pct(results.good, 0.1)}, needs ${STAR_THRESHOLDS.three})`);
check(mean(results.fair) >= STAR_THRESHOLDS.two, `fair attempts: mean ${mean(results.fair).toFixed(0)} should reach 2 stars (${STAR_THRESHOLDS.two})`);
check(pct(results.fair, 0.05) >= STAR_THRESHOLDS.two, `fair attempts: 95% should earn at least 2 stars (5th percentile ${pct(results.fair, 0.05)})`);
check(mean(results.messy) >= STAR_THRESHOLDS.two, `messy attempts: mean ${mean(results.messy).toFixed(0)} should still reach 2 stars, so a wobbly child is not disheartened`);
check(mean(results.messy) < mean(results.fair) && mean(results.fair) < mean(results.good), 'scores should fall as the writing gets messier');
check(Math.max(...imp) < STAR_THRESHOLDS.three, `a wrong letter reached 3 stars (max ${Math.max(...imp).toFixed(0)})`);
check(mean(imp) < STAR_THRESHOLDS.two - 10, `wrong letters: mean ${mean(imp).toFixed(0)} should sit well under the 2-star mark (${STAR_THRESHOLDS.two})`);
check(mean(backwards) < mean(forwards) - 15, `backwards strokes should score well below forwards (${mean(backwards).toFixed(0)} vs ${mean(forwards).toFixed(0)})`);
check(pct(scribbles, 0.95) < STAR_THRESHOLDS.two, `scribbles: 95th percentile ${pct(scribbles, 0.95)} should stay under 2 stars (${STAR_THRESHOLDS.two})`);
check(scoreLetter([], letterStrokes.a).score === 0, 'an empty page should score 0');
check(scoreWriting([], [letterStrokes.a], CELL_WIDTH).stars === 0, 'an empty page should earn no stars');
const tap = scoreWriting([[{ x: 30, y: 60 }]], [letterStrokes.a], CELL_WIDTH);
check(tap.stars <= 1, 'a single tap should earn at most 1 star');

// The kindness rules: every real attempt, however poor, earns a star and some praise.
const scribbleResult = scoreWriting([[{ x: 5, y: 40 }, { x: 60, y: 115 }, { x: 8, y: 118 }, { x: 62, y: 35 }]], [letterStrokes.a], CELL_WIDTH);
check(scribbleResult.stars === 1, `a scribble should still earn 1 star (got ${scribbleResult.stars})`);
check(Boolean(scribbleResult.praise.kind), 'a scribble should still get something to praise');

// Several letters across cells: igh written well, then with the g missing.
const igh = ['i', 'g', 'h'].map((l) => letterStrokes[l]);
const writeAcross = (skip) =>
  ['i', 'g', 'h'].flatMap((l, i) => (i === skip ? [] : handwrite(letterStrokes[l], STYLES.good).map((s) => s.map((p) => ({ x: p.x + i * CELL_WIDTH, y: p.y })))));
const full = scoreWriting(writeAcross(-1), igh, CELL_WIDTH);
const gap = scoreWriting(writeAcross(1), igh, CELL_WIDTH);
console.log(`igh written well: ${full.stars} stars; with the g missing: ${gap.stars} star, tip ${gap.hint?.hint} on letter ${gap.hint?.letterIndex}, praise ${gap.praise.kind}`);
const reverseH = scoreWriting(
  ['i', 'g', 'h'].flatMap((l, i) =>
    handwrite(letterStrokes[l], STYLES.good).map((s) => (l === 'h' ? [...s].reverse() : s).map((p) => ({ x: p.x + i * CELL_WIDTH, y: p.y }))),
  ),
  igh,
  CELL_WIDTH,
);
console.log(`igh with the h written backwards: ${reverseH.score} (${reverseH.stars} stars, hint ${reverseH.hint?.hint} on letter ${reverseH.hint?.letterIndex})`);
check(reverseH.stars < 3 && reverseH.hint?.letterIndex === 2, 'igh with a backwards h should fall short of 3 stars and point at the h');
check(full.stars === 3, 'igh written well should earn 3 stars');
check(gap.stars === 1 && gap.hint?.letterIndex === 1 && gap.hint?.hint === 'empty', 'igh with a missing g should earn 1 star and suggest adding the g');
check(gap.praise.kind === 'best' && gap.praise.letterIndex !== 1, 'igh with a missing g should still praise a letter that was written');

// Split digraphs (a-e): vowel, an open box for any consonant, then the e. The open
// box must never count for or against the score, whatever is written in it.
{
  const vowelAndE = [letterStrokes.a, letterStrokes.e];
  const boxes = [0, 2];
  const place = (strokes, box) => strokes.map((s) => s.map((p) => ({ x: p.x + box * CELL_WIDTH, y: p.y })));
  const writeA = () => place(handwrite(letterStrokes.a, STYLES.good), 0);
  const writeE = () => place(handwrite(letterStrokes.e, STYLES.good), 2);
  const writeK = () => place(handwrite(letterStrokes.k, STYLES.good), 1);
  const scribbleInGap = [place([[{ x: 5, y: 40 }, { x: 60, y: 115 }, { x: 8, y: 118 }, { x: 62, y: 35 }]], 1)][0];
  const plain = scoreWriting([...writeA(), ...writeE()], vowelAndE, CELL_WIDTH, boxes);
  const withConsonant = scoreWriting([...writeA(), ...writeK(), ...writeE()], vowelAndE, CELL_WIDTH, boxes);
  const withScribble = scoreWriting([...writeA(), ...scribbleInGap, ...writeE()], vowelAndE, CELL_WIDTH, boxes);
  const noE = scoreWriting([...writeA(), ...writeK()], vowelAndE, CELL_WIDTH, boxes);
  console.log(`a-e: vowel and e ${plain.stars} stars; with a k in the middle ${withConsonant.stars}; with a scribble in the middle ${withScribble.stars}; e missing ${noE.stars} star, tip ${noE.hint?.hint} on letter ${noE.hint?.letterIndex}`);
  check(plain.stars === 3, 'a-e written well should earn 3 stars');
  check(withConsonant.stars === 3, 'a consonant in the middle box should not change a-e from 3 stars');
  check(withScribble.stars === 3, 'a scribble in the middle box should be ignored');
  check(noE.stars === 1 && noE.hint?.hint === 'empty' && noE.hint?.letterIndex === 1, 'a-e with the e missing should earn 1 star and ask for the e');
  const good3 = Array.from({ length: 100 }, () => scoreWriting([...writeA(), ...writeK(), ...writeE()], vowelAndE, CELL_WIDTH, boxes).stars === 3).filter(Boolean).length;
  console.log(`a-e: ${good3}% of good attempts earn 3 stars`);
  check(good3 >= 85, `a-e: at least 85% of good attempts should earn 3 stars (got ${good3}%)`);
}

// Whole words: good writing should mostly earn 3 stars, fair writing mostly 2.
for (const word of [['i', 'g', 'h'], ['s', 'h'], ['a', 'u', 'g', 'h'], ['o', 'a']]) {
  const refs = word.map((l) => letterStrokes[l]);
  const write = (style) => word.flatMap((l, i) => handwrite(letterStrokes[l], style).map((s) => s.map((p) => ({ x: p.x + i * CELL_WIDTH, y: p.y }))));
  const share = (style, stars) => Array.from({ length: 100 }, () => scoreWriting(write(style), refs, CELL_WIDTH).stars === stars).filter(Boolean).length;
  const good = share(STYLES.good, 3);
  const fairThree = share(STYLES.fair, 3);
  console.log(`${word.join('').padEnd(5)} good: ${good}% earn 3 stars   fair: ${fairThree}% earn 3 stars`);
  check(good >= 85, `${word.join('')}: at least 85% of good attempts should earn 3 stars (got ${good}%)`);
  check(fairThree < 40, `${word.join('')}: fair attempts should rarely earn 3 stars (got ${fairThree}%)`);
}

if (failures.length) {
  console.log('\nFAILED');
  for (const f of failures) console.log(' - ' + f);
  process.exit(1);
}
console.log('\nscoring checks pass');
