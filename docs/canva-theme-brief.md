# Sound Stars: theme art brief for Canva

Six themes, each a small flat-colour place with one hero character. The app already
draws a first version of all of them in code (see `src/components/Scene` and
`src/components/Mascot/MascotArt.tsx`), so Canva art replaces the mascots first and
the scenes later if wanted. Everything below matches what is on screen today.

## What to make

For each theme, **two mascot images**, same character, same size, same position:

| File | Use |
| --- | --- |
| `public/mascots/<id>-neutral.png` | Setup screen (looking at you, small smile) |
| `public/mascots/<id>-happy.png` | Flashcards and results (eyes closed in a smile, open mouth) |

- 1024 x 1024 px, transparent background, character centred with about 8% margin.
- Also export SVG if Canva offers it (crisper on the tablet).
- Shown between 74 and 120 px on screen, so it must read at thumbnail size: bold
  silhouette, few details, nothing thinner than about 3% of the canvas.

Optional second pass (ask and I will add the slot): a **scene backdrop** per theme,
2400 x 1200 landscape and 1200 x 2400 portrait, flat colour, calm in the middle
(the cards sit there), detail along the bottom edge.

## House style (all themes)

Think printed picture book or risograph poster, not app-store icon.

- Flat colour only. At most one tonal step per shape (a darker shade for a shadow side).
- One dark outline colour per theme, even weight, round joins. Slightly imperfect is good.
- 3 to 5 inks per theme plus paper. Use the hex values below exactly.
- Faces: two eyes (dots, or arcs when happy), small smile, flat round cheeks. That is all.
- A hard offset shadow (a darker copy shifted down 3%) is welcome. Soft blurred shadows are not.

## Avoid

- Purple-to-pink or blue-to-purple gradients, neon glow, lens flare, bokeh
- Sparkle and star confetti scattered as decoration, emoji used as artwork
- Glossy 3D, chrome, glass, frosted blur, inner glow
- The generic "AI mascot": symmetrical, wide glassy eyes, rosy airbrushed cheeks, gradient fur
- Stock cute-animal clichés, rainbow anything, lightning bolts, confetti cannons
- Text or letters inside the artwork (the app supplies all type)

## The six themes

Hex values are the live palette in `src/skins/palettes.ts` (checked for contrast).

### Sunny Day (`classic`)
A summer morning on rolling hills. Warm and plain; the default.
Paper `#FFFDF7`, sky `#9FD5EA`, sun `#FFD24A`, hill `#86C077`, coral `#CF4020`, ink `#17506F`.
Mascot: a smiling five-point star, mustard `#F5B21B` with a deeper outline `#D98E04`.
Scene: pale cream clouds, a flat sun with a soft halo, two round trees on the hills.

### Hedgerow (`flowers`)
A British hedge in May: poppies, buttercups, bluebells. Deliberately no pink.
Paper `#FFFDF4`, sage `#BFDCAE`, leaf `#4D9058`, poppy `#CF3A22`, buttercup `#F2B705`, bluebell `#4562B3`, ink `#1D4B36`.
Mascot: a round bumblebee, front-on, two dark stripes low on the body, small pale wings, two antennae.
Scene: scalloped hedge along the bottom with flowers on top, a few petals drifting down.

### Dino Dig (`dinosaurs`)
A fossil dig site under a pale sun, layers of earth below.
Paper `#FFFAF0`, sand `#F3DFB0`, clay `#D6A06F`, deep earth `#A46A46`, terracotta `#BF4526`, fern `#3C7A33`, ink `#4A2C18`.
Mascot: a speckled egg with a zigzag crack across the top. Happy: three green plates poke out of the top.
Scene: stacked wavy strata with a spiral ammonite, a bone and a footprint set into them; a pterodactyl gliding over.

### Main Stage (`kpop`)
A daytime gig poster: sunburst rays, halftone dots, a stage edge with footlights. No purple, no neon.
Paper `#FFFAF0`, lemon `#FFE98F`, cobalt `#2536B8`, tangerine `#FF7A1A`, sun yellow `#FFD23F`, ink `#1B1F5C`.
Mascot: a boombox. Its two speakers are the eyes, with a small cassette window between them, a flat carry handle and an antenna.
Scene: rays fanning up from the stage, halftone corners, an orange stage edge with a row of round footlights.

### Railway (`trains`)
A heritage railway poster: green hills, telegraph poles, a little train crossing.
Paper `#FFFBF0`, duck-egg `#BFDCD6`, hill `#86B98B`, brunswick green `#1F5B3F`, vermilion `#C43620`, brass `#CF9522`, ink `#1C4A37`.
Mascot: a steam locomotive seen from the front, round green boiler with a brass ring, tall chimney, red buffer beam.
Scene: hills, poles and wires, a track along the bottom edge, a train drifting past with steam.

### Match Day (`football`)
A pitch from the touchline: mowing stripes, chalk lines, a crowd in the stand.
Paper `#FFFFFB`, sky `#CFE8F3`, grass `#A3D490` and `#B3DC9F`, kit red `#CC2F2C`, yellow card `#FFD23F`, ink `#15305A`.
Mascot: a football with a face, navy pentagon panels, white body.
Scene: striped pitch, white chalk lines and centre circle, a row of crowd dots, a ball rolling across.

## Master prompt (paste into Canva)

> Flat vector children's book illustration, risograph print look, limited ink palette
> on cream paper, one dark outline colour with even weight and round joins, hard
> offset shadow, no gradients, no glow, no gloss. Cute but not generic: a simple
> geometric character with a minimal face (two eyes, small smile, flat round
> cheeks). Transparent background, centred, bold silhouette that reads at 80px.
> No text, no sparkles, no stars, no emoji, no purple-pink gradients, no 3D.
> Character: [PASTE THE THEME'S MASCOT LINE AND PALETTE]. Make two versions:
> neutral (dot eyes, small smile) and happy (closed arc eyes, open smiling mouth).

## Putting the art in

Drop the files in `public/mascots/`, then set `mascotSrc` on the skin in
`src/skins/registry.ts`:

```ts
mascotSrc: { neutral: `${import.meta.env.BASE_URL}mascots/trains-neutral.png`, happy: `${import.meta.env.BASE_URL}mascots/trains-happy.png` }
```

The drawn mascot is used until then, so themes can be swapped in one at a time.
