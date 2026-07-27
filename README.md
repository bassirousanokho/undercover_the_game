# undercover_the_game

A pass-and-play web version of the party game **Undercover**, built with Next.js (App Router), TypeScript, Tailwind CSS, and Zustand.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. All players share one device: names are entered on the setup screen, then the device is passed around to reveal each word, give clues, vote, and (if unmasked) let Mr. White guess.

Optional: set `ANTHROPIC_API_KEY` in a `.env.local` file to let the app generate fresh word pairs with an LLM instead of only picking from the built-in list.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` / `npm run start` — production build and start
- `npm test` — run the Vitest unit tests (role assignment, turn order, win conditions, guess normalization)
- `npm run lint` — run ESLint
