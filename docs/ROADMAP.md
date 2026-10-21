# Roadmap

Stand: 2026-10-21

| Phase | Inhalt                                                                                                                                                         | Status                                         |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| 0     | Monorepo, TypeScript, Lint/Format, Storybook (a11y + Vitest), Playground, AGENTS.md                                                                            | ✅                                             |
| 1     | Tokens: Figma-Export → DTCG → Style Dictionary → CSS-Vars + Tailwind-`@theme`; Light/Dark/HC + Multi-Brand; Foundations-Stories; Fingerprint-Check; Gap-Report | ✅                                             |
| 2     | Icons: Export aus „Iconography“ → SVGR → `@dextinity/icons`, Icon-Galerie                                                                                      | ✅ (Voll-Export per Plugin)                    |
| 3     | Button + Icon Button                                                                                                                                           | ✅                                             |
| 4     | Input (Field-Architektur: Label, Helper, Error)                                                                                                                | ✅                                             |
| 5     | Chip + Tooltip                                                                                                                                                 | ✅                                             |
| 6     | Visual Regression (Screenshot-Baselines) + Figma-vs-Code-Diff fertig verdrahten                                                                                | ✅                                             |
| 7     | AI-Schicht: `llms.txt`, Component-Manifest / Storybook MCP, Claude-Skill „Dextinity UI“                                                                        | ✅ (Manifest, llms.txt, Skill; MCP verschoben) |

## Nächste Phasen: Rest aus Figma umsetzen

Stand der Figma-Inventur: 2026-10-21 (Seite `03 Components`). Reihenfolge: **Formulare zuerst** (Tokens vollständig,
Muster wie Input, in fast jedem Screen nötig), danach App-Gerüst, zuletzt was in Figma noch Vorarbeit braucht.

| Phase | Inhalt | Figma (Node) | Base UI | Tokens | Status |
| ----- | ------ | ------------ | ------- | ------ | ------ |
| 8  | **Checkbox, Radio, Switch** + `CheckboxGroup`, `RadioGroup` | Checkbox `1185:18566` · Radio Button `1186:18562` · Switch `1187:18556` | Checkbox, CheckboxGroup, Radio, RadioGroup, Switch | ✅ `checkbox/*`, `radio-button/*`, `switch/*` | offen |
| 9  | **Select** (Trigger, Menü, Option) | Select `1194:18744` · Select Option `1195:97` · Select Menu `1195:98` | Select | ✅ `select/*` | offen |
| 10 | **Search** (Feld mit Lupe, Löschen, Loading) | Search `1190:18720` | Input + Field (wie `Input`) | ✅ `search/*` | offen |
| 11 | **Form-Layout**: 1/2 Spalten, Divider; Platzhalter in Prototypen ersetzen | Form Layout 1 Col `1175:26023` · 2 Cols `1157:25413` · Form divider `1208:30200` | Fieldset, Form | Semantic/Layout | offen |
| 12 | **Typography**-Komponente (`<Text variant>`) | Typography `1088:30` | — | Text-Styles | offen, Figma klären |
| 13 | **Main Navigation** (Item 3 Ebenen, Section Header) + App-Shell-Pattern im Playground | Main Navigation Item `301:58` · Menu Section Header `548:7693` | Collapsible (+ Links) | ✅ `main-navigation/*` | offen |
| 14 | **Dialog** (Container SM–XL, Header, Actions, Slot) | Dialog `829:4250` · Container `192:355` · Header `829:2396` · Actions `829:2435` | Dialog, AlertDialog | ❌ keine Dialog-Tokens | offen, Figma-Vorarbeit |
| 15 | **Snackbar** | Seite `Snackbar` ist **leer** | Toast | ❌ | blockiert: erst Design |

### Pro Phase (Definition of Done)

Ablauf wie [README → Workflow 2](../README.md#2-komponente-neu-oder-geändert-figma--code):

1. Figma-Properties + Component-Tokens auslesen, Abweichungen sofort in den Gap-Report.
2. Komponente in `packages/ui/src/components/<name>/`, Props 1:1 aus Figma (`Children` → `children`,
   `_State`/`_Show …` sind keine Props), Fehler/Status über Base UI Field wie bei `Input`.
3. Stories mit `play()` (Maus + Tastatur), `figmaDesign('<node>')`, a11y grün oder begründet `todo`.
4. Screenshot-Fall in `visual/visual.test.tsx`, Baselines auf dem Mac.
5. `pnpm typecheck && pnpm lint && pnpm test && pnpm manifest`, Changeset (`minor`), README/Introduction-Liste aktualisieren.
6. Prototypen mit passenden `TODO(@dextinity/ui)`-Platzhaltern umstellen (Workflow 5).
7. PR → Merge → Claude Design System aktualisieren (Workflow 3).

### Figma-Vorarbeit / offene Fragen

| Thema | Problem | Braucht |
| ----- | ------- | ------- |
| Dialog | Keine Component-Tokens (Radius, Padding, Schatten, Overlay) | Design: Tokens `dialog/*` anlegen — sonst Bau aus Semantic + Gap-Report |
| Snackbar | Seite leer | Design: Komponente + Tokens entwerfen |
| Typography | Varianten (`Body/L`, `Caption`, `Label/Large`, `Data/M` …) passen nicht zu den 24 Text-Styles (`Body/LG`, `Label/MD` …) | Design: Mapping festlegen oder Varianten an Styles angleichen |
| Main Navigation | `Menu Section Header` hat Property `state` (klein) und `Show Add Icon`; Item hat sichtbares `State` statt `_State` | Design: Benennung angleichen (Hover ist kein Prop) |
| Tabelle | Gibt es in Figma nicht, Prototypen bauen sie nach (Benutzerliste) | Design: entscheiden, ob Table ins DDS kommt |
| Patterns / Templates | Seiten `04 Patterns`, `05 Templates` sind „TBD“ | später: App-Shell, Formularseite, Listenseite |

### Danach

Storybook MCP (bewusst verschoben: experimentell, nur für lokale Agents), Distribution (npm-Package + shadcn-Registry),
Storybook-Hosting, Chatbot-Komponenten, Patterns/Templates aus `04`/`05`.

## Entscheidungen

- Stack: React 19 + Base UI + Tailwind v4, pnpm workspaces, TypeScript
- Figma ist initial die Wahrheit, danach Sync; Inkonsistenzen → Gap-Report
- Props 1:1 aus Figma (camelCase); `_`-Props/States sind keine React-Props
- Kein Figma Code Connect in v1
- Storybook vorerst nur lokal
