import { useState, type CSSProperties } from 'react';
import { useSkin } from '../../skins/context';
import { MascotArt, type MascotExpression } from './MascotArt';

export type { MascotExpression };

interface MascotProps {
  /** Draw this theme's character instead of the active one (for the theme picker). */
  skinId?: string;
  expression?: MascotExpression;
  size?: number;
  animate?: boolean;
  className?: string;
  style?: CSSProperties;
}

/**
 * The active theme's hero character: the skin's artwork, or the drawn version
 * when it has none or the image fails to load (for example offline, before that
 * theme's art has been fetched once).
 */
export function Mascot({ skinId, expression = 'neutral', size = 92, animate = true, className, style }: MascotProps) {
  const { skin: active, skins } = useSkin();
  const skin = (skinId && skins.find((s) => s.id === skinId)) || active;
  const [failed, setFailed] = useState<string[]>([]);
  const animation = animate ? 'bobB 3s ease-in-out infinite' : undefined;

  const src = skin.mascotSrc?.[expression];
  if (src && !failed.includes(src)) {
    return (
      <img
        src={src}
        width={size}
        height={size}
        alt=""
        onError={() => setFailed((list) => [...list, src])}
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
