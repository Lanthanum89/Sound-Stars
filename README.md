# Sound Stars

Phonics flashcard app for the UK Year 1 National Phonics Screening Check (Summer Term).

Timed flashcard rounds over Phase 2-5 graphemes and tricky words. A parent or teacher
marks each answer correct/incorrect; no accounts, no backend, no persistence.

## Stack

- React + TypeScript + Vite
- Deployed to GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`)

## Content

`src/content/phonicsGraphemeBank.ts` holds the grapheme and tricky-word banks (Crown
copyright, [Open Government Licence v3.0](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/)).
`src/content/deck.ts` turns that raw content into normalized `FlashcardItem`s that
presentation components consume — content and presentation are kept decoupled so
visual "skins" (flowers, dinosaurs, trains, etc.) can be layered on later without
touching the phonics data or deck-building logic.

## Develop

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
```

Pushing to `main` deploys `dist/` to GitHub Pages automatically.
