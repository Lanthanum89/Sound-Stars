// Handwriting stroke data for the lowercase letters a-z: each letter is a list
// of strokes in writing order, each stroke a polyline of points. Built from
// lines and arcs so the shapes (and the later scoring) share one source of
// truth. Formation follows the school's ELS rhymes: round letters start at the
// top right and go anticlockwise, stems go down, and so on.
//
// Coordinates live in a CELL_WIDTH x CELL_HEIGHT box per letter, y pointing
// down: ascender line 30, x-height 50, baseline 90, descender line 122.

export interface Point {
  x: number;
  y: number;
}

export type Stroke = Point[];

export const CELL_WIDTH = 70;
export const CELL_HEIGHT = 130;
export const LINES = { ascender: 30, xHeight: 50, baseline: 90, descender: 122 } as const;

const STEP = 2;

function line(x1: number, y1: number, x2: number, y2: number): Stroke {
  const n = Math.max(2, Math.ceil(Math.hypot(x2 - x1, y2 - y1) / STEP));
  return Array.from({ length: n + 1 }, (_, i) => ({
    x: x1 + ((x2 - x1) * i) / n,
    y: y1 + ((y2 - y1) * i) / n,
  }));
}

// Angles in degrees, 0 = right, increasing clockwise on screen (y points down).
function arc(cx: number, cy: number, rx: number, ry: number, from: number, to: number): Stroke {
  const length = (Math.abs(to - from) / 360) * Math.PI * (rx + ry) * 2;
  const n = Math.max(4, Math.ceil(length / STEP));
  return Array.from({ length: n + 1 }, (_, i) => {
    const t = ((from + ((to - from) * i) / n) * Math.PI) / 180;
    return { x: cx + rx * Math.cos(t), y: cy + ry * Math.sin(t) };
  });
}

// Joins pieces into one stroke, dropping the repeated point where they meet.
const join = (...parts: Stroke[]): Stroke => parts.flatMap((part, i) => (i === 0 ? part : part.slice(1)));

const dot = (x: number, y: number): Stroke => [
  { x, y },
  { x, y: y + 1 },
];

// Anticlockwise bowl used by a, d, g, q: starts top right, ends back near it.
const bowl = () => arc(35, 70, 17, 20, -40, -320);
// Anticlockwise full circle for o.
const circle = () => arc(35, 70, 17, 20, -50, -410);

export const letterStrokes: Record<string, Stroke[]> = {
  a: [bowl(), line(52, 50, 52, 90)],
  b: [line(18, 30, 18, 90), arc(35, 70, 17, 20, 180, 540)],
  c: [arc(35, 70, 17, 20, -40, -320)],
  d: [bowl(), line(52, 30, 52, 90)],
  e: [join(line(18, 70, 52, 70), arc(35, 70, 17, 20, 0, -300))],
  f: [join(arc(46, 42, 12, 12, -10, -180), line(34, 42, 34, 90)), line(22, 50, 48, 50)],
  g: [bowl(), join(line(52, 50, 52, 108), arc(40, 108, 12, 14, 0, 150))],
  h: [line(18, 30, 18, 90), join(arc(35, 68, 17, 18, 180, 360), line(52, 68, 52, 90))],
  i: [line(35, 50, 35, 90), dot(35, 36)],
  j: [join(line(35, 50, 35, 108), arc(25, 108, 10, 14, 0, 150)), dot(35, 36)],
  k: [line(18, 30, 18, 90), line(50, 50, 20, 70), line(28, 64, 52, 90)],
  l: [line(35, 30, 35, 90)],
  m: [
    line(11, 50, 11, 90),
    join(arc(23, 62, 12, 12, 180, 360), line(35, 62, 35, 90)),
    join(arc(47, 62, 12, 12, 180, 360), line(59, 62, 59, 90)),
  ],
  n: [line(18, 50, 18, 90), join(arc(35, 64, 17, 14, 180, 360), line(52, 64, 52, 90))],
  o: [circle()],
  p: [line(18, 50, 18, 122), arc(35, 70, 17, 20, 180, 540)],
  q: [bowl(), line(52, 50, 52, 122)],
  r: [line(20, 50, 20, 90), arc(34, 64, 14, 14, 180, 300)],
  s: [join(arc(34, 60, 14, 10, -30, -270), arc(34, 80, 14, 10, -90, 150))],
  t: [join(line(30, 34, 30, 82), arc(40, 82, 10, 8, 180, 45)), line(20, 52, 48, 52)],
  u: [join(line(18, 50, 18, 74), arc(35, 74, 17, 14, 180, 0)), line(52, 50, 52, 90)],
  v: [join(line(18, 50, 35, 90), line(35, 90, 52, 50))],
  w: [join(line(10, 50, 22, 90), line(22, 90, 35, 60), line(35, 60, 48, 90), line(48, 90, 60, 50))],
  x: [line(18, 50, 52, 90), line(52, 50, 18, 90)],
  y: [line(18, 50, 36, 86), line(52, 50, 28, 122)],
  z: [join(line(18, 50, 52, 50), line(52, 50, 18, 90), line(18, 90, 52, 90))],
};

/** The letters to trace for a grapheme label, or null if any can't be traced (e.g. "a-e"). */
export function traceableLetters(label: string): string[] | null {
  const letters = label.toLowerCase().split('');
  return letters.length > 0 && letters.every((letter) => letter in letterStrokes) ? letters : null;
}
