// Contrast check for every theme in src/skins/palettes.ts (run with
// `node --experimental-strip-types scripts/check-palettes.mjs`). Exits 1 on any miss.
import * as palettes from '../src/skins/palettes.ts';

const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

// [foreground, background, minimum, what it is]
const PAIRS = [
  ['--ink-heading', '--card-white', 7, 'headings on cards'],
  ['--ink-body', '--card-white', 4.5, 'body text on cards'],
  ['--ink-body-2', '--card-white', 4.5, 'small labels on cards'],
  ['--ink-muted', '--card-white', 3.5, 'unselected pill text'],
  ['--ink-heading', '--sky-1', 4.5, 'title on scene (top)'],
  ['--ink-heading', '--sky-2', 4.5, 'title on scene (mid)'],
  ['--ink-heading', '--sky-3', 4.5, 'title on scene (bottom)'],
  ['--ink-body', '--sky-1', 4.5, 'subtitle on scene'],
  ['--ink-heading', '--tint-1', 7, 'sheet tile'],
  ['--ink-body-2', '--tint-1', 4.5, 'sheet tile cue'],
  ['--ink-heading', '--tint-2', 7, 'sheet tile'],
  ['--ink-body-2', '--tint-2', 4.5, 'sheet tile cue'],
  ['--on-gold', '--cta-gold-1', 4.5, 'CTA label (top)'],
  ['--on-gold', '--cta-gold-2', 4.5, 'CTA label (bottom)'],
  ['--on-gold', '--yellow-chip', 4.5, 'selected pill'],
  ['--card-white', '--green', 4.5, 'white on correct/selected'],
  ['--card-white', '--coral', 4.5, 'white on selected coral pill'],
  ['--card-white', '--coral-2', 3, 'white on incorrect button (large)'],
  ['--card-white', '--cta-blue-2', 4.5, 'white on blue toggle'],
  ['--coral', '--card-white', 4.5, 'highlighted letters'],
  ['--practice-text', '--card-white', 4.5, 'eyebrow label'],
  ['--sparkle-text', '--sparkle-bg', 4.5, 'sparkling badge'],
  ['--ink-parent', '--parent-1', 7, 'parent view text'],
  ['--ink-parent', '--parent-3', 7, 'parent view text'],
];

let fails = 0;
for (const [name, tokens] of Object.entries(palettes)) {
  for (const [fg, bg, min, what] of PAIRS) {
    const r = ratio(tokens[fg], tokens[bg]);
    if (r < min) {
      fails++;
      console.log(`FAIL ${name.padEnd(10)} ${what.padEnd(34)} ${fg} on ${bg}: ${r.toFixed(2)} < ${min}`);
    }
  }
}
const keys = Object.keys(palettes.classic);
for (const [name, tokens] of Object.entries(palettes)) {
  const missing = keys.filter((k) => !(k in tokens));
  const extra = Object.keys(tokens).filter((k) => !keys.includes(k));
  if (missing.length || extra.length) { fails++; console.log(`KEYS ${name}: missing ${missing} extra ${extra}`); }
}
console.log(fails === 0 ? 'all palettes pass' : `${fails} problem(s)`);
process.exit(fails ? 1 : 0);
