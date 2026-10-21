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
- Danach werden Figma und Code synchron gehalten: Figma-Plugin „DDS Export“ → `pnpm figma:import` (siehe `docs/TOKEN_SYNC.md`).
  Generierte Dateien (`packages/tokens/css|dtcg`, `packages/icons/src/generated`) nie von Hand ändern.
- Ist Figma inkonsistent (hardcodierte Werte, fehlende Variablen, Props entgegen Conventions):
  im Code sauber lösen **und** in `docs/figma-gap-report.md` eintragen. Nicht stillschweigend abweichen.

## Komponenten bauen

1. Basis ist eine Base-UI-Primitive (`@base-ui/react`), wenn es eine passende gibt.
2. Styling nur mit Token-Klassen (siehe unten). Keine Hex-Werte, keine px-Magic-Numbers.
   Komponenten-spezifische Werte über ihre Component-Tokens: `px-(--dx-button-type-button-default-padding-horizontal)`.
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

## Tokens & Tailwind

Tokens kommen aus `@dextinity/tokens` (generiert aus Figma, siehe `packages/tokens/README.md`).
Tailwind ist auf die Tokens gemappt; die Default-Palette von Tailwind ist **deaktiviert**.

| Was         | Tailwind-Klassen (Beispiele)                                                           | Figma-Token                  |
| ----------- | -------------------------------------------------------------------------------------- | ---------------------------- |
| Hintergrund | `bg-background`, `bg-background-subtle`, `bg-background-muted`                         | `color/background/*`         |
| Text        | `text-foreground`, `text-foreground-muted`, `text-foreground-subtle`                   | `color/foreground/*`         |
| Rahmen      | `border-border`, `border-border-strong`, `border-border-field`                         | `color/border/*`             |
| Aktionen    | `bg-action-primary`, `hover:bg-action-primary-hover`, `text-action-primary-foreground` | `color/action/*`             |
| Feedback    | `bg-feedback-danger-subtle`, `text-feedback-success-foreground`                        | `color/feedback/*`           |
| Typo        | `typo-heading-h1-bold`, `typo-body-md-normal`, `typo-label-sm` (= Figma Text-Styles)   | Text-Styles                  |
| Größen      | `text-h1`, `text-body-sm` …                                                            | `typography/*` (responsive)  |
| Spacing     | `p-4` (=16px = `unit/4`), `gap-layout-md`                                              | `unit/*`, `space/layout/*`   |
| Radius      | `rounded-control`, `rounded-forms`, `rounded-surface`, `rounded-pill`, `rounded-md`    | `brand/radius/*`, `radius/*` |
| Schatten    | `shadow-sm` … `shadow-xl`                                                              | Effect Styles                |
| Komponenten | `h-(--dx-button-type-button-default-height)`, `bg-(--dx-chip-…)`                       | `Components/*`               |

Komplette Liste: `packages/tokens/tokens.meta.json` oder Storybook → Foundations.

## Theming

- Theme: `data-theme="light" | "dark" | "high-contrast"`, Brand: `data-brand="dextinity" | "crimson"`
- Am `<html>`, oder an einem Container — dann **beide** Attribute setzen.
- Tailwind-Varianten `dark:` / `hc:` gibt es, werden aber selten gebraucht: die Tokens wechseln selbst.

## Stories & Tests

- Jede Komponente: Story pro relevanter Variante + `play()` für Interaktion (Klick, Keyboard, Fokus).
- a11y-Verstöße (axe) lassen Tests fehlschlagen (`parameters.a11y.test = 'error'`).
- Titel-Schema: `Foundations/<Name>`, `Components/<Name>`, `Patterns/<Name>`.
- Neue Komponente → Matrix-/States-Story in `apps/storybook/visual/visual.test.tsx` (`CASES`) aufnehmen.
  Gewollte optische Änderung → `pnpm test:visual:update` (auf dem Mac) und Bilder committen. Siehe `docs/VISUAL_TESTS.md`.
- Story-Exports nie `Error` nennen (überschreibt das globale `Error` im Test) → `WithError` + `name: 'Error'`.

## Prototypen (Playground)

- Neue Datei `apps/playground/src/prototypes/<Name>.tsx`, Eintrag in `prototypes/index.ts`.
- Nur Komponenten aus `@dextinity/ui` + Token-Klassen. Fehlt eine Komponente: im Prototyp lokal bauen
  und als Kandidat notieren, nicht in `packages/ui` hacken.

## Befehle

```bash
pnpm storybook | pnpm playground | pnpm test | pnpm test:visual | pnpm typecheck | pnpm lint | pnpm format
```

## Git

- Feature-Branch pro Phase/Komponente, PR auf `main`.
- Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:` …).
