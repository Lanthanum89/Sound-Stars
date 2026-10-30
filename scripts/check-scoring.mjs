// Calibration for src/content/scoring.ts (run with `npm run check:scoring`).
// A score is only useful if it separates a decent attempt from the wrong
// letter, so this writes every letter several ways with seeded synthetic
// handwriting and checks the scores land where a teacher would expect:
//   good and fair attempts clear the star thresholds, other letters never
//   do, backwards strokes and scribbles score low, an empty page scores 0.
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
check(pct(results.fair, 0.05) >= STAR_THRESHOLDS.one, `fair attempts: 5th percentile ${pct(results.fair, 0.05)} should reach 1 star (${STAR_THRESHOLDS.one})`);
check(mean(results.messy) < mean(results.fair) && mean(results.fair) < mean(results.good), 'scores should fall as the writing gets messier');
check(Math.max(...imp) < STAR_THRESHOLDS.three, `a wrong letter reached 3 stars (max ${Math.max(...imp).toFixed(0)})`);
check(pct(imp, 0.95) < STAR_THRESHOLDS.two, `wrong letters: 95th percentile ${pct(imp, 0.95)} should stay under 2 stars (${STAR_THRESHOLDS.two})`);
check(mean(backwards) < mean(forwards) - 15, `backwards strokes should score well below forwards (${mean(backwards).toFixed(0)} vs ${mean(forwards).toFixed(0)})`);
check(pct(scribbles, 0.95) < STAR_THRESHOLDS.one, `scribbles: 95th percentile ${pct(scribbles, 0.95)} should stay under 1 star (${STAR_THRESHOLDS.one})`);
check(scoreLetter([], letterStrokes.a).score === 0, 'an empty page should score 0');
check(scoreLetter([[{ x: 30, y: 60 }]], letterStrokes.a).score < STAR_THRESHOLDS.one, 'a single tap should not score for an a');

// Several letters across cells: igh written well, then with the g missing.
const igh = ['i', 'g', 'h'].map((l) => letterStrokes[l]);
const writeAcross = (skip) =>
  ['i', 'g', 'h'].flatMap((l, i) => (i === skip ? [] : handwrite(letterStrokes[l], STYLES.good).map((s) => s.map((p) => ({ x: p.x + i * CELL_WIDTH, y: p.y })))));
const full = scoreWriting(writeAcross(-1), igh, CELL_WIDTH);
const gap = scoreWriting(writeAcross(1), igh, CELL_WIDTH);
console.log(`igh written well: ${full.score} (${full.stars} stars); with the g missing: ${gap.score} (${gap.stars} stars, hint ${gap.hint?.hint} on letter ${gap.hint?.letterIndex})`);
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
check(gap.stars <= 1 && gap.hint?.letterIndex === 1 && gap.hint?.hint === 'empty', 'igh with a missing g should earn at most 1 star and flag the g as empty');

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
