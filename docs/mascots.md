# Mascot artwork

Each theme has a hero character in two expressions. Five have image art in
`public/mascots/<theme>-<neutral|happy>.webp` (512 x 512, transparent); Main Stage uses the drawn microphone until its art exists. `src/skins/registry.ts` points each skin at its pair through `mascotSrc`.

| Theme (id) | Character |
| --- | --- |
| Sunny Day (`classic`) | star |
| Hedgerow (`flowers`) | bumblebee |
| Dino Dig (`dinosaurs`) | speckled egg |
| Main Stage (`kpop`) | microphone (drawn in code; image art not made yet, see `docs/mic-mascot-prompts.md`) |
| Railway (`trains`) | steam locomotive |
| Match Day (`football`) | football |

## Where it came from

Made from the prompts in `docs/canva-theme-brief.md`. (The pack also had a boombox for Main Stage; it was replaced by a microphone and is not used.) The pack supplied was raster artwork
(1024 x 1024 PNG with transparency) produced with an image generation tool; the prompts it used
are kept in `docs/mascot-prompts.json`. Those original PNGs are not in the repo (about 6 MB);
the app uses 512 px WebP copies (about 26 KB each, 350 KB in all), which stay sharp at 3x pixel
density for the 88 to 134 px the characters are drawn at.

## Behaviour

- The neutral image shows on the setup screen; the happy image on flashcards and results.
- Both images of the active theme are preloaded when a theme is chosen.
- If an image fails to load (for example offline, before that theme's art has been fetched once by
  the service worker), the drawn SVG character in `src/components/Mascot/MascotArt.tsx` is shown
  instead, so a theme never has a gap.

## Replacing a character

Overwrite the two files for that theme (same names, square, transparent, character centred with
about 8% margin). Nothing else needs to change.
