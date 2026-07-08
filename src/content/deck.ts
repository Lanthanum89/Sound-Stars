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

export function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
