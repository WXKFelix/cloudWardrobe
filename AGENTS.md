# AGENTS.md

## Project overview

**量化人生 (Quantified Life)** is an Expo / React Native app for tracking life trajectory (A→B→C), daily alignment check-ins, and structured decision support at key nodes (MVP: job offer).

Product and design docs: `docs/product/PRD.md`, `docs/development/README.md`, `docs/design/UI-SPEC.md`.

## Tech stack

- **Expo SDK 56** with React Native 0.85 and React 19
- **expo-router** for navigation
- **expo-sqlite** for local persistence
- **TypeScript** strict; path alias `@/*` → `src/*`

## Common commands

| Task | Command |
|------|---------|
| Install deps | `npm install` |
| Start Metro (all platforms) | `npm start` |
| Web dev server | `CI=1 npx expo start --web --port 8081` |
| Typecheck | `npx tsc --noEmit` |

There is no ESLint, Prettier, or test runner configured yet.

## Cursor Cloud specific instructions

- Prefer **web** for verification: `CI=1 npx expo start --web --port 8081`
- Browser tab title should read **量化人生**.
- Run Metro in a **tmux** session.
- MVP uses local SQLite; web SQLite support is enabled via expo-sqlite.

## Repo notes

- Entry: `expo-router/entry` (`app/` directory).
- EAS CLI is only required for cloud builds (`eas build`).
