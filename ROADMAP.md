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
