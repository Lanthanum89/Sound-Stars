export interface Skin {
  id: string;
  name: string;
  /** Decorative emoji used on the skin picker chip and as backdrop motifs. */
  emoji: string;
  /** Accent colour as a hex string, used for buttons, borders, and highlights. */
  accent: string;
  /** Same colour as an "r, g, b" triple, for building rgba() tints in CSS. */
  accentRgb: string;
}
