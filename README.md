# Dextinity UI

Die Code-Umsetzung des Figma-Design-Systems
[DDS – Dextinity Admin UI](https://www.figma.com/design/xAe7acdpccDSRCrfeOdAg3/DDS---Dextinity-Admin-UI---V-0.1):
Tokens, Icons und React-Komponenten aus **einer** Quelle, für Admin, AI Hub und Chatbot.
Für Devs, UX-Designer:innen und AI-Tools (Vibe Coding, Gen-AI-Prototypen).

**Figma ist die Quelle.** Variablen, Styles und Icons kommen per Sync ins Repo, Komponenten werden 1:1 nach den
Figma-Properties gebaut. Fehler und Lücken in Figma landen im [Gap-Report](./docs/figma-gap-report.md),
statt im Code still „korrigiert“ zu werden.

## Was das Repo kann

| Bereich                       | Umfang                                                                                                                                                                          |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Tokens**                    | 1.239 Figma-Variablen in 5 Ebenen (Primitives → Brand → Semantic → Responsive → Components)                                                                                     |
| **Themes & Brands**           | Light, Dark, High Contrast × Dextinity, Crimson — umschaltbar per Attribut                                                                                                      |
| **Typografie**                | 24 Figma-Text-Styles als Klassen (`typo-*`), responsive (Mobile < 1024px)                                                                                                       |
| **Spacing, Radius, Schatten** | 4px-Raster, Layout-Abstände, Radius-Rollen je Brand, 5 Schatten                                                                                                                 |
| **Icons**                     | 286 Icons aus Figma als React-Komponenten                                                                                                                                       |
| **Komponenten**               | Button, IconButton, Input, Select, Search, Checkbox, Radio, Switch, Form-Layout (Form, FormField, FormDivider), Text, Main Navigation, Dialog, Snackbar, Chip, Tooltip, Spinner |
| **Patterns**                  | Toolbar (Seitenkopf: Breadcrumb, Zurück, Titel, Info, Support Text, Aktionen)                                                                                                   |
| **Storybook**                 | Doku, Live-Props, Figma-Frame daneben, a11y-Check, Theme-/Brand-Umschalter                                                                                                      |
| **Playground**                | Klickbare Prototypen mit der echten Library — ein Prototyp = eine Datei                                                                                                         |
| **Figma-Sync**                | Plugin „DDS Export“ + `pnpm figma:import` mit Änderungsbericht                                                                                                                  |
| **Tests**                     | Interaktion + a11y je Story, Screenshot-Vergleich, Kontrast-Audit                                                                                                               |
| **AI-ready**                  | `AGENTS.md`, `llms.txt`, `ai/manifest.json`, Claude-Skill „dextinity-ui“                                                                                                        |

Alle Komponenten aus Figma `03 Components` sind umgesetzt. Als Nächstes: Patterns/Templates, Tabelle (sobald in Figma), Distribution.
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

## Workflows

### Wie die Teile zusammenhängen

```
Figma (DDS)  ──Sync──▶  Repo (main)  ──▶  Storybook · Playground · npm-Pakete (später)
     ▲                      │
     │                      ├──pnpm manifest──▶  ai/manifest.json + llms.txt
     │                      │                         │
     │                      │                         ├──▶  Claude Design System (Abbild)
     │                      │                         └──▶  Claude-Skill „dextinity-ui“
     └──── Gap-Report ◀─────┘
```

**Die Richtung ist immer gleich:** Figma → Repo → alles andere. Das Claude Design System, der Skill und Prototypen
sind Abnehmer und werden nie zur Quelle. Was in Figma falsch ist, wird in Figma gefixt (über den Gap-Report),
nicht im Code oder im Design System „übermalt“.

### Wenn …, dann …

| Wenn …                                                          | dann …                                                                                                                 |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| in Figma Farben, Abstände, Schriften oder Icons geändert wurden | Export + Import → [Workflow 1](#1-tokens-styles-icons-figma--code)                                                     |
| eine Komponente in Figma neu ist oder neue Properties hat       | von Hand nachbauen → [Workflow 2](#2-komponente-neu-oder-geändert-figma--code)                                         |
| etwas auf `main` gemergt wurde                                  | Claude Design System aktualisieren → [Workflow 3](#3-code--claude-design-system)                                       |
| das Claude Design System einen Fehler oder eine Lücke meldet    | im Repo fixen, nie im Design System → [Workflow 3](#3-code--claude-design-system), Schritt 4                           |
| ich einen Screen oder eine Idee ausprobieren will               | Prototyp im Playground → [Workflow 4](#4-prototyp-bauen)                                                               |
| einem Prototyp eine Komponente fehlt                            | im Prototyp nachbauen + `TODO(@dextinity/ui)` → [Workflow 4](#4-prototyp-bauen)                                        |
| ein Platzhalter eine echte Komponente werden soll               | → [Workflow 5](#5-prototyp-platzhalter--library-komponente)                                                            |
| in Figma etwas falsch ist (Kontrast, falsche Bindung …)         | Eintrag im [Gap-Report](./docs/figma-gap-report.md), Fix in Figma → [Workflow 6](#6-gap-report-abarbeiten-code--figma) |
| ein Gap-Report-Eintrag in Figma behoben wurde                   | Export + Import, Workaround im Code zurückbauen → [Workflow 6](#6-gap-report-abarbeiten-code--figma)                   |
| `pnpm test:visual` rot ist                                      | ungewollt → Code fixen · gewollt → `pnpm test:visual:update` (Mac) + Bilder committen                                  |
| `pnpm contrast` neue Befunde zeigt                              | in den Gap-Report eintragen, Farben nicht im Code ändern                                                               |
| der Import eine neue Collection oder einen neuen Mode meldet    | Skripte erweitern → [docs/TOKEN_SYNC.md](./docs/TOKEN_SYNC.md)                                                         |
| Komponenten, Props, Tokens oder Icons geändert wurden           | `pnpm manifest` laufen lassen und mitcommitten                                                                         |
| ein im Code benutztes Icon in Figma gelöscht/umbenannt wurde    | `pnpm typecheck` zeigt die Stelle → Icon ersetzen oder mit Design klären                                               |
| sich der Skill-Text ändern soll                                 | `ai/skills/dextinity-ui/SKILL.md` per PR ändern, danach Skill neu installieren                                         |

Jede Änderung am Repo läuft gleich: eigener Branch von `main` → Änderung → Prüfen → Pull Request → Merge.
Nie direkt auf `main`.

### 1. Tokens, Styles, Icons (Figma → Code)

Gilt für Variablen, Text-/Effect-Styles und Icons — alles, was der Export automatisch erfasst.

> **Warum ein eigenes Figma-Plugin?** Das Plugin [„DDS Export“](./tools/figma-plugin/README.md) ist der offizielle
> Sync-Weg fürs Team:
>
> - **Unabhängig:** Jede:r kann den Sync machen, ohne Claude, Figma-MCP oder Enterprise-Plan. Die Figma-REST-API
>   liefert Variablen nur mit Enterprise, das Plugin läuft direkt in Figma.
> - **Vollständig:** Ein Klick exportiert alle Variablen, Styles und die 286 Icons als SVG.
> - **Nachvollziehbar:** Die `dds-export.json` ist ein fester Stand. `pnpm figma:import` zeigt genau, was sich seit
>   dem letzten Sync geändert hat, und das landet als Diff im PR.
>
> Claude kann über den Figma-Zugang auch direkt in die Datei schauen und einzelne Tokens übernehmen — eine Abkürzung,
> kein Ersatz. Danach muss der Stand trotzdem exakt gleich sein (Fingerprint-Check, siehe [TOKEN_SYNC](./docs/TOKEN_SYNC.md)).

| #   | Wer        | Schritt                                                                                                                                                 |
| --- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Design     | In Figma ändern. Nur Variablen/Styles verwenden, keine lokalen Werte. Hilfskomponenten mit `_` beginnen (werden ignoriert).                             |
| 2   | Design     | Plugin **Plugins → Development → DDS Export** → `dds-export.json` speichern und an Dev geben (oder selbst weiter).                                      |
| 3   | Dev        | Branch: `git switch -c chore/figma-sync-<datum> origin/main`                                                                                            |
| 4   | Dev        | Vorschau: `pnpm figma:import dds-export.json --dry-run` — listet neu / geändert / gelöscht je Collection und Icons.                                     |
| 5   | Dev        | Unerwartetes (z. B. gelöschtes Icon, neue Collection) mit Design klären, bevor übernommen wird.                                                         |
| 6   | Dev        | Übernehmen: `pnpm figma:import dds-export.json` — schreibt Roh-Dateien + SVGs, baut Tokens/Icons neu und legt ein Changeset „Sync mit Figma DDS vX“ an. |
| 7   | Dev        | Prüfen: `pnpm typecheck && pnpm lint && pnpm test`                                                                                                      |
| 8   | Dev        | Optik: `pnpm test:visual`. Gewollte Änderung → `pnpm test:visual:update`, Bilder mitcommitten (auf dem Mac).                                            |
| 9   | Dev        | `pnpm contrast` → neue Befunde in `docs/reports/contrast.md` in den Gap-Report übernehmen.                                                              |
| 10  | Dev        | `pnpm manifest` (AI-Dateien aktualisieren) und alles committen.                                                                                         |
| 11  | Dev+Design | PR: Design prüft Diff und Vorher/Nachher-Bilder, dann Merge.                                                                                            |
| 12  | —          | Danach [Workflow 3](#3-code--claude-design-system), damit das Claude Design System nachzieht.                                                           |

Details und Sonderfälle (neue Collection, neuer Mode): [docs/TOKEN_SYNC.md](./docs/TOKEN_SYNC.md).

### 2. Komponente neu oder geändert (Figma → Code)

Komponenten werden **nicht** automatisch exportiert, sondern von Hand nach Figma gebaut.

1. **Design:** Komponente in Figma fertigstellen — Properties benennen, wie sie im Code heißen sollen
   (`variant`, `color`, `size`, `startIcon` …), alle Farben/Größen über Component-Tokens (`03 Components / …`).
2. **Design → Dev:** Link auf das Component Set schicken. Fehlen Component-Tokens, zuerst [Workflow 1](#1-tokens-styles-icons-figma--code).
3. **Dev:** Branch `feat/<komponente>`. Figma-Properties auslesen (Figma MCP oder Dev Mode).
4. **Dev:** Bauen in `packages/ui/src/components/<name>/` — Vorbild ist `button/`:
   Base-UI-Primitive für Verhalten, Component-Tokens als CSS-Variablen, Props 1:1 = Figma-Properties (camelCase),
   `_State` (Hover/Focus/Pressed) ist kein Prop.
5. **Dev:** Stories mit `play()`-Tests (Klick, Tastatur) und `parameters.design: figmaDesign('<node-id>')`
   → in Storybook steht der Figma-Frame neben der Code-Version.
6. **Dev:** Für Screenshot-Tests in `apps/storybook/visual/visual.test.tsx` (`CASES`) eintragen,
   `pnpm test:visual:update` (Mac).
7. **Dev:** Export in `packages/ui/src/index.ts`, dann `pnpm typecheck && pnpm lint && pnpm test && pnpm manifest`.
8. **Dev:** Was in Figma nicht stimmt (fehlende Tokens, Kontrast, Inkonsistenzen) in den
   [Gap-Report](./docs/figma-gap-report.md) — im Code sauber lösen, nicht still abweichen.
9. **Design + Dev:** Review in Storybook (Docs-Seite, Design-Tab, alle Themes/Brands), dann PR mergen.
10. Danach [Workflow 3](#3-code--claude-design-system). Gab es Prototyp-Platzhalter dafür → [Workflow 5](#5-prototyp-platzhalter--library-komponente).

Regeln im Detail: [`AGENTS.md`](./AGENTS.md).

### 3. Code → Claude Design System

Das Claude Design System ist ein **Abbild** des Repos. Es liest `ai/manifest.json` (Komponenten, Props, Tokens je
Theme × Brand, Text-Styles, Icons) und `llms.txt` von `main`.

1. Sicherstellen, dass die Änderung auf `main` gemergt ist **und** `pnpm manifest` im PR mitgelaufen ist
   (sonst sieht das Design System den alten Stand).
2. Im Claude Design System die Aktualisierung aus dem Repo anstoßen (neu aus `main` bauen lassen).
3. Kontrollieren: neue/geänderte Komponenten, Farben in allen Themes, Schriften (Crimson = Source Sans Pro).
4. Meldet das Design System Lücken oder Fehler (fehlende Props, Kontrast …): **im Repo** beheben
   (Issue/Branch → PR → `pnpm manifest`), danach wieder Schritt 2. Nie im Design System selbst nachbauen oder
   Komponenten erfinden, die nicht im Manifest stehen.

Der Claude-Skill „dextinity-ui“ liest das Manifest direkt aus dem Repo und braucht keine Aktualisierung —
außer der Skill-Text selbst ändert sich (`ai/skills/dextinity-ui/SKILL.md`, dann neu installieren).

### 4. Prototyp bauen

1. `pnpm playground` starten (oder Claude mit dem Skill „dextinity-ui“ bitten, z. B.
   „Bau mir im Dextinity-Playground eine Benutzerliste“).
2. Neue Datei `apps/playground/src/prototypes/<Name>.tsx` — erscheint automatisch, siehe [Prototypen bauen](#prototypen-bauen).
3. Nur `@dextinity/ui`, `@dextinity/icons` und Token-Klassen. In allen Themes/Brands ansehen (links umschalten).
4. Fehlende Komponente → im Prototyp nachbauen und markieren:
   `// TODO(@dextinity/ui): Kandidat — Figma: <Komponente>`
5. Behalten? Branch `feat/prototype-<name>`, `pnpm typecheck && pnpm lint`, PR. Wegwerf-Prototypen nicht committen.

### 5. Prototyp-Platzhalter → Library-Komponente

1. Kandidaten finden: `grep -rn "TODO(@dextinity/ui)" apps/playground`
2. Gibt es die Komponente in Figma? Nein → zuerst Design (in Figma anlegen). Ja → [Workflow 2](#2-komponente-neu-oder-geändert-figma--code).
3. Nach dem Merge: Platzhalter in den Prototypen durch die echte Komponente ersetzen, `TODO` entfernen.

### 6. Gap-Report abarbeiten (Code → Figma)

Der [Gap-Report](./docs/figma-gap-report.md) ist die To-do-Liste für Figma
(🔴 sichtbar · 🟡 Konsistenz · ⚪ kosmetisch).

1. **Design:** Eintrag in Figma beheben.
2. Export + Import wie in [Workflow 1](#1-tokens-styles-icons-figma--code). Der Dry-Run zeigt, ob die Änderung ankommt.
3. Hatte der Code einen Workaround (Spalte „Lösung im Code“), diesen im selben PR zurückbauen.
   Bei Kontrast-Fixes: `pnpm contrast` und in Stories `a11y.test: 'todo'` wieder auf Standard setzen.
4. Zeile im Gap-Report auf ✅ setzen, PR mergen.

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

Branch von `main` (`git switch -c <typ>/<thema> --no-track origin/main`) → Änderung →
`pnpm typecheck && pnpm lint && pnpm test` (bei Optik zusätzlich `pnpm test:visual`) →
bei Komponenten/Tokens/Icons `pnpm manifest` → Pull Request → Merge.
Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`). Alle Regeln: [`AGENTS.md`](./AGENTS.md).
