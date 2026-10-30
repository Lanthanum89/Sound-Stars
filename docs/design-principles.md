# Design principles

A short guard against drifting back to a generic "friendly app" look. Written after a design
critique of the setup screen (see the PR that added it).

- **One shape language.** Controls use `--radius-m` (12px), cards `--radius-l` (16px), inputs
  `--radius-s` (8px). Circles are for icon buttons only.
- **Flat by default.** Controls and cards are outlined (`1.5px solid var(--edge)`), with no
  bottom edge and no drop shadow. Only a modal floating over a scrim keeps a shadow.
- **One chunky control per screen.** The main action (Let's go, Play again, Check my writing,
  the correct and incorrect buttons) is the only thing with a hard bottom edge and a solid warm
  fill. No gradient, no glow, no idle animation.
- **One "selected" look.** A pale tint, a dark outline and a tick (`--selected-bg`,
  `--selected-edge`). It never uses the main-button colour. Colour is kept for meaning:
  stars, correct and incorrect.
- **Instructions are a quieter voice than controls.** Group labels are small, uppercase body
  text; the rounded display face is for titles and buttons.
- **The mascot is a guide, not a logo.** It sits beside a short instruction.
- **Themes are artwork, not swatches.** A theme is shown by its character.
- **The background is one scene.** A few things that move, anchored to the edges, never behind
  the form's controls.
- **Don't fake "human".** No random rotation, rough edges or uneven spacing.
