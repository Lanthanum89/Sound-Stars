import { Flashcard } from '../Flashcard/Flashcard';
import { ResultToast } from '../ResultToast/ResultToast';
import { useRound } from '../../hooks/useRound';
import type { FlashcardItem } from '../../content/types';
import styles from './Round.module.css';

interface RoundProps {
  items: FlashcardItem[];
  timed: boolean;
  secondsPerCard: number;
}

export function Round({ items, timed, secondsPerCard }: RoundProps) {
  const { current, position, total, isComplete, score, timeLeft, mark, restart } = useRound(items, {
    timed,
    secondsPerCard,
  });

  if (isComplete) {
    return <ResultToast correct={score.correct} total={total} onRestart={restart} />;
  }

  if (!current) return null;

  return (
    <div className={styles.round}>
      <p className={styles.progress}>
        <span>
          Card {position + 1} of {total}
        </span>
        {timeLeft !== null && (
          <span className={styles.timer} data-low={timeLeft <= 1}>
            ⏱ {timeLeft}s
          </span>
        )}
      </p>
      <Flashcard item={current} />
      <div className={styles.markButtons}>
        <button type="button" className={styles.incorrect} onClick={() => mark(false)}>
          ✗ Incorrect
        </button>
        <button type="button" className={styles.correct} onClick={() => mark(true)}>
          ✓ Correct
        </button>
      </div>
    </div>
  );
}
