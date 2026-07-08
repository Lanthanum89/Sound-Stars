import { useId, type CSSProperties } from 'react';

export type MascotExpression = 'neutral' | 'happy';

interface MascotProps {
  expression?: MascotExpression;
  size?: number;
  animate?: boolean;
  /** Non-Classic skins don't have custom mascot art yet — fall back to their emoji. */
  emoji?: string;
  className?: string;
  style?: CSSProperties;
}

const STAR_PATH = 'M50 2 L61.8 33.8 L95.7 35.2 L69 56.2 L78.2 88.8 L50 70 L21.8 88.8 L31 56.2 L4.3 35.2 L38.2 33.8 Z';

export function Mascot({ expression = 'neutral', size = 92, animate = true, emoji, className, style }: MascotProps) {
  const gradientId = useId();
  const animation = animate ? 'bobB 3s ease-in-out infinite' : undefined;

  if (emoji) {
    return (
      <span
        className={className}
        role="img"
        aria-hidden="true"
        style={{ fontSize: size * 0.78, lineHeight: 1, display: 'inline-block', animation, ...style }}
      >
        {emoji}
      </span>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
      style={{ display: 'block', animation, ...style }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--gold-1)" />
          <stop offset="1" stopColor="var(--gold-2)" />
        </linearGradient>
      </defs>
      <path d={STAR_PATH} fill={`url(#${gradientId})`} stroke="var(--gold-stroke)" strokeWidth="3.5" strokeLinejoin="round" />
      {expression === 'neutral' ? (
        <>
          <circle cx="40" cy="45" r="4.6" fill="#3a2e12" />
          <circle cx="60" cy="45" r="4.6" fill="#3a2e12" />
          <circle cx="41.8" cy="43.2" r="1.5" fill="#fff" />
          <circle cx="61.8" cy="43.2" r="1.5" fill="#fff" />
          <circle cx="32.5" cy="55" r="5.4" fill="#ff8fa3" opacity=".6" />
          <circle cx="67.5" cy="55" r="5.4" fill="#ff8fa3" opacity=".6" />
          <path d="M39 55 Q50 67 61 55" stroke="#3a2e12" strokeWidth="3.4" strokeLinecap="round" fill="none" />
        </>
      ) : (
        <>
          <path d="M35 44 Q41 38 47 44" stroke="#3a2e12" strokeWidth="3.2" strokeLinecap="round" fill="none" />
          <path d="M53 44 Q59 38 65 44" stroke="#3a2e12" strokeWidth="3.2" strokeLinecap="round" fill="none" />
          <circle cx="32.5" cy="55" r="5.4" fill="#ff8fa3" opacity=".6" />
          <circle cx="67.5" cy="55" r="5.4" fill="#ff8fa3" opacity=".6" />
          <path d="M38 54 Q50 68 62 54 Q50 60 38 54 Z" fill="#e4567a" stroke="#3a2e12" strokeWidth="2.6" strokeLinejoin="round" />
        </>
      )}
    </svg>
  );
}
