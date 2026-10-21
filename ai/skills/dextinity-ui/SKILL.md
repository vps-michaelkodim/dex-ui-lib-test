---
name: dextinity-ui
description: Use when building or prototyping UI, screens or components for Dextinity (Admin, AI Hub, Chatbot): uses the Dextinity UI library (React, Base UI, Tailwind tokens) and its playground.
---

# Dextinity UI

Dextinity UI ist die Code-Library zum Figma-Design-System „DDS – Dextinity Admin UI“.
Wer für Dextinity UI baut (Screens, Prototypen, Komponenten), nutzt **diese** Library — keine eigenen Buttons,
keine fremden UI-Kits, keine freien Farben.

- Repo (public): https://github.com/vps-michaelkodim/dex-ui-lib-test
- Figma: https://www.figma.com/design/xAe7acdpccDSRCrfeOdAg3/DDS---Dextinity-Admin-UI---V-0.1

## 1. Erst lesen, dann bauen

Vor dem ersten Code immer:

1. `llms.txt` (Überblick + Regeln) und `AGENTS.md` im Repo-Root.
2. `ai/manifest.json` für Details: alle Komponenten mit Props (inkl. erlaubter Werte und Figma-Mapping),
   Codebeispiele, Tokens je Theme × Brand, Tailwind-Klassen, Text-Styles, 286 Icons mit Suchbegriffen.

Ohne lokales Repo: dieselben Dateien über
`https://raw.githubusercontent.com/vps-michaelkodim/dex-ui-lib-test/main/<pfad>` lesen.
Nie Props, Varianten oder Icons raten — im Manifest nachschlagen.

## 2. Wo gebaut wird

| Aufgabe                                    | Ort                                                                                                                               |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| Prototyp / Screen / Idee                   | `apps/playground/src/prototypes/<Name>.tsx` + Eintrag in `apps/playground/src/prototypes/index.ts`, starten mit `pnpm playground` |
| Neue oder geänderte Komponente der Library | `packages/ui/src/components/<name>/` — nur wenn ausdrücklich gewünscht und es die Komponente in Figma gibt (siehe Abschnitt 6)    |
| Tokens, Icons                              | nie von Hand — kommen per Figma-Sync (`pnpm figma:import`)                                                                        |

Für einen Prototyp nie `packages/ui` ändern.

## 3. Regeln für den Code

- Komponenten nur aus `@dextinity/ui`, Icons nur aus `@dextinity/icons` (`<SearchIcon />`, 16px, Farbe = Textfarbe).
- Styling nur mit Token-Klassen. Tailwinds Default-Farben sind deaktiviert, Hex-Werte verboten.
  - Flächen: `bg-background`, `bg-background-subtle`, `bg-background-muted`
  - Text: `text-foreground`, `text-foreground-muted`, `text-foreground-subtle`
  - Rahmen: `border-border`, `border-border-strong`
  - Aktionen/Feedback: `bg-action-primary`, `text-feedback-danger-foreground`, `bg-feedback-success-subtle` …
  - Typo = Figma-Text-Styles: `typo-heading-h2-bold`, `typo-body-md-normal`, `typo-label-sm` …
  - Spacing: `p-4` = 16px (4px-Raster), Layout: `gap-layout-md`; Radius: `rounded-surface`, `rounded-control`, `rounded-forms`; Schatten: `shadow-sm` … `shadow-xl`
- Props wie in Figma (camelCase): `variant`, `color`, `size="default" | "small"`, `disabled`, `loading`, `startIcon`, `endIcon`, `children`.
- Barrierefreiheit:
  - `IconButton` immer mit `aria-label`.
  - Eingabefelder immer mit `label` (oder `aria-label`), Validierung über `status="error"` + `helperText`.
  - Tooltip nur für Zusatzinfos, nie für Pflichtinfos.
- UI-Texte auf Deutsch, informelles „du“.
- Themes testen: `data-theme="light" | "dark" | "high-contrast"` und `data-brand="dextinity" | "crimson"` am `<html>` (im Playground per Auswahl links).

## 4. Komponenten (Stand Manifest — bei Abweichung gilt das Manifest)

- `Button` — variant contained/outlined/text, color primary/secondary/error/success, size, loading, startIcon/endIcon, `render={<a href="…" />}` + `nativeButton={false}` für Links
- `IconButton` — wie Button, `children` = Icon, `aria-label` Pflicht
- `Input` — label, required, helperText, status error/success/warning, readOnly, loading, startAdornment/endAdornment, maxLength + showCount
- `FormLabel`, `FormHelperText` — Bausteine für eigene Feld-Layouts
- `Chip` — variant contained/outlined, 6 Farben, onClick (Filter), onDelete (entfernbar)
- `Tooltip` — content, title, color light/dark/success/error/warning, side/align
- `Spinner`

Noch **nicht** in der Library (gibt es nur als Figma-Komponente/Tokens): Select, Checkbox, Radio, Switch, Search, Main Navigation, Dialog, Snackbar.

## 5. Wenn eine Komponente fehlt

Im Prototyp lokal nachbauen, nur mit Token-Klassen (die Component-Tokens wie `--dx-select-*` existieren bereits),
und deutlich markieren:

```tsx
// TODO(@dextinity/ui): Kandidat für die Library — Figma: 03 Components / Form – Select
```

Dem User sagen, dass das ein Platzhalter ist und die echte Komponente zuerst im Repo (aus Figma) entstehen muss.
Nicht als fertige Library-Komponente ausgeben.

## 6. Komponenten für die Library bauen (nur auf ausdrücklichen Wunsch)

Ablauf wie bei den bestehenden (Vorbild: `packages/ui/src/components/button/`):
Figma-Komponente + Properties auslesen → Base-UI-Primitive → Farben/Größen über Component-Tokens als CSS-Variablen →
Stories mit `play()`-Tests (Story-Export nie `Error` nennen) + `parameters.design: figmaDesign('<node>')` →
in `apps/storybook/visual/visual.test.tsx` (`CASES`) aufnehmen → `pnpm manifest` → Abweichungen in Figma in
`docs/figma-gap-report.md` eintragen.

## 7. Prüfen, bevor du fertig meldest

```bash
pnpm typecheck && pnpm lint      # immer
pnpm test                        # bei Komponenten-Änderungen (Interaktion + a11y)
pnpm test:visual                 # bei optischen Änderungen an Komponenten (nur auf dem Mac aussagekräftig)
pnpm manifest                    # bei Änderungen an Komponenten, Props, Tokens, Icons — mitcommitten
```

Bekannte Kontrastprobleme kommen aus Figma (Gap-Report) — nicht eigenmächtig Farben ändern.

## 8. Git

- Nie direkt auf `main` committen. Eigener Branch von `main` ohne Tracking:
  `git fetch && git switch -c <typ>/<thema> --no-track origin/main`
- Direkt vor jedem Commit `git branch --show-current` und `git status` prüfen — oft arbeiten mehrere parallel im Repo.
- Änderungen kommen per Pull Request auf `main` (z.B. über GitHub Desktop: Publish branch → Create Pull Request).
- Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`).

## 9. Rolle des Claude Design Systems

Das Claude Design System ist ein **Abbild** des Repos und liest `ai/manifest.json`. Dort nie Komponenten
erfinden oder nachbauen, die nicht im Manifest stehen; Schriften wie im Manifest (Crimson: Source Sans Pro, nicht Source Sans 3).
