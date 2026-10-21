# AGENTS.md — Dextinity UI

Regeln für AI-Agents (Claude, Cursor, Copilot …) und Menschen. Kurz halten, aktuell halten.

## Was das Repo ist

Code-Umsetzung des Figma-Design-Systems **DDS – Dextinity Admin UI**
(`figma.com/design/xAe7acdpccDSRCrfeOdAg3`). Monorepo mit pnpm workspaces.

| Package             | Zweck                                                   |
| ------------------- | ------------------------------------------------------- |
| `@dextinity/tokens` | Tokens aus Figma-Variablen (DTCG → CSS-Vars + `@theme`) |
| `@dextinity/icons`  | Icons aus Figma als React-Komponenten                   |
| `@dextinity/ui`     | Komponenten: React 19 + Base UI + Tailwind v4           |
| `apps/storybook`    | Doku + Tests (jede Story = Test inkl. axe-a11y)         |
| `apps/playground`   | Prototypen: `src/prototypes/<Name>.tsx`                 |

## Source of Truth

- **Initial: Figma ist die Wahrheit.** Werte, Props, Varianten kommen aus Figma.
- Danach werden Figma und Code synchron gehalten (Token-Sync mit Diff-Report).
- Ist Figma inkonsistent (hardcodierte Werte, fehlende Variablen, Props entgegen Conventions):
  im Code sauber lösen **und** in `docs/figma-gap-report.md` eintragen. Nicht stillschweigend abweichen.

## Komponenten bauen

1. Basis ist eine Base-UI-Primitive (`@base-ui/react`), wenn es eine passende gibt.
2. Styling nur mit Tailwind-Klassen, die auf **Token-Variablen** zeigen. Keine Hex-Werte, keine px-Magic-Numbers.
3. Varianten mit `cva`, Klassen mergen mit `cn()` aus `src/lib/cn.ts`.
4. Datei-Layout pro Komponente:
   ```
   packages/ui/src/components/button/
     Button.tsx           Implementierung
     Button.stories.tsx   Stories (= Tests)
     index.ts             Re-Export
   ```
5. Export in `packages/ui/src/index.ts` ergänzen.

### Prop-API = Figma-Props (1:1, camelCase)

| Figma                                | React                                                            |
| ------------------------------------ | ---------------------------------------------------------------- |
| `Size = Default / Small / Large`     | `size?: 'default' \| 'small' \| 'large'` (Default = `'default'`) |
| `Disabled` (Boolean)                 | `disabled?: boolean`                                             |
| `Loading` (Boolean)                  | `loading?: boolean`                                              |
| `Children` (Hauptinhalt, z.B. Label) | `children`                                                       |
| `_State = Hover / Focus / Pressed …` | **kein Prop** — CSS-Pseudoklassen / Base-UI-Data-Attribute       |
| `_Irgendwas` (mit Unterstrich)       | **kein Prop** — nur Figma-intern                                 |

Zusätzlich immer: `className` und `ref` durchreichen, restliche native Props spreaden.

## Theming

- Theme am `<html>`: `data-theme="light" | "dark" | "high-contrast"`
- Brand am `<html>`: `data-brand="default" | …`
- Tailwind-Varianten: `dark:` und `hc:` (definiert in `packages/ui/src/styles.css`).
- Komponenten nutzen nur semantische Tokens, nie Primitives.

## Stories & Tests

- Jede Komponente: Story pro relevanter Variante + `play()` für Interaktion (Klick, Keyboard, Fokus).
- a11y-Verstöße (axe) lassen Tests fehlschlagen (`parameters.a11y.test = 'error'`).
- Titel-Schema: `Foundations/<Name>`, `Components/<Name>`, `Patterns/<Name>`.

## Prototypen (Playground)

- Neue Datei `apps/playground/src/prototypes/<Name>.tsx`, Eintrag in `prototypes/index.ts`.
- Nur Komponenten aus `@dextinity/ui` + Token-Klassen. Fehlt eine Komponente: im Prototyp lokal bauen
  und als Kandidat notieren, nicht in `packages/ui` hacken.

## Befehle

```bash
pnpm storybook | pnpm playground | pnpm test | pnpm typecheck | pnpm lint | pnpm format
```

## Git

- Feature-Branch pro Phase/Komponente, PR auf `main`.
- Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:` …).
