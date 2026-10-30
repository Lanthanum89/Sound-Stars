import { useCallback, useEffect, useRef } from 'react';
import { Icon } from '../components/Icon/Icon';
import { Mascot } from '../components/Mascot/Mascot';
import { Scene } from '../components/Scene/Scene';
import { useRound } from '../hooks/useRound';
import { getDisplayPrompt, getEyebrowLabel, highlightGrapheme } from '../content/highlightGrapheme';
import type { FlashcardItem } from '../content/types';
import type { RoundAnswer } from '../hooks/useProgress';
import shared from './shared.module.css';
import styles from './RoundScreen.module.css';

interface RoundScreenProps {
  items: FlashcardItem[];
  timed: boolean;
  secondsPerCard: number;
  sessionSize?: number;
  onClose: () => void;
  onComplete: (answers: RoundAnswer[]) => void;
}

export function RoundScreen({ items, timed, secondsPerCard, sessionSize, onClose, onComplete }: RoundScreenProps) {
  const answersRef = useRef<RoundAnswer[]>([]);

  const handleAnswer = useCallback((item: FlashcardItem, correct: boolean) => {
    answersRef.current.push({ item, correct });
  }, []);

  const { current, position, total, isComplete, timeLeft, mark } = useRound(items, {
    timed,
    secondsPerCard,
    sessionSize,
    onAnswer: handleAnswer,
  });

  useEffect(() => {
    if (isComplete) onComplete(answersRef.current);
    // Only fire once per round completion — answersRef intentionally excluded.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComplete]);

  if (isComplete || !current) return null;

  const segments = highlightGrapheme(current);
  const displayPrompt = getDisplayPrompt(current);

  return (
    <div className={`${shared.screen} ${shared.childSky}`}>
      <Scene />

      <div className={shared.content}>
        <div className={styles.topBar}>
          <button type="button" className={shared.roundButton} onClick={onClose} aria-label="Close round">
            <Icon name="cross" />
          </button>

          <div className={styles.progress}>
            <span className={styles.progressText}>
              {position + 1} of {total}
            </span>
            <div
              className={styles.progressBar}
              role="progressbar"
              aria-label="Round progress"
              aria-valuemin={0}
              aria-valuemax={total}
              aria-valuenow={position}
            >
              <div className={styles.progressBarFill} style={{ width: `${(position / total) * 100}%` }} />
            </div>
          </div>

          {timeLeft !== null ? (
            <div className={styles.timer} data-low={timeLeft <= 1}>
              <Icon name="timer" /> {timeLeft}
            </div>
          ) : (
            <div className={styles.timerSpacer} />
          )}
        </div>

        <div className={styles.body}>
          <div className={styles.card}>
            <div className={styles.mascotSlot}>
              <Mascot expression="happy" size={88} />
            </div>
            <div className={styles.eyebrow}>{getEyebrowLabel(current)}</div>
            <div className={styles.prompt} data-long={displayPrompt.length > 4}>
              {displayPrompt}
            </div>
            {current.kind === 'grapheme' && current.prompt !== 'adjacent_consonants' && (
              <div className={styles.word}>
                {segments.map((segment, i) => (
                  <span key={i} className={segment.highlight ? styles.wordHighlight : undefined}>
                    {segment.text}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className={styles.answers}>
            <button type="button" className={styles.incorrect} onClick={() => mark(false)}>
              Practise again
            </button>
            <button type="button" className={styles.correct} onClick={() => mark(true)}>
              <Icon name="check" /> Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
