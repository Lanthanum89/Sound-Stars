import type { CSSProperties } from 'react';
import { useSkin } from '../../skins/context';
import { MascotArt, type MascotExpression } from './MascotArt';

export type { MascotExpression };

interface MascotProps {
  expression?: MascotExpression;
  size?: number;
  animate?: boolean;
  className?: string;
  style?: CSSProperties;
}

/** The active theme's hero character. A `mascotSrc` image on the skin (e.g. Canva art) replaces the drawn one. */
export function Mascot({ expression = 'neutral', size = 92, animate = true, className, style }: MascotProps) {
  const { skin } = useSkin();
  const animation = animate ? 'bobB 3s ease-in-out infinite' : undefined;

  if (skin.mascotSrc) {
    return (
      <img
        src={skin.mascotSrc[expression]}
        width={size}
        height={size}
        alt=""
        className={className}
        style={{ display: 'block', animation, ...style }}
      />
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
      style={{ display: 'block', overflow: 'visible', animation, ...style }}
    >
      <MascotArt skinId={skin.id} expression={expression} />
    </svg>
  );
}
