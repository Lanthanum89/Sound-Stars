# Sound Stars: theme art brief for Canva

> Status: the mascot artwork has been delivered and is in the app (see `docs/mascots.md`).
> This brief is kept as the design reference and for making replacements or the optional scene art.

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
A pastel pink gig poster for girl-band fans: pale pink sunburst rays, halftone dots, a pink stage edge with warm footlights. Flat and print-like: no neon, no glow, no gradients.
Paper `#FFFAF8`, blush pink `#FFD3E1`, pink `#F77FA5`, baby blue `#6FA8E8`, butter `#FFD76E`, ink (deep rose) `#8A2352`, outline (deep berry) `#5A1236`.
Mascot: a handheld microphone, upright. Round cream grille head with the face on it, a baby-blue collar, a pastel pink `#F9A8C4` tapered handle with one small butter-yellow button, pink cheeks. Happy: two sound-wave arcs on each side.
Scene: pink rays fanning up from the stage, halftone corners, a pink stage edge with a baby-blue trim and a row of round footlights, pink, blue and butter confetti drifting up.

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

## Ready-to-paste prompts (one per mascot)

Each prompt is complete, with the colours filled in. Run it once, then ask for the
second expression (the line at the end of each prompt covers both), remove the
background with Canva's Background Remover, and export PNG at 1024 x 1024 (and SVG
if offered). If a result is too glossy or too detailed, add: "flatter, simpler,
fewer details, like a screen print".

**Sunny Day (star)**
> Flat vector children's book mascot, screen-print look, one dark outline of even weight with round joins, hard offset shadow, no gradients, no glow, no gloss, no text, no sparkles, not 3D, no purple or pink. A smiling five-point star with slightly rounded points, mustard yellow #F5B21B with a deeper amber outline #D98E04, flat coral cheeks #E8583A. Bold silhouette that reads at 80px, centred on a plain white square. Two versions: neutral (two round dot eyes with a tiny white highlight, small closed smile) and happy (closed arc eyes, open smiling mouth with dark red inside #A8341A).

**Hedgerow (bumblebee)**
> Flat vector children's book mascot, screen-print look, one dark outline #2B2118 of even weight with round joins, hard offset shadow, no gradients, no glow, no gloss, no text, no sparkles, not 3D, no pink. A round bumblebee seen from the front: body yellow #F2B705, two dark stripes #2B2118 low on the belly, two small cream wings #FFFDF4 outlined in bluebell blue #4562B3, two antennae with round tips, flat coral cheeks. Bold silhouette that reads at 80px, centred on a plain white square. Two versions: neutral (round dot eyes with a tiny white highlight, small closed smile) and happy (closed arc eyes, open smiling mouth with dark red inside #A8341A).

**Dino Dig (dinosaur egg)**
> Flat vector children's book mascot, screen-print look, one dark outline of even weight with round joins, hard offset shadow, no gradients, no glow, no gloss, no text, no sparkles, not 3D, no purple or pink. A speckled dinosaur egg: cream shell #F6E7C8 with terracotta speckles #BF4526, brown outline #8A6A3B, a zigzag crack in dark brown #2B2118 across the upper third, flat coral cheeks. Bold silhouette that reads at 80px, centred on a plain white square. Two versions: neutral (round dot eyes with a tiny white highlight, small closed smile) and happy (closed arc eyes, open smiling mouth, and three fern-green #3C7A33 dinosaur plates poking out of the top of the egg).

**Main Stage (microphone)**
> See `docs/mic-mascot-prompts.md` for the neutral prompt and the happy-edit prompt, written in the same wording as the rest of the pack.

**Railway (steam locomotive)**
> Flat vector children's book mascot, screen-print look, one dark outline of even weight with round joins, hard offset shadow, no gradients, no glow, no gloss, no text, no sparkles, not 3D, no purple or pink. A little steam locomotive seen from the front: round boiler in Brunswick green #1F5B3F with a brass ring #CF9522, tall dark chimney #12261C with a flared top, a small cream headlamp above the face, a red buffer beam #C43620 with two round buffers, black wheels at the sides, flat coral cheeks. Bold silhouette that reads at 80px, centred on a plain white square. Two versions: neutral (round dot eyes with a tiny white highlight, small closed smile) and happy (closed arc eyes, open smiling mouth with dark red inside #A8341A).

**Match Day (football)**
> Flat vector children's book mascot, screen-print look, one dark navy outline #15305A of even weight with round joins, hard offset shadow, no gradients, no glow, no gloss, no text, no sparkles, not 3D, no purple or pink. A football with a face: white ball #FFFFFB with navy #15305A pentagon panels and seams, flat coral cheeks. Bold silhouette that reads at 80px, centred on a plain white square. Two versions: neutral (round dot eyes with a tiny white highlight, small closed smile) and happy (closed arc eyes, open smiling mouth with dark red inside #A8341A).

## Putting the art in

Drop the files in `public/mascots/`, then set `mascotSrc` on the skin in
`src/skins/registry.ts`:

```ts
mascotSrc: { neutral: `${import.meta.env.BASE_URL}mascots/trains-neutral.png`, happy: `${import.meta.env.BASE_URL}mascots/trains-happy.png` }
```

The drawn mascot is used until then, so themes can be swapped in one at a time.
