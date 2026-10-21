# Dextinity UI

Die Code-Umsetzung des Figma-Design-Systems
[DDS – Dextinity Admin UI](https://www.figma.com/design/xAe7acdpccDSRCrfeOdAg3/DDS---Dextinity-Admin-UI---V-0.1):
Tokens, Icons und React-Komponenten aus **einer** Quelle, für Admin, AI Hub und Chatbot.
Für Devs, UX-Designer:innen und AI-Tools (Vibe Coding, Gen-AI-Prototypen).

**Figma ist die Quelle.** Variablen, Styles und Icons kommen per Sync ins Repo, Komponenten werden 1:1 nach den
Figma-Properties gebaut. Fehler und Lücken in Figma landen im [Gap-Report](./docs/figma-gap-report.md),
statt im Code still „korrigiert“ zu werden.

## Was das Repo kann

| Bereich                       | Umfang                                                                                      |
| ----------------------------- | ------------------------------------------------------------------------------------------- |
| **Tokens**                    | 1.239 Figma-Variablen in 5 Ebenen (Primitives → Brand → Semantic → Responsive → Components) |
| **Themes & Brands**           | Light, Dark, High Contrast × Dextinity, Crimson — umschaltbar per Attribut                  |
| **Typografie**                | 24 Figma-Text-Styles als Klassen (`typo-*`), responsive (Mobile < 1024px)                   |
| **Spacing, Radius, Schatten** | 4px-Raster, Layout-Abstände, Radius-Rollen je Brand, 5 Schatten                             |
| **Icons**                     | 286 Icons aus Figma als React-Komponenten                                                   |
| **Komponenten**               | Button, IconButton, Input (+ FormLabel, FormHelperText), Chip, Tooltip, Spinner             |
| **Storybook**                 | Doku, Live-Props, Figma-Frame daneben, a11y-Check, Theme-/Brand-Umschalter                  |
| **Playground**                | Klickbare Prototypen mit der echten Library — ein Prototyp = eine Datei                     |
| **Figma-Sync**                | Plugin „DDS Export“ + `pnpm figma:import` mit Änderungsbericht                              |
| **Tests**                     | Interaktion + a11y je Story, Screenshot-Vergleich, Kontrast-Audit                           |
| **AI-ready**                  | `AGENTS.md`, `llms.txt`, `ai/manifest.json`, Claude-Skill „dextinity-ui“                    |

Noch nicht umgesetzt (in Figma vorhanden): Select, Checkbox, Radio, Switch, Search, Main Navigation, Dialog, Snackbar.
Was als Nächstes kommt: [Roadmap](./docs/ROADMAP.md).

## Quick Start

Node ≥ 22 (`.nvmrc`).

```bash
corepack enable && pnpm install
pnpm test:setup     # einmalig: Chromium für Tests

pnpm storybook      # Doku + Komponenten, http://localhost:6006
pnpm playground     # Prototypen, http://localhost:5173
```

## Verwenden

```css
@import '@dextinity/ui/fonts.css'; /* Inter, Source Sans Pro */
@import '@dextinity/ui/styles.css'; /* Tailwind v4 + Tokens */
```

```tsx
// <html data-theme="light" data-brand="dextinity">
import { Button, Input, Tooltip, IconButton } from '@dextinity/ui';
import { EditIcon } from '@dextinity/icons';

<Input label="E-Mail" type="email" required helperText="Wir schicken dir einen Link." />
<Tooltip content="Bearbeiten">
  <IconButton aria-label="Bearbeiten" variant="text" color="secondary"><EditIcon /></IconButton>
</Tooltip>
<Button className="mt-layout-md">Speichern</Button>
```

- **Styling nur mit Token-Klassen:** `bg-background-subtle`, `text-foreground-muted`, `border-border`,
  `typo-heading-h2-bold`, `rounded-surface`, `shadow-md` … Tailwinds Default-Palette ist **aus**, Hex-Werte gibt es nicht.
- **Props = Figma-Properties** in camelCase; `_State` (Hover/Focus) ist kein Prop.
- **Themes:** `data-theme="light | dark | high-contrast"` und `data-brand="dextinity | crimson"` am `<html>`
  oder an einem Container. Die Tokens wechseln selbst, `dark:`-Klassen braucht es kaum.
- **Basis:** React 19, [Base UI](https://base-ui.com) (Tastatur, Fokus, ARIA), Tailwind v4.

## Prototypen bauen

Neue Datei `apps/playground/src/prototypes/<Name>.tsx` — sie erscheint automatisch im Playground:

```tsx
import { Button } from '@dextinity/ui';
import { PlusIcon } from '@dextinity/icons';

export const title = 'Benutzerliste'; // optional, sonst Dateiname

export function UserList() {
  return <Button startIcon={<PlusIcon />}>Benutzer einladen</Button>;
}
```

`pnpm playground` → `http://localhost:5173/#user-list`. Theme und Brand links umschalten.
Fehlt eine Komponente, wird sie im Prototyp mit Token-Klassen nachgebaut und als `TODO(@dextinity/ui)` markiert.

## Packages und Struktur

| Package             | Inhalt                                                                |
| ------------------- | --------------------------------------------------------------------- |
| `@dextinity/tokens` | CSS-Variablen `--dx-*`, Tailwind-Theme, DTCG-JSON, `tokens.meta.json` |
| `@dextinity/icons`  | 286 React-Icons (`size`, `title`, Farbe = `currentColor`)             |
| `@dextinity/ui`     | Komponenten + `styles.css` / `fonts.css`                              |

```
packages/tokens      Figma-Variablen → DTCG → CSS-Variablen + Tailwind-Theme
packages/icons       Figma-Icons → React-Komponenten
packages/ui          Komponenten (React + Base UI + Tailwind v4)
apps/storybook       Doku, Review, Tests, Screenshot-Referenzen
apps/playground      Vite-App für Prototypen
ai/                  Manifest + Claude-Skill
docs/                Roadmap, Gap-Report, Sync, Visual Tests, Kontrast-Report
tools/figma-plugin   Figma-Plugin „DDS Export“
scripts/             Figma-Import, Manifest, Kontrast-Audit
```

## Figma → Code

1. In Figma ändern (Variablen, Styles, Icons).
2. Plugin **DDS Export** ausführen → `dds-export.json`.
3. `pnpm figma:import dds-export.json` (erst mit `--dry-run`) — zeigt genau, was sich geändert hat, und baut Tokens/Icons neu.
4. Pull Request: Änderungen als Diff, optische Änderungen über die Screenshot-Tests.

Neue Props, Varianten oder Komponenten werden von Hand nachgezogen. Details: [docs/TOKEN_SYNC.md](./docs/TOKEN_SYNC.md).

## Befehle

| Befehl                                               | Was                                                                               |
| ---------------------------------------------------- | --------------------------------------------------------------------------------- |
| `pnpm storybook` · `pnpm playground`                 | Doku bzw. Prototypen starten                                                      |
| `pnpm test`                                          | jede Story ist ein Test (Klick, Tastatur, axe/a11y)                               |
| `pnpm test:visual` · `pnpm test:visual:update`       | 36 Screenshots (Themes × Brands), Referenz = Mac — [Doku](./docs/VISUAL_TESTS.md) |
| `pnpm typecheck` · `pnpm lint` · `pnpm format:check` | Typen, Lint, Format                                                               |
| `pnpm figma:import <json>`                           | Sync aus Figma                                                                    |
| `pnpm tokens:build` · `pnpm tokens:check`            | Tokens neu bauen bzw. prüfen, ob sie zum Figma-Export passen                      |
| `pnpm contrast`                                      | Kontrast aller Component-Tokens in 6 Modi → `docs/reports/contrast.md`            |
| `pnpm manifest`                                      | `ai/manifest.json` + `llms.txt` neu erzeugen                                      |
| `pnpm build-storybook`                               | Storybook als statische Seite bauen                                               |

## Für AI-Tools

- [`AGENTS.md`](./AGENTS.md): Regeln fürs Arbeiten im Repo (Claude Code liest sie über `CLAUDE.md`).
- [`llms.txt`](./llms.txt) + [`ai/manifest.json`](./ai/manifest.json): Komponenten, Props, Figma-Nodes, Tokens je
  Theme × Brand, Icons mit Suchbegriffen — generiert, nie von Hand ändern.
- [`ai/skills/dextinity-ui`](./ai/skills/): Claude-Skill zum Installieren — Claude baut damit Screens und Prototypen
  mit genau dieser Library.
- Das **Claude Design System** ist ein Abbild dieses Repos und liest das Manifest.

## Mitarbeiten

Branch von `main` → Änderung → `pnpm typecheck && pnpm lint && pnpm test` (bei Optik zusätzlich `pnpm test:visual`) →
bei Komponenten/Tokens/Icons `pnpm manifest` → Pull Request. Alle Regeln: [`AGENTS.md`](./AGENTS.md).
