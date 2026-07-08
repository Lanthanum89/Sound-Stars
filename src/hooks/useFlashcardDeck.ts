import { useCallback, useEffect, useState } from 'react';
import { shuffle } from '../content/deck';
import type { FlashcardItem } from '../content/types';

export function useFlashcardDeck(items: FlashcardItem[], limit?: number) {
  const buildDeck = useCallback(() => {
    const shuffled = shuffle(items);
    return typeof limit === 'number' ? shuffled.slice(0, limit) : shuffled;
  }, [items, limit]);

  const [deck, setDeck] = useState<FlashcardItem[]>(buildDeck);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setDeck(buildDeck());
    setIndex(0);
  }, [buildDeck]);

  const current = deck[index] ?? null;
  const isComplete = deck.length > 0 && index >= deck.length;

  const next = useCallback(() => {
    setIndex((i) => i + 1);
  }, []);

  // A fresh shuffle-and-slice on restart (not just a reshuffle of the previous
  // deck) so repeated rounds sample a different subset when a limit is set.
  const restart = useCallback(() => {
    setDeck(buildDeck());
    setIndex(0);
  }, [buildDeck]);

  return {
    deck,
    current,
    position: Math.min(index, deck.length),
    total: deck.length,
    isComplete,
    next,
    restart,
  };
}
