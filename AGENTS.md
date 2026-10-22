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
  Fehlende Mac-Bilder für neue Fälle erzeugt der `pre-push`-Hook automatisch (`pnpm test:visual:new`) — Agents auf Linux müssen dafür nichts tun.
- Kontrast aller Component-Tokens: `pnpm contrast` → `docs/reports/contrast.md` (nach Token-Sync laufen lassen, neue Befunde in den Gap-Report).
- Story-Exports nie `Error` nennen (überschreibt das globale `Error` im Test) → `WithError` + `name: 'Error'`.

## Prototypen (Playground)

- Neue Datei `apps/playground/src/prototypes/<Name>.tsx` = neuer Prototyp (registriert sich selbst).
  Komponente exportieren, optional `export const title = 'Anzeigename'`. Link: `localhost:5173/#<name>`.
- Nur Komponenten aus `@dextinity/ui` + Token-Klassen. Fehlt eine Komponente: im Prototyp lokal bauen
  und als Kandidat notieren, nicht in `packages/ui` hacken.
- Der Playground ist in `SnackbarProvider` gewickelt → in Prototypen direkt `useSnackbar().show({...})`.
- App-Gerüst: `AppShell` + `AppBar` + `Toolbar` aus `@dextinity/ui`, Vorlage `apps/playground/src/prototypes/AppShell.tsx`.

## Manifest für AI-Tools / Claude Design System

- `ai/manifest.json` + `llms.txt` beschreiben die Library maschinenlesbar (Komponenten, Props, Figma-Nodes,
  Tokens je Theme × Brand, Icons). Generiert mit `pnpm manifest` — nie von Hand ändern.
- Nach Änderungen an Komponenten, Props, Tokens oder Icons: `pnpm manifest` laufen lassen und mitcommitten.
- Das Claude Design System ist ein **Abbild** des Repos und liest dieses Manifest. Komponenten entstehen nur im Repo.
- Claude-Skill für das Team: `ai/skills/dextinity-ui/SKILL.md` (Installation: `ai/skills/README.md`).

## Versionen & Changesets

DDS hat **eine** Versionsnummer für Figma, Storybook, Code, Tokens und das Claude Design System (SemVer, Lockstep).
Im Repo laufen alle `@dextinity/*`-Packages über [Changesets](https://changesets.dev) mit gleicher Nummer (`.changeset/config.json` → `fixed`).

**Agents schreiben Changesets selbst** — im selben Commit wie die Änderung, ohne Nachfrage:

- Pflicht bei allem, was Nutzer:innen der Library merken: Komponenten, Props, Verhalten, Styles, Tokens (auch nach `pnpm figma:import`), Icons.
- Kein Changeset bei: reinen Docs, Tests/Stories, Playground-Prototypen, Tooling/CI, Refactorings ohne sichtbare Wirkung.
- Datei: `.changeset/<kurzer-slug>.md` (z. B. `button-loading.md`), ein Changeset pro inhaltlicher Änderung:

  ```md
  ---
  '@dextinity/ui': minor
  ---

  Button: `loading` als eigene Property (zeigt Spinner, blockiert Klicks).
  ```

- Stufe — **vor 1.0.0** (aktuell): Breaking → `minor`, alles andere → `patch`. Nie `major` (das wäre der Sprung auf 1.0.0, den gibt Mitch frei).
- Stufe — **ab 1.0.0**: Breaking (umbenannt, entfernt, anderes Verhalten) → `major`, Neues → `minor`, Fixes → `patch`.
- Text: Deutsch, ein bis zwei Sätze, aus Sicht der Nutzer:innen, beginnt mit Komponente bzw. Bereich (`Button:`, `Tokens:`, `Icons:`).
  Bei Breaking zusätzlich: was man anpassen muss.
- Nur das betroffene Package eintragen — die anderen ziehen durch `fixed` automatisch mit.

**Release** (macht Mitch): `pnpm changeset:status` → `pnpm release:version` (Versionen, `CHANGELOG.md`, Manifest) → prüfen → committen → Tag `vX.Y.Z`.
Danach dieselbe Nummer in Figma (Variable `dds/version`, Changelog-Seite, Library-Publish) und im Claude Design System setzen.

## Befehle

```bash
pnpm storybook | pnpm playground | pnpm changeset | pnpm test | pnpm test:visual | pnpm manifest | pnpm contrast | pnpm typecheck | pnpm lint | pnpm format
```

## Git

- Feature-Branch pro Phase/Komponente, PR auf `main`.
- Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:` …).
- Änderung an Packages → Changeset im selben Commit (siehe oben).
