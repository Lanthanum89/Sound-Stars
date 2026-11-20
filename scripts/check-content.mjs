// Sanity checks for the phonics content (run with `npm run check:content`).
// Fails on mistakes that are easy to make when editing the word lists by hand:
//   a word listed twice in one grapheme entry (the deck would show it twice in
//   a round), a grapheme key defined twice in the bank, a sound sheet row that
//   points at a missing bank key, or a bank entry no sound sheet row uses.
// The same spelling appearing under several graphemes is deliberate (a word
// like "king" contains both k and ng), so that is not checked.
import { graphemeBank } from '../src/content/phonicsGraphemeBank.ts';
import { soundSheet } from '../src/content/soundSheet.ts';

const errors = [];
const BLENDS_KEY = 'adjacent_consonants';

const bankKeys = new Set();
for (const { grapheme, words } of graphemeBank) {
  if (bankKeys.has(grapheme)) errors.push(`bank: grapheme "${grapheme}" is defined more than once`);
  bankKeys.add(grapheme);

  const seen = new Set();
  for (const word of words) {
    const lower = word.toLowerCase();
    if (seen.has(lower)) errors.push(`bank: "${word}" appears twice under "${grapheme}"`);
    seen.add(lower);
  }
}

const sheetIds = new Set();
const sheetKeys = new Set();
for (const { id, key } of soundSheet) {
  if (sheetIds.has(id)) errors.push(`sheet: id "${id}" is not unique`);
  sheetIds.add(id);
  sheetKeys.add(key);
  if (!bankKeys.has(key)) errors.push(`sheet: key "${key}" has no entry in the grapheme bank`);
}

for (const key of bankKeys) {
  if (key !== BLENDS_KEY && !sheetKeys.has(key)) errors.push(`bank: "${key}" has no row in the sound sheet`);
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  console.error(`\n${errors.length} content problem(s).`);
  process.exit(1);
}
console.log(`Content OK: ${graphemeBank.length} bank entries, ${soundSheet.length} sheet rows.`);
