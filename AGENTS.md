# AGENTS.md

## Project overview

**云衣柜 (Cloud Wardrobe)** is an Expo / React Native mobile app (`cloud-wardrobe-ui`) for managing a digital wardrobe with camera and photo-library integration. The repo ships Expo config in `app.json` and EAS profiles in `eas.json`.

## Tech stack

- **Expo SDK 56** with React Native 0.85 and React 19
- **TypeScript** entry at `index.ts`, UI in `App.tsx`
- **Plugins (configured):** `expo-camera`, `expo-image-picker`, `expo-media-library`

## Common commands

| Task | Command |
|------|---------|
| Install deps | `npm install` |
| Start Metro (all platforms) | `npm start` |
| Web dev server | `npm run web` |
| Android | `npm run android` |
| iOS | `npm run ios` (macOS + simulator or Expo Go) |
| Typecheck | `npx tsc --noEmit` |

There is no ESLint, Prettier, or test runner configured in this repo yet.

## Cursor Cloud specific instructions

### Services

| Service | Required? | Notes |
|---------|-----------|-------|
| Expo Metro (`npm start` / `npm run web`) | **Yes** | Bundles the app; web is the easiest path in Cloud VMs |
| Expo Go / dev client / simulator | Optional | Needed for native camera flows on device |
| Backend API | **No** | Not present in this repo |

### Running in Cloud VMs

- Prefer **web** for quick verification: `CI=1 npx expo start --web --port 8081`
- Bind to port **8081** (Expo default). The app title in the browser tab should read **云衣柜**.
- Native camera and full media-library behavior require a physical device or emulator; web supports image picking via the browser file dialog (see `App.tsx`).
- Run Metro in a **tmux** session so it stays up across agent turns.
- After changing dependencies, restart Metro; hot reload usually picks up TS/TSX edits but not always `app.json` plugin changes.

### Repo notes

- `app.json` references `assets/splash.png` and `assets/favicon.png`; both are present under `assets/`.
- EAS CLI (`>= 16.13.3`) is required only for cloud builds (`eas build`), not for local Metro dev.
