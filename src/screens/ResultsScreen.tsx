import { useId } from 'react';
import { Mascot } from '../components/Mascot/Mascot';
import { useSkin } from '../skins/context';
import shared from './shared.module.css';
import styles from './ResultsScreen.module.css';

const STAR_PATH = 'M50 2 L61.8 33.8 L95.7 35.2 L69 56.2 L78.2 88.8 L50 70 L21.8 88.8 L31 56.2 L4.3 35.2 L38.2 33.8 Z';

function ScoreStar({ earned, delay }: { earned: boolean; delay: number }) {
  const gradientId = useId();
  return (
    <svg
      width="46"
      height="46"
      viewBox="0 0 100 100"
      className={styles.star}
      style={{ animationDelay: `${delay}s` }}
      aria-hidden="true"
    >
      {earned && (
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--gold-1)" />
            <stop offset="1" stopColor="var(--gold-2)" />
          </linearGradient>
        </defs>
      )}
      <path
        d={STAR_PATH}
        fill={earned ? `url(#${gradientId})` : '#efe7d4'}
        stroke={earned ? 'var(--gold-stroke)' : '#d8cbae'}
        strokeWidth="4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function starsEarned(pct: number): number {
  if (pct >= 100) return 3;
  if (pct >= 70) return 2;
  if (pct >= 40) return 1;
  return 0;
}

function captionFor(stars: number, incorrect: number): string {
  if (stars === 3) return "Perfect round — you're a superstar! 🌟";
  if (stars === 2) {
    return incorrect === 1
      ? 'Almost a full house — try that tricky sound again!'
      : `Almost a full house — try those ${incorrect} tricky sounds again!`;
  }
  if (stars === 1) return "Great effort — let's practise a bit more!";
  return "Good try — let's sound those out together again!";
}

interface ResultsScreenProps {
  correct: number;
  total: number;
  onPlayAgain: () => void;
  onBackHome: () => void;
}

export function ResultsScreen({ correct, total, onPlayAgain, onBackHome }: ResultsScreenProps) {
  const { skin } = useSkin();
  const pct = total === 0 ? 0 : Math.round((correct / total) * 100);
  const stars = starsEarned(pct);
  const incorrect = total - correct;

  return (
    <div className={`${shared.screen} ${shared.childSky}`}>
      <div className={shared.decor} aria-hidden="true">
        <span className={shared.twinkleStar} style={{ top: 70, left: 26, fontSize: 16 }}>
          ⭐
        </span>
        <span className={shared.twinkleStar} style={{ top: 96, right: 34, fontSize: 13, animationDelay: '.3s' }}>
          ⭐
        </span>
        <span className={shared.twinkleStar} style={{ top: 150, left: 18, fontSize: 12, animationDelay: '.6s' }}>
          ✨
        </span>
        <span className={shared.twinkleStar} style={{ top: 132, right: 22, fontSize: 15, animationDelay: '.2s' }}>
          ✨
        </span>
        <span className={shared.twinkleStar} style={{ top: 200, left: 44, fontSize: 11, animationDelay: '.8s' }}>
          ⭐
        </span>
        <span className={shared.twinkleStar} style={{ top: 186, right: 48, fontSize: 12, animationDelay: '.4s' }}>
          ⭐
        </span>
      </div>

      <div className={`${shared.content} ${styles.content}`}>
        <Mascot expression="happy" size={118} emoji={skin.id === 'classic' ? undefined : skin.emoji} />

        <div className={styles.headline}>
          <div className={styles.title}>You did it!</div>
          <div className={styles.subtitle}>Brilliant reading, superstar ⭐</div>
        </div>

        <div className={styles.scoreCard}>
          <div className={styles.stars}>
            {[0, 1, 2].map((i) => (
              <ScoreStar key={i} earned={i < stars} delay={i * 0.15} />
            ))}
          </div>
          <div className={styles.score}>
            {correct} <span className={styles.scoreTotal}>/ {total} sounds</span>
          </div>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${pct}%` }} />
          </div>
          <p className={styles.caption}>{captionFor(stars, incorrect)}</p>
        </div>

        <div className={styles.buttons}>
          <button type="button" className={styles.playAgain} onClick={onPlayAgain}>
            Play again ✨
          </button>
          <button type="button" className={styles.backHome} onClick={onBackHome}>
            Back home
          </button>
        </div>
      </div>
    </div>
  );
}
