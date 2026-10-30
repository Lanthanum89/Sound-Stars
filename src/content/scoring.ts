// Scores how closely drawn strokes match a letter's reference strokes. Pure
// functions over points, so it can be tested without a browser (see
// scripts/check-scoring.mjs). Shape is judged after fitting the drawing to the
// reference's box, so a small or shifted letter is not marked down for that;
// size and position on the lines are scored separately and weigh less. Mirror
// images are never accepted (b is not d).

import type { Point, Stroke } from './letterStrokes';

/** One gentle thing to try next, for the weakest letter. */
export type Hint = 'empty' | 'missing' | 'shape' | 'direction' | 'start' | 'size';

/** Something true and good to say about a letter, the strongest first. */
export type Praise = 'shape' | 'start' | 'way' | 'size' | 'effort';

export interface LetterScore {
  /** 0 to 100. */
  score: number;
  hint?: Hint;
  praise: Praise;
}

export interface WritingScore {
  letters: LetterScore[];
  /** 0 to 100: half the letters' average, half the weakest letter. Not shown to children. */
  score: number;
  /** 0 only when nothing was written; any real attempt earns at least one star. */
  stars: 0 | 1 | 2 | 3;
  /** What to praise first. `best` means one letter stood out from the others. */
  praise: { kind: Praise | 'best'; letterIndex: number };
  /** The one thing to try next, if any. */
  hint?: { letterIndex: number; hint: Hint };
}

const SAMPLES = 32;
/** Mean distance (in cell units) at which a stroke is worth nothing. */
const D_MAX = 20;
/** Pen lifts closer than this are treated as one stroke. */
const MERGE_GAP = 12;
const MIN_EXTENT = 14;
const MIN_INK = 6;
const MAX_STROKES = 8;

/**
 * Three stars are kept for a letter that is properly well formed; two are
 * generous, since a wobbly but recognisable letter is a good letter at six.
 * Any real attempt earns one.
 */
export const STAR_THRESHOLDS = { three: 78, two: 50 } as const;

const dist = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

function length(stroke: Stroke): number {
  let total = 0;
  for (let i = 1; i < stroke.length; i++) total += dist(stroke[i - 1], stroke[i]);
  return total;
}

/** n points spaced evenly along the stroke; a dot (no length) repeats its point. */
function resample(stroke: Stroke, n: number): Stroke {
  const total = length(stroke);
  if (stroke.length === 0) return [];
  if (total < 1e-6) return Array.from({ length: n }, () => stroke[0]);
  const out: Stroke = [stroke[0]];
  const step = total / (n - 1);
  let carried = 0;
  let next = step;
  for (let i = 1; i < stroke.length && out.length < n; i++) {
    const seg = dist(stroke[i - 1], stroke[i]);
    while (seg > 0 && carried + seg >= next - 1e-9 && out.length < n) {
      const t = (next - carried) / seg;
      out.push({
        x: stroke[i - 1].x + (stroke[i].x - stroke[i - 1].x) * t,
        y: stroke[i - 1].y + (stroke[i].y - stroke[i - 1].y) * t,
      });
      next += step;
    }
    carried += seg;
  }
  while (out.length < n) out.push(stroke[stroke.length - 1]);
  return out;
}

function bounds(points: Point[]) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const p of points) {
    minX = Math.min(minX, p.x);
    minY = Math.min(minY, p.y);
    maxX = Math.max(maxX, p.x);
    maxY = Math.max(maxY, p.y);
  }
  return { minX, minY, maxX, maxY, w: Math.max(maxX - minX, MIN_EXTENT), h: Math.max(maxY - minY, MIN_EXTENT) };
}

/** Joins strokes where the pen was lifted and put straight back down, until there are no more than `limit`. */
function mergePenLifts(strokes: Stroke[], limit: number): Stroke[] {
  const out = strokes.map((s) => [...s]);
  while (out.length > limit) {
    let best = -1;
    let bestGap = MERGE_GAP;
    for (let i = 0; i < out.length - 1; i++) {
      const gap = dist(out[i][out[i].length - 1], out[i + 1][0]);
      if (gap < bestGap) {
        bestGap = gap;
        best = i;
      }
    }
    if (best === -1) break;
    out.splice(best, 2, [...out[best], ...out[best + 1]]);
  }
  return out;
}

/** Mean and 85th-percentile distance from each point of `a` to the nearest point of `b`. */
function nearest(a: Stroke, b: Stroke) {
  const gaps = a.map((p) => b.reduce((best, q) => Math.min(best, dist(p, q)), Infinity)).sort((x, y) => x - y);
  return { mean: gaps.reduce((sum, g) => sum + g, 0) / gaps.length, high: gaps[Math.floor(0.85 * (gaps.length - 1))] };
}

/** Two-way gap between two strokes, counting the worst stretches as well as the average. */
function chamfer(a: Stroke, b: Stroke): number {
  const ab = nearest(a, b);
  const ba = nearest(b, a);
  return (ab.mean + ab.high + ba.mean + ba.high) / 4;
}

function pointwise(a: Stroke, b: Stroke): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += dist(a[i], b[i]);
  return sum / a.length;
}

/** How far a drawn stroke is from a reference: overall gap, plus where it is at each point along the way. */
function shapeDistance(d: Stroke, r: Stroke): number {
  const along = Math.min(pointwise(d, r), pointwise([...d].reverse(), r));
  return 0.5 * chamfer(d, r) + 0.5 * along;
}

/** Cheapest way to give each reference stroke its own drawn stroke (or none). */
function assign(costs: number[][], unmatched: number): number[] {
  const refs = costs.length;
  const drawn = refs === 0 ? 0 : costs[0].length;
  let bestTotal = Infinity;
  let best: number[] = Array(refs).fill(-1);
  const used = Array<boolean>(drawn).fill(false);
  const current: number[] = [];
  const walk = (j: number, total: number) => {
    if (total >= bestTotal) return;
    if (j === refs) {
      bestTotal = total;
      best = [...current];
      return;
    }
    for (let k = 0; k < drawn; k++) {
      if (used[k]) continue;
      used[k] = true;
      current[j] = k;
      walk(j + 1, total + costs[j][k]);
      used[k] = false;
    }
    current[j] = -1;
    walk(j + 1, total + unmatched);
  };
  walk(0, 0);
  return best;
}

export function scoreLetter(drawnStrokes: Stroke[], reference: Stroke[]): LetterScore {
  const inked = drawnStrokes.filter((s) => s.length > 0);
  const totalInk = inked.reduce((sum, s) => sum + length(s), 0);
  const hasDot = inked.some((s) => s.length > 0 && length(s) < MIN_INK);
  if (inked.length === 0 || (totalInk < MIN_INK && !hasDot)) return { score: 0, hint: 'empty', praise: 'effort' };

  // Longest first when there are too many to try every pairing.
  const capped = [...inked].sort((a, b) => length(b) - length(a)).slice(0, MAX_STROKES);
  const drawn = mergePenLifts(inked.length > MAX_STROKES ? capped : inked, reference.length);

  // Fit the drawing to the reference's box for the shape comparison.
  const dBox = bounds(drawn.flat());
  const rBox = bounds(reference.flat());
  const sx = rBox.w / dBox.w;
  const sy = rBox.h / dBox.h;
  const fitted = drawn.map((s) =>
    resample(
      s.map((p) => ({ x: rBox.minX + (p.x - dBox.minX) * sx, y: rBox.minY + (p.y - dBox.minY) * sy })),
      SAMPLES,
    ),
  );
  const refs = reference.map((s) => resample(s, SAMPLES));

  const costs = refs.map((r) => fitted.map((d) => shapeDistance(d, r)));
  const match = assign(costs, D_MAX);

  let reversed = false;
  let lowStart = false;
  let missing = false;
  let lines = 0;
  let goodStarts = 0;
  const strokeScores = refs.map((r, j) => {
    const k = match[j];
    if (k < 0) {
      missing = true;
      return 0;
    }
    const d = fitted[k];
    const shape = clamp01(1 - costs[j][k] / D_MAX);
    const isDot = length(reference[j]) < MIN_INK;
    if (isDot) return shape;
    const forward = pointwise(d, r);
    const backward = pointwise([...d].reverse(), r);
    const wrongWay = backward < forward * 0.8;
    const start = clamp01(1 - dist(wrongWay ? d[SAMPLES - 1] : d[0], r[0]) / (D_MAX * 1.5));
    if (wrongWay) reversed = true;
    if (start < 0.4 && shape > 0.6) lowStart = true;
    lines++;
    if (!wrongWay && start >= 0.7) goodStarts++;
    return shape * (wrongWay ? 0.6 : 1) * (0.85 + 0.15 * start);
  });

  const matched = new Set(match.filter((k) => k >= 0));
  const refLength = reference.reduce((sum, s) => sum + length(s), 0) || 1;
  const junk = drawn.reduce((sum, s, k) => (matched.has(k) || length(s) < MIN_INK ? sum : sum + length(s)), 0);
  const accuracy = strokeScores.reduce((sum, s) => sum + s, 0) / strokeScores.length / (1 + junk / refLength);

  // Size and where it sits on the lines, in the drawing's own (unfitted) space.
  const size = clamp01(1 - (Math.abs(Math.log(dBox.h / rBox.h)) + Math.abs(Math.log(dBox.w / rBox.w))) / 1.4);
  const place = clamp01(1 - Math.abs(dBox.maxY - rBox.maxY) / 30);
  const layout = 0.6 * size + 0.4 * place;

  const score = Math.round(100 * (0.85 * accuracy + 0.15 * layout));
  let hint: Hint | undefined;
  if (missing) hint = 'missing';
  else if (accuracy < 0.45) hint = 'shape';
  else if (reversed) hint = 'direction';
  else if (lowStart) hint = 'start';
  else if (layout < 0.6) hint = 'size';
  // The best true thing to say, in order of how much it means. 'start' and 'way'
  // need some real resemblance, so a scribble is never told it went the right way.
  let praise: Praise = 'effort';
  if (accuracy >= 0.55) praise = 'shape';
  else if (accuracy >= 0.3 && lines > 0 && goodStarts === lines) praise = 'start';
  else if (accuracy >= 0.3 && lines > 0 && !reversed) praise = 'way';
  else if (layout >= 0.7) praise = 'size';
  return { score, hint, praise };
}

/**
 * Scores whatever was drawn across the letter boxes, each `cellWidth` wide. A
 * stroke belongs to the box its middle falls in. `references[i]` is the letter
 * in box `cellOf[i]` (default: box i); anything drawn in a box with no letter,
 * such as the middle of a split digraph, is ignored.
 */
export function scoreWriting(
  ink: Stroke[],
  references: Stroke[][],
  cellWidth: number,
  cellOf: number[] = references.map((_, i) => i),
): WritingScore {
  const cells: Stroke[][] = references.map(() => []);
  const lastCell = Math.max(...cellOf);
  for (const stroke of ink) {
    if (stroke.length === 0) continue;
    const middle = stroke.reduce((sum, p) => sum + p.x, 0) / stroke.length;
    const cell = Math.min(lastCell, Math.max(0, Math.floor(middle / cellWidth)));
    const index = cellOf.indexOf(cell);
    if (index === -1) continue;
    cells[index].push(stroke.map((p) => ({ x: p.x - cell * cellWidth, y: p.y })));
  }
  const letters = references.map((reference, i) => scoreLetter(cells[i], reference));
  // Half the average, half the weakest letter: one missing or backwards letter
  // cannot be averaged away by two good ones.
  const scores = letters.map((l) => l.score);
  const score = Math.round(0.5 * (scores.reduce((sum, v) => sum + v, 0) / scores.length) + 0.5 * Math.min(...scores));
  const wroteSomething = letters.some((l) => l.hint !== 'empty');
  const stars = !wroteSomething ? 0 : score >= STAR_THRESHOLDS.three ? 3 : score >= STAR_THRESHOLDS.two ? 2 : 1;
  const weakest = letters.reduce((worst, l, i) => (l.hint && l.score < letters[worst].score ? i : worst), 0);
  const best = letters.reduce((top, l, i) => (l.score > letters[top].score ? i : top), 0);
  // Name the standout letter when there are several and one clearly shone.
  const standsOut = letters.length > 1 && letters[best].score >= STAR_THRESHOLDS.two && letters[best].score - Math.min(...scores) >= 10;
  return {
    letters,
    score,
    stars,
    praise: standsOut ? { kind: 'best', letterIndex: best } : { kind: letters[best].praise, letterIndex: best },
    hint: letters[weakest].hint ? { letterIndex: weakest, hint: letters[weakest].hint } : undefined,
  };
}
