import { graphemeBank, trickyWordBank, type Phase } from './phonicsGraphemeBank';
import type { FlashcardItem } from './types';

export function buildGraphemeDeck(phases: readonly Phase[]): FlashcardItem[] {
  return graphemeBank
    .filter((entry) => phases.includes(entry.phase))
    .flatMap((entry) =>
      entry.words.map((word, i) => ({
        id: `grapheme-${entry.grapheme}-${i}`,
        phase: entry.phase,
        kind: 'grapheme' as const,
        prompt: entry.grapheme,
        word,
      })),
    );
}

export function buildTrickyWordDeck(phases: readonly Phase[]): FlashcardItem[] {
  return trickyWordBank
    .filter((set) => phases.includes(set.phase))
    .flatMap((set) =>
      set.words.map((word) => ({
        id: `tricky-${set.phase}-${word}`,
        phase: set.phase,
        kind: 'tricky' as const,
        prompt: word,
        word,
      })),
    );
}

const ALL_PHASES: Phase[] = [2, 3, 4, 5];

/** Builds a deck of just the given prompts (graphemes or tricky words) — used
 * for the parent view's "Practise these together" targeted round. */
export function buildTargetedDeck(prompts: readonly string[]): FlashcardItem[] {
  const promptSet = new Set(prompts);
  const all = [...buildGraphemeDeck(ALL_PHASES), ...buildTrickyWordDeck(ALL_PHASES)];
  return all.filter((item) => promptSet.has(item.prompt));
}

export function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
