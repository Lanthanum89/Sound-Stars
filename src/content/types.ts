import type { Phase } from './phonicsGraphemeBank';

// Normalized shape every skin/presentation component consumes, regardless of
// whether the underlying content came from graphemeBank or trickyWordBank.
export interface FlashcardItem {
  id: string;
  phase: Phase;
  kind: 'grapheme' | 'tricky';
  /** What the pupil is asked to sound out or read: a grapheme (e.g. "ai") or a whole tricky word (e.g. "said"). */
  prompt: string;
  /** Example word shown alongside a grapheme prompt. Equal to prompt for tricky words. */
  word: string;
}

export type DeckKind = FlashcardItem['kind'];
