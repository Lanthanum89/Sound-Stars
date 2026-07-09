import type { FlashcardItem } from './types';

export interface WordSegment {
  text: string;
  highlight: boolean;
}

const SPLIT_DIGRAPHS = new Set(['a-e', 'e-e', 'i-e', 'o-e', 'u-e']);

// Some grapheme keys in the content bank are internal data-modeling labels,
// not something a child should ever see verbatim: "oo_long"/"oo_short"
// disambiguate two different sounds that are both spelled "oo", and
// "adjacent_consonants" is Phase 4's grouping label for consonant-blend
// words — there's no single new grapheme being tested there at all.
const GRAPHEME_DISPLAY_LABELS: Record<string, string> = {
  oo_long: 'oo',
  oo_short: 'oo',
  // Only relevant for standalone display (e.g. the parent progress view),
  // which has no specific word to fall back to the way getDisplayPrompt does.
  adjacent_consonants: 'blends',
};

/** Clean, kid-facing label for a raw grapheme/prompt key (e.g. "oo_long" -> "oo"). */
export function getGraphemeLabel(rawKey: string): string {
  return GRAPHEME_DISPLAY_LABELS[rawKey] ?? rawKey;
}

/**
 * What to show as the big prompt on a flashcard. "adjacent_consonants" has no
 * single grapheme to display (Phase 4 is about blending known sounds, not a
 * new one), so show the word itself instead of the internal grouping key.
 */
export function getDisplayPrompt(item: FlashcardItem): string {
  if (item.prompt === 'adjacent_consonants') return item.word;
  return getGraphemeLabel(item.prompt);
}

export function getEyebrowLabel(item: FlashcardItem): string {
  if (item.kind === 'tricky') return 'Sight word!';
  return item.prompt === 'adjacent_consonants' ? 'Blend it!' : 'Sound it out!';
}

/**
 * Splits an example word into segments so the target grapheme can be
 * highlighted within it (e.g. "r[ai]n"). Falls back to an unhighlighted
 * single segment for anything that isn't a literal, contiguous substring —
 * split digraphs (a-e) get their own two-part rule, "adjacent_consonants"
 * and tricky words have no single target to highlight.
 */
export function highlightGrapheme(item: FlashcardItem): WordSegment[] {
  const { word, prompt, kind } = item;

  if (kind === 'tricky' || prompt === 'adjacent_consonants') {
    return [{ text: word, highlight: false }];
  }

  if (SPLIT_DIGRAPHS.has(prompt)) {
    const vowel = prompt[0];
    const lowerWord = word.toLowerCase();
    const vowelIndex = lowerWord.indexOf(vowel);
    const lastE = lowerWord.lastIndexOf('e');
    if (vowelIndex !== -1 && lastE !== -1 && lastE > vowelIndex) {
      return [
        { text: word.slice(0, vowelIndex), highlight: false },
        { text: word.slice(vowelIndex, vowelIndex + 1), highlight: true },
        { text: word.slice(vowelIndex + 1, lastE), highlight: false },
        { text: word.slice(lastE, lastE + 1), highlight: true },
        { text: word.slice(lastE + 1), highlight: false },
      ].filter((segment) => segment.text.length > 0);
    }
    return [{ text: word, highlight: false }];
  }

  const searchGrapheme = getGraphemeLabel(prompt);
  const idx = word.toLowerCase().indexOf(searchGrapheme.toLowerCase());
  if (idx === -1) return [{ text: word, highlight: false }];

  const segments: WordSegment[] = [];
  if (idx > 0) segments.push({ text: word.slice(0, idx), highlight: false });
  segments.push({ text: word.slice(idx, idx + searchGrapheme.length), highlight: true });
  if (idx + searchGrapheme.length < word.length) {
    segments.push({ text: word.slice(idx + searchGrapheme.length), highlight: false });
  }
  return segments;
}
