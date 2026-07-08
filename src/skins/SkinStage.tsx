import type { ReactNode } from 'react';
import { useSkin } from './context';
import styles from './SkinStage.module.css';

const DECORATION_POSITIONS = [
  { top: '2%', left: '6%', rotate: -12, size: '2.1rem' },
  { top: '8%', left: '82%', rotate: 10, size: '1.5rem' },
  { top: '68%', left: '2%', rotate: 8, size: '1.7rem' },
  { top: '76%', left: '86%', rotate: -8, size: '1.9rem' },
  { top: '42%', left: '93%', rotate: 15, size: '1.3rem' },
  { top: '38%', left: '1%', rotate: -15, size: '1.3rem' },
];

export function SkinStage({ children }: { children: ReactNode }) {
  const { skin } = useSkin();

  return (
    <div className={styles.stage}>
      <div className={styles.backdrop} aria-hidden="true">
        {DECORATION_POSITIONS.map((pos, i) => (
          <span
            key={i}
            className={styles.decoration}
            style={{ top: pos.top, left: pos.left, fontSize: pos.size, transform: `rotate(${pos.rotate}deg)` }}
          >
            {skin.emoji}
          </span>
        ))}
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
