# Roadmap

Future work, not yet started.

## 1. Sound sheet (teacher's worksheet) - done

Built as a Sound sheet screen (Setup > Sound sheet): tiles by year group, tap for the phrase with the sound highlighted, and a Practise button. Data in `src/content/soundSheet.ts`. No pictures yet (the sheet's artwork is copyrighted); own illustrations or emoji would be a follow-up.

Display the official sounds and the class "remember it" phrases from Freddie's teacher's worksheet in a fun, kid-friendly way.

- Needs the worksheet content as data (sound, memory phrase/action), kept separate from presentation like `src/content/`.
- Presentation should plug into the existing skin system (`src/skins/`).

## 2. Letter tracing - done

Built as a "Trace it" screen reached from a sound's card on the sound sheet. Stroke data for a-z is in `src/content/letterStrokes.ts` (own hand-built shapes, not the school's font) and is what stage 3 scores against. Split digraphs (`a-e`) are not traceable yet.

Stylus and finger drawing to trace each letter over a guideline.

- Pointer Events on a canvas (handles pen, touch and mouse with one code path).
- Per-letter guide paths stored as stroke data (ordered strokes with direction), not images.
- Needs palm rejection and `touch-action: none` on the canvas for tablet use.

## 3. Tracing score (guidelines removed) - done

A "Write it" mode on the trace screen hides the guide, shows only the writing lines and letter boxes, and scores the result on Check (stars, a 0-100 score and one hint). The scoring is `src/content/scoring.ts`; `npm run check:scoring` calibrates it on synthetic handwriting (good, fair and messy attempts, wrong letters, backwards strokes, scribbles). Shape is judged after fitting to the letter's box, so size and position are scored separately and weigh less; mirror images are never accepted.

Open:
- Thresholds are calibrated on synthetic handwriting, not real children. Try Freddie's attempts and adjust `STAR_THRESHOLDS` and `D_MAX` if it is too harsh or too kind.
- Near-twin letters (g/q, d/a) can still reach 2 stars when written as each other.
- Scores are not saved or shown in the parent view yet.

## Suggested order

1 then 2 then 3. Each depends on the previous: the sheet defines the letter set, tracing needs stroke data for it, scoring reuses the same data.

## Bug: layout looks zoomed out on smaller screens - fixed

Zoom tiers are now height-aware and landscape phones lay the round screen out side by side (stage 1). If it still looks small on the S26 Ultra, the real CSS viewport size is needed to tune the tiers.

## Content gaps vs the school's ELS sheet

- Done: the 24 graphemes missing from the bank (`nk`, soft `c` as `c_soft`, and 22 Phase 5 spellings).
- Done: alternative pronunciations of existing graphemes (26 entries, keyed `<grapheme>_<sound>`, e.g. `a_ar`, `y_igh`, `ch_k`).
- Open: the parent progress view shows the same label for each sound of a grapheme (e.g. several `a` rows), so it may need a sound hint.
