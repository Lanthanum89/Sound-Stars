import { useCallback, useEffect, useRef } from 'react';
import { Mascot } from '../components/Mascot/Mascot';
import { useSkin } from '../skins/context';
import { useRound } from '../hooks/useRound';
import { highlightGrapheme } from '../content/highlightGrapheme';
import type { FlashcardItem } from '../content/types';
import type { RoundAnswer } from '../hooks/useProgress';
import shared from './shared.module.css';
import styles from './RoundScreen.module.css';

const DOT_LIMIT = 10;

interface RoundScreenProps {
  items: FlashcardItem[];
  timed: boolean;
  secondsPerCard: number;
  sessionSize?: number;
  onClose: () => void;
  onComplete: (answers: RoundAnswer[]) => void;
}

export function RoundScreen({ items, timed, secondsPerCard, sessionSize, onClose, onComplete }: RoundScreenProps) {
  const { skin } = useSkin();
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
  const mascotEmoji = skin.id === 'classic' ? undefined : skin.emoji;

  return (
    <div className={`${shared.screen} ${shared.childSky}`}>
      <div className={shared.decor} aria-hidden="true">
        <div className={shared.cloud} style={{ top: 150, left: -8, width: 64, height: 24, animationDuration: '8s' }} />
        <span className={shared.twinkleStar} style={{ top: 110, right: 20, fontSize: 14 }}>
          ⭐
        </span>
      </div>

      <div className={shared.content}>
        <div className={styles.topBar}>
          <button type="button" className={shared.roundButton} onClick={onClose} aria-label="Close round">
            ✕
          </button>

          <div className={styles.progress} role="status" aria-label={`Card ${position + 1} of ${total}`}>
            {total <= DOT_LIMIT ? (
              Array.from({ length: total }).map((_, i) => (
                <span
                  key={i}
                  className={styles.dot}
                  data-state={i < position ? 'done' : i === position ? 'current' : 'upcoming'}
                />
              ))
            ) : (
              <div className={styles.progressBar}>
                <div className={styles.progressBarFill} style={{ width: `${((position + 1) / total) * 100}%` }} />
              </div>
            )}
          </div>

          {timeLeft !== null ? (
            <div className={styles.timer} data-low={timeLeft <= 1}>
              ⏱ {timeLeft}
            </div>
          ) : (
            <div className={styles.timerSpacer} />
          )}
        </div>

        <div className={styles.body}>
          <div className={styles.card}>
            <div className={styles.mascotSlot}>
              <Mascot expression="happy" size={74} emoji={mascotEmoji} />
            </div>
            <div className={styles.eyebrow}>Sound it out!</div>
            <div className={styles.prompt}>{current.prompt}</div>
            {current.kind === 'grapheme' && (
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
              ✗
            </button>
            <button type="button" className={styles.correct} onClick={() => mark(true)}>
              ✓ Yes!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
