# Main Stage microphone: prompts for matching art

The Main Stage character is a pastel pink microphone (pink handle, baby-blue collar, cream head). It is drawn in code for now
(`Microphone` in `src/components/Mascot/MascotArt.tsx`); these prompts use the same wording
as the other five characters' pack (`docs/mascot-prompts.json`) so new art comes out in the
same style. Make the neutral image first, then use it as the reference for the happy one.

## 1. Neutral (new image)

> Use case: illustration-story. Production asset for Sound Stars children's learning app. One isolated mascot, transparent background, square 1024x1024 canvas. Printed picture book / screen print aesthetic, flat solid colour fills, bold even outlines with round joins, charming slight hand-drawn irregularity, not glossy. Extremely simple shapes readable at 74px. Centre complete character with about 8% margin, no cropping. No text, scenery, sparkles, gradients, blur, glow, 3D, airbrush, extra characters, or decorative props. Genuine alpha transparency. Hard offset shadow optional, no soft shadow. Neutral expression: facing viewer, two dark round dot eyes with tiny white highlights, small closed smile, flat circular coral cheeks. Main Stage mascot: friendly front-facing handheld microphone standing upright. Round cream #FFFAF0 grille head with a very faint diagonal hatch, thick deep berry #5A1236 outline, a baby-blue #8FB8EE collar under the head, a pastel pink #F9A8C4 tapered handle with a thin berry line and one small butter-yellow #FFD76E button. The face sits on the grille head: two dark round dot eyes with tiny white highlights, small closed smile below them, flat pink #F77FA5 cheeks. No cable, no stand, no hands, no lettering, sparse details, no limbs. Single NEUTRAL expression only.

## 2. Happy (edit of the neutral image)

> Edit reference mascot to its HAPPY expression. Preserve identical character, silhouette, scale, pose, colours and location. Change dot eyes to closed upward smile arcs and closed mouth to open smiling mouth dark red #A8341A inside. Keep the pink cheeks. Add exactly two short curved berry #5A1236 sound-wave lines on each side of the head. Keep the collar, handle and button exactly unchanged. Flat solid colour screen-print aesthetic. No gradients or textures or gloss. Transparent square background, no text, no scenery. Full mascot same centred framing.

## Using the result

Export both at 1024 x 1024 with a transparent background, then either hand them over or
convert to 512 px WebP named `public/mascots/kpop-neutral.webp` and `kpop-happy.webp`, and add
`mascotSrc: mascot('kpop')` back to the Main Stage skin in `src/skins/registry.ts`
(see `docs/mascots.md`).
