---
name: dextinity-ui
description: Use when building or prototyping UI, screens or components for Dextinity (Admin, AI Hub, Chatbot): uses the Dextinity UI library (React, Base UI, Tailwind tokens) and its playground.
---

# Dextinity UI

Code-Library zum Figma-Design-System „DDS – Dextinity Admin UI“. Für Dextinity-UI immer **diese** Library —
keine eigenen Buttons, keine fremden UI-Kits, keine freien Farben.

- Repo: https://github.com/vps-michaelkodim/dex-ui-lib-test (ohne lokales Repo: Dateien über
  `https://raw.githubusercontent.com/vps-michaelkodim/dex-ui-lib-test/main/<pfad>` lesen)
- Figma: https://www.figma.com/design/xAe7acdpccDSRCrfeOdAg3/DDS---Dextinity-Admin-UI---V-0.1

## 1. Erst lesen

`AGENTS.md` (Regeln, Ablauf) und `ai/manifest.json` (Komponenten, Props, Tokens, Text-Styles, Icons).
Props, Varianten, Klassen und Icons nie raten — im Manifest nachschlagen. Bei Widerspruch gilt das Manifest.

## 2. Prototyp bauen (Standardfall)

1. Neue Datei `apps/playground/src/prototypes/<Name>.tsx` — registriert sich selbst, sonst nichts anlegen.
2. Komponente exportieren, optional `export const title = 'Anzeigename'`.
3. `pnpm playground` → `http://localhost:5173/#<name>` (kebab-case), Theme + Brand links umschalten.

```tsx
import { Button } from '@dextinity/ui';
import { PlusIcon } from '@dextinity/icons';

export const title = 'Benutzerliste';

export function UserList() {
  return (
    <div className="p-8">
      <h2 className="typo-heading-h2-bold">Benutzer</h2>
      <Button startIcon={<PlusIcon />}>Benutzer anlegen</Button>
    </div>
  );
}
```

Für einen Prototyp nie `packages/ui`, Tokens oder Icons ändern.

## 3. Regeln

- Nur `@dextinity/ui` + `@dextinity/icons`. Styling nur mit Token-Klassen (`bg-background`, `text-foreground-muted`,
  `border-border`, `typo-body-md-normal`, `rounded-control` …) — Hex-Werte und Tailwind-Default-Farben gibt es nicht.
- a11y: `IconButton` mit `aria-label`, Felder mit `label`, Fehler über `status="error"` + `helperText`.
- UI-Texte Deutsch, „du“.
- Fehlt eine Komponente (z. B. Select, Checkbox, Dialog): im Prototyp mit Token-Klassen nachbauen, markieren mit
  `// TODO(@dextinity/ui): Kandidat — Figma: <Komponente>` und dem User sagen, dass es ein Platzhalter ist.
- Library-Komponenten nur auf ausdrücklichen Wunsch — Ablauf steht in `AGENTS.md`.

## 4. Fertig melden

`pnpm typecheck && pnpm lint`. Bei Library-Änderungen zusätzlich `pnpm test` und `pnpm manifest` (siehe `AGENTS.md`).

## 5. Git

Eigener Branch, nie `main`: `git fetch && git switch -c <typ>/<thema> --no-track origin/main`.
Vor jedem Commit `git branch --show-current` + `git status` prüfen (es wird oft parallel gearbeitet).
Conventional Commits (`feat:`, `fix:`, `docs:`).
