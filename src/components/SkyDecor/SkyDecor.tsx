import styles from './SkyDecor.module.css';

type Size = 'sm' | 'md' | 'lg';

interface CloudSpec {
  top: string;
  left: string;
  size: Size;
  duration: number;
  delay: number;
}

interface StarSpec {
  top: string;
  left: string;
  size: Size;
  glyph: string;
  delay: number;
}

// Positions are percentages (not px) so the sky spreads across the full
// screen on any device — a phone and a tablet get the same lively sky
// instead of a cluster of decoration stuck in one corner.
const CLOUDS: CloudSpec[] = [
  { top: '6%', left: '-18%', size: 'md', duration: 34, delay: -6 },
  { top: '16%', left: '62%', size: 'sm', duration: 42, delay: -20 },
  { top: '30%', left: '-22%', size: 'lg', duration: 30, delay: -12 },
  { top: '48%', left: '70%', size: 'md', duration: 38, delay: -2 },
  { top: '64%', left: '-16%', size: 'sm', duration: 33, delay: -24 },
  { top: '80%', left: '55%', size: 'lg', duration: 40, delay: -9 },
];

const STARS: StarSpec[] = [
  { top: '4%', left: '10%', size: 'md', glyph: '⭐', delay: 0 },
  { top: '9%', left: '84%', size: 'sm', glyph: '⭐', delay: 0.6 },
  { top: '20%', left: '4%', size: 'sm', glyph: '✨', delay: 1.2 },
  { top: '26%', left: '92%', size: 'lg', glyph: '⭐', delay: 0.3 },
  { top: '38%', left: '18%', size: 'sm', glyph: '✨', delay: 0.9 },
  { top: '44%', left: '88%', size: 'md', glyph: '⭐', delay: 1.5 },
  { top: '56%', left: '8%', size: 'md', glyph: '✨', delay: 0.2 },
  { top: '64%', left: '94%', size: 'sm', glyph: '⭐', delay: 1.1 },
  { top: '74%', left: '22%', size: 'lg', glyph: '⭐', delay: 0.7 },
  { top: '84%', left: '78%', size: 'sm', glyph: '✨', delay: 1.4 },
];

/** Animated sky background — drifting clouds and twinkling stars, shared by every child-facing screen. */
export function SkyDecor() {
  return (
    <div className={styles.decor} aria-hidden="true">
      {CLOUDS.map((cloud, i) => (
        <span
          key={i}
          className={styles.cloud}
          data-size={cloud.size}
          style={{
            top: cloud.top,
            left: cloud.left,
            animationDuration: `${cloud.duration}s`,
            animationDelay: `${cloud.delay}s`,
          }}
        />
      ))}
      {STARS.map((star, i) => (
        <span
          key={i}
          className={styles.star}
          data-size={star.size}
          style={{ top: star.top, left: star.left, animationDelay: `${star.delay}s` }}
        >
          {star.glyph}
        </span>
      ))}
    </div>
  );
}
