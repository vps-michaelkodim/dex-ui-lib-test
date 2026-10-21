# Dextinity UI

React-Komponenten, Design Tokens und Icons für Dextinity (Admin + Chatbot) — gebaut aus dem Figma-File
[DDS – Dextinity Admin UI – V 0.1](https://www.figma.com/design/xAe7acdpccDSRCrfeOdAg3/DDS---Dextinity-Admin-UI---V-0.1).

Für Devs, UX-Designer und AI-Tools (Vibe Coding, Gen-AI-Prototypen).

## Quick Start

```bash
corepack enable                          # einmalig, aktiviert pnpm
pnpm install
pnpm test:setup                          # einmalig: Chromium für Tests

pnpm storybook      # http://localhost:6006
pnpm playground     # http://localhost:5173 — Prototypen bauen
pnpm test           # alle Stories als Tests (Interaction + a11y)
pnpm test:visual    # Screenshot-Vergleich (siehe docs/VISUAL_TESTS.md)
pnpm figma:import <dds-export.json>   # Sync aus Figma (siehe docs/TOKEN_SYNC.md)
```

Node ≥ 22 (`.nvmrc`).

## Struktur

```
packages/
  tokens/      @dextinity/tokens  Figma-Variablen → DTCG → CSS-Variablen + Tailwind-Theme
  icons/       @dextinity/icons   Figma-Icons → React-Komponenten
  ui/          @dextinity/ui      Komponenten (React + Base UI + Tailwind v4)
apps/
  storybook/   Doku, Review, Tests
  playground/  Vite-App zum Prototypen-Bauen
docs/          Roadmap, Figma-Gap-Report, Sync, Visual Tests
tools/         Figma-Plugin „DDS Export“
scripts/       figma-import
```

## Regeln

Alles, was Menschen und AI-Agents beim Arbeiten im Repo beachten müssen, steht in [`AGENTS.md`](./AGENTS.md).

## Roadmap

[`docs/ROADMAP.md`](./docs/ROADMAP.md)
