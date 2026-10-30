# Roadmap

Future work, not yet started.

## 1. Sound sheet (teacher's worksheet)

Display the official sounds and the class "remember it" phrases from Freddie's teacher's worksheet in a fun, kid-friendly way.

- Needs the worksheet content as data (sound, memory phrase/action), kept separate from presentation like `src/content/`.
- Presentation should plug into the existing skin system (`src/skins/`).

## 2. Letter tracing

Stylus and finger drawing to trace each letter over a guideline.

- Pointer Events on a canvas (handles pen, touch and mouse with one code path).
- Per-letter guide paths stored as stroke data (ordered strokes with direction), not images.
- Needs palm rejection and `touch-action: none` on the canvas for tablet use.

## 3. Tracing score (guidelines removed)

Hide the guideline and score how closely the drawn letter matches the target.

- Reuse the stroke data from (2): compare drawn strokes to reference strokes (resample, normalise, distance-based score).
- Consider stroke order and direction, not just shape overlap.
- Score should be forgiving and encouraging for a Year 1 child; thresholds need tuning on real handwriting.

## Suggested order

1 then 2 then 3. Each depends on the previous: the sheet defines the letter set, tracing needs stroke data for it, scoring reuses the same data.

## Bug: layout looks zoomed out on smaller screens

Needs device and orientation info from the user before fixing.

- Suspected cause: `.content` in `src/screens/shared.module.css` has no scaling below 640px (capped at 460px, 18px base font), then fixed `zoom` steps (1.25x to 1.85x) from 640px up. Large phones, landscape phones and small portrait tablets get the unscaled layout.
- Likely fix: replace the fixed `zoom` breakpoints with a fluid scale (`clamp()` on viewport width, limited by viewport height so landscape phones don't overflow).

## Content gaps vs the school's ELS sheet

- Done: the 24 graphemes missing from the bank (`nk`, soft `c` as `c_soft`, and 22 Phase 5 spellings).
- Done: alternative pronunciations of existing graphemes (26 entries, keyed `<grapheme>_<sound>`, e.g. `a_ar`, `y_igh`, `ch_k`).
- Open: the parent progress view shows the same label for each sound of a grapheme (e.g. several `a` rows), so it may need a sound hint.
