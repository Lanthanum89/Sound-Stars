import { useCallback, useEffect, useState } from 'react';
import { shuffle } from '../content/deck';
import type { FlashcardItem } from '../content/types';

export function useFlashcardDeck(items: FlashcardItem[]) {
  const [deck, setDeck] = useState<FlashcardItem[]>(() => shuffle(items));
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setDeck(shuffle(items));
    setIndex(0);
  }, [items]);

  const current = deck[index] ?? null;
  const isComplete = deck.length > 0 && index >= deck.length;

  const next = useCallback(() => {
    setIndex((i) => i + 1);
  }, []);

  const restart = useCallback(() => {
    setDeck((prev) => shuffle(prev));
    setIndex(0);
  }, []);

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
