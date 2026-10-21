# Roadmap

Stand: 2026-10-21

| Phase | Inhalt                                                                                                                                                         | Status                      |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| 0     | Monorepo, TypeScript, Lint/Format, Storybook (a11y + Vitest), Playground, AGENTS.md                                                                            | ✅                          |
| 1     | Tokens: Figma-Export → DTCG → Style Dictionary → CSS-Vars + Tailwind-`@theme`; Light/Dark/HC + Multi-Brand; Foundations-Stories; Fingerprint-Check; Gap-Report | ✅                          |
| 2     | Icons: Export aus „Iconography“ → SVGR → `@dextinity/icons`, Icon-Galerie                                                                                      | ✅ (Voll-Export per Plugin) |
| 3     | Button + Icon Button                                                                                                                                           | ✅                          |
| 4     | Input (Field-Architektur: Label, Helper, Error)                                                                                                                | ✅                          |
| 5     | Chip + Tooltip                                                                                                                                                 | ✅                          |
| 6     | Visual Regression (Screenshot-Baselines) + Figma-vs-Code-Diff fertig verdrahten                                                                                | ✅                          |
| 7     | AI-Schicht: `llms.txt`, Component-Manifest / Storybook MCP, Claude-Skill „Dextinity UI“                                                                        |                             |

**Phase 2 (später):** Distribution (npm-Package + shadcn-Registry), Storybook-Hosting, weitere Komponenten
(Dialog, Form-Familie, Main Navigation, Snackbar, Spinner, Typography), Chatbot-Komponenten.

## Entscheidungen

- Stack: React 19 + Base UI + Tailwind v4, pnpm workspaces, TypeScript
- Figma ist initial die Wahrheit, danach Sync; Inkonsistenzen → Gap-Report
- Props 1:1 aus Figma (camelCase); `_`-Props/States sind keine React-Props
- Kein Figma Code Connect in v1
- Storybook vorerst nur lokal
