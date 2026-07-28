# Undercover

A pass-and-play, mobile-first web version of the party game **Undercover** — one shared device, hidden roles, and a scoreboard that survives across games.

**Play it now: https://bassirousanokho.github.io/undercover_the_game/**

Installable as an app on both phone and computer — see [Install the app](#install-the-app) below.

## Table of contents

- [How the game works](#how-the-game-works)
- [Features](#features)
- [Install the app](#install-the-app)
- [Local development](#local-development)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Game flow (state machine)](#game-flow-state-machine)
- [Testing](#testing)
- [Deployment](#deployment)
- [Known limitations](#known-limitations)

## How the game works

Undercover is played with 3 or more players, in person, passing one device around the table.

- One player is **Mr. White**. He receives no word at all.
- One player is the **Undercover**. They receive a word that's close in meaning to the civilians' word, but not identical.
- Everyone else is a **Civilian**. They all receive the same word.
- Nobody is told anyone else's role.

Once everyone has privately seen their word, players take turns saying one word out loud that's connected to their own secret word (Mr. White has no word, so he has to bluff). After each round of clues, the table votes on who to eliminate. The eliminated player's role is revealed.

**Win conditions**, checked in this order after every elimination:

1. If **Mr. White** is eliminated, he gets one chance to guess the civilians' word. Guess correctly → **Mr. White wins** immediately.
2. If exactly **2 players remain** and the Undercover is one of them → **Undercover wins** immediately (this can happen even if Mr. White already failed his guess earlier).
3. If both the Undercover and Mr. White have been eliminated (and Mr. White didn't guess correctly) → **Civilians win**.
4. Otherwise, the game continues to another round of clues and voting.

For larger groups, the app scales the number of Undercover/Mr. White roles automatically (configurable on the setup screen):

| Players | Civilians | Undercover | Mr. White |
|---|---|---|---|
| 3–7 | rest | 1 | 1 |
| 8–11 | rest | 2 | 1 |
| 12+ | rest | 2 | 2 |

## Features

- **Pass-and-play flow** — one screen per step (word reveal, clue turn order, voting), designed so only the player currently holding the phone sees anything private.
- **Automatic win-condition tracking** — no need to keep track of who's out or who won; the app enforces turn order, tallies votes, handles tie-break revotes, and resolves the win conditions above.
- **Scoreboard** — every player on the winning side gets +1 point at the end of each game. Scores persist across games (and across page reloads) until you reset them.
- **Navigation controls** — Home, Restart (reshuffle roles for the same players), Reset scores, and a scoped "Previous" to undo a misclick during reveal, clues, or voting.
- **Bilingual** — French and English, switchable at any time from the setup screen.
- **Configurable word themes** — animals, food, jobs, objects, places, sports, nature, or a random mix.
- **Installable PWA** — works offline after first load, and installs to your home screen or desktop like a native app.
- **No backend, no accounts** — all game state lives in the browser (`localStorage`); nothing is sent to a server.

## Install the app

The game is an installable web app (PWA). Once installed it opens in its own window without browser chrome, and keeps working offline.

**Android (Chrome):**
1. Open https://bassirousanokho.github.io/undercover_the_game/
2. Tap the **⋮** menu → **Install app** (or **Add to Home screen**).

**iPhone/iPad (Safari):**
1. Open https://bassirousanokho.github.io/undercover_the_game/
2. Tap the **Share** icon → **Add to Home Screen**.

*(Safari doesn't show an automatic install prompt for PWAs — this manual step is required on iOS.)*

**Desktop (Chrome / Edge):**
1. Open https://bassirousanokho.github.io/undercover_the_game/
2. Click the **install icon** in the address bar (or ⋮ menu → **Install Undercover…**).

## Local development

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). All players share the one device running the dev server: enter names on the setup screen, then pass the device around as prompted.

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the local dev server |
| `npm run build` | Production build (static export, written to `out/`) |
| `npm run start` | Serve the production build (`next start`) |
| `npm test` | Run the Vitest unit test suite |
| `npm run lint` | Run ESLint |

### Environment variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_BASE_PATH` | URL sub-path to deploy under (e.g. `/undercover_the_game` for GitHub Pages). Leave unset for local dev / root-domain hosting. |

## Tech stack

- **Next.js** (App Router) with `output: "export"` — the whole app is a static site, no server required.
- **TypeScript**
- **Tailwind CSS**
- **Zustand** (with the `persist` middleware) for game state, saved to `localStorage` so a page refresh mid-game doesn't lose progress.
- **Vitest** for unit tests.
- A hand-written **service worker** (`public/sw.js`) for offline caching, plus a generated **Web App Manifest** (`src/app/manifest.ts`) for installability.

There is no backend and no database — everything (role assignment, turn order, scoring, win conditions) runs client-side.

## Project structure

```
src/
  app/
    page.tsx              — phase-driven single-page shell (renders the current screen)
    layout.tsx             — root layout, PWA metadata, service worker registration
    manifest.ts             — Web App Manifest (basePath-aware)
    icon.png / apple-icon.png / favicon.ico  — app icons (see public/ for manifest icon sizes)
  components/
    PlayerSetupForm.tsx     — setup screen (players, roles, theme, language)
    WordRevealCard.tsx      — private word reveal, one player at a time
    ClueTurnOrder.tsx       — tracks whose turn it is to give a clue
    VotingPanel.tsx         — private per-player voting, with tie-break revotes
    EliminationReveal.tsx   — shows who was eliminated and their role
    MrWhiteGuessForm.tsx    — Mr. White's word-guess flow
    GameOverScreen.tsx      — winner, full role reveal, scoreboard, replay options
    NavBar.tsx              — Home / Previous / Restart / Reset navigation
    ScoreTable.tsx          — renders the persistent scoreboard
    ServiceWorkerRegister.tsx
  lib/
    gameStore.ts             — Zustand store: the entire game state machine
    roleAssignment.ts        — role scaling, shuffling, turn-order rotation
    winConditions.ts         — win-condition precedence logic
    scoring.ts                — +1-per-win scoreboard logic
    normalizeGuess.ts         — accent/case-insensitive guess matching for Mr. White
    wordBank.ts               — static bilingual word-pair list, grouped by theme
    i18n/                     — French/English dictionaries + translation helper
    __tests__/                — Vitest unit tests for all of the above
public/
  sw.js                       — offline-caching service worker
  icon-192.png, icon-512.png, icon-maskable-512.png  — manifest icon sizes
.github/workflows/deploy.yml  — CI: lint + test + build + deploy to GitHub Pages
```

## Game flow (state machine)

The entire game is one Zustand store (`src/lib/gameStore.ts`) moving through a fixed set of phases:

```
setup → reveal → clue → vote → elimination → (mrwhite-guess?) → clue (next round) → … → gameover
```

- **setup** — enter players, configure roles/theme/language.
- **reveal** — each player privately taps to see their word, then passes the device on.
- **clue** — tracks whose turn it is to say a clue out loud (the app doesn't capture the spoken word — that part happens at the table).
- **vote** — each player privately picks who to eliminate; ties trigger one automatic revote among the tied players, then a random tie-break if still tied.
- **elimination** — reveals who was voted out and their role.
- **mrwhite-guess** — only entered if the eliminated player was Mr. White; he guesses the civilians' word.
- **gameover** — shows the winner, the full role reveal, and the updated scoreboard.

Turn order is fixed per game (shuffled once at the start, guaranteed not to start with Mr. White) and rotates by one seat each round, skipping eliminated players.

## Testing

```bash
npm test
```

36 unit tests cover the parts of the game where a silent bug would actually break gameplay:

- Role scaling and assignment for different player counts
- Turn-order rotation and filtering of eliminated players
- Vote tallying and tie-break revotes
- Every win-condition precedence case (including the subtle "Undercover wins at last-2 even if Mr. White already failed" rule)
- Mr. White's guess normalization (accents, case, punctuation)
- Scoreboard accumulation across successive games
- The "Previous" undo action, scoped to reveal/clue/vote only

## Deployment

Every push to `main` runs `.github/workflows/deploy.yml`, which:

1. Installs dependencies
2. Runs `npm run lint` and `npm test`
3. Builds a static export (`npm run build`) with `NEXT_PUBLIC_BASE_PATH=/undercover_the_game`
4. Publishes the `out/` directory to GitHub Pages via `actions/deploy-pages`

GitHub Pages is configured with **Source: GitHub Actions** (Settings → Pages) — no separate `gh-pages` branch is used.

To deploy elsewhere (or at the domain root), just build without `NEXT_PUBLIC_BASE_PATH` set.

## Known limitations

- **No online/remote multiplayer** — this is pass-and-play on a single shared device by design. Playing remotely would need a real backend with rooms and websockets, which is a different app.
- **No LLM word generation** — an earlier version could generate word pairs via an API route, but GitHub Pages only serves static files, so that route was removed. Word pairs come from the built-in bilingual list.
- **Clue text isn't captured** — players say their clue out loud at the table; the app only tracks whose turn it is, not what was said.
