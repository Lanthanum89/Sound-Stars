import type { ThemeTokens } from './palettes';

export interface Skin {
  id: string;
  name: string;
  /** Three inks that sum the theme up, shown on the picker chip. */
  swatch: [string, string, string];
  /** Every colour token the screens read; applied to the root element. */
  tokens: ThemeTokens;
  /** Mascot artwork (e.g. made in Canva), one image per expression, replacing the drawn mascot. */
  mascotSrc?: { neutral: string; happy: string };
}
