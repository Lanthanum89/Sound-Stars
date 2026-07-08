import type { FlashcardItem } from './types';

export interface WordSegment {
  text: string;
  highlight: boolean;
}

const SPLIT_DIGRAPHS = new Set(['a-e', 'e-e', 'i-e', 'o-e', 'u-e']);

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

  // "oo_long" / "oo_short" are labels for the same two-letter grapheme "oo".
  const searchGrapheme = prompt.includes('_') ? prompt.split('_')[0] : prompt;
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
