import { useCallback, useEffect, useState } from 'react';
import type { FlashcardItem } from '../content/types';
import { useFlashcardDeck } from './useFlashcardDeck';

export interface RoundOptions {
  /** When true, an unanswered card auto-marks incorrect once secondsPerCard elapses. */
  timed: boolean;
  secondsPerCard: number;
  /** Cards to draw from the shuffled pool; omit/undefined for the whole pool. */
  sessionSize?: number;
}

export function useRound(items: FlashcardItem[], options: RoundOptions) {
  const { current, position, total, isComplete, next, restart: restartDeck } = useFlashcardDeck(
    items,
    options.sessionSize,
  );
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [timeLeft, setTimeLeft] = useState(options.secondsPerCard);

  // A fresh set of content (phase/deck filters changed) starts a fresh round.
  useEffect(() => {
    setScore({ correct: 0, incorrect: 0 });
  }, [items]);

  useEffect(() => {
    setTimeLeft(options.secondsPerCard);
  }, [current?.id, options.secondsPerCard, options.timed, items]);

  const mark = useCallback(
    (correct: boolean) => {
      setScore((s) => ({
        correct: s.correct + (correct ? 1 : 0),
        incorrect: s.incorrect + (correct ? 0 : 1),
      }));
      next();
    },
    [next],
  );

  useEffect(() => {
    if (!options.timed || isComplete || !current) return;
    if (timeLeft <= 0) {
      mark(false);
      return;
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [options.timed, timeLeft, isComplete, current, mark]);

  const restart = useCallback(() => {
    setScore({ correct: 0, incorrect: 0 });
    setTimeLeft(options.secondsPerCard);
    restartDeck();
  }, [restartDeck, options.secondsPerCard]);

  return {
    current,
    position,
    total,
    isComplete,
    score,
    timeLeft: options.timed ? timeLeft : null,
    mark,
    restart,
  };
}
