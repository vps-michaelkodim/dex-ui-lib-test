# Token-Sync Figma → Code

Figma ist die Quelle für Tokens. Der Sync läuft in drei Schritten und ist komplett nachvollziehbar
(jede Änderung ist ein Git-Diff in `packages/tokens/figma/raw/`).

## 1. Prüfen, ob sich in Figma etwas geändert hat

Claude (oder jemand mit Figma MCP) führt `packages/tokens/figma/fingerprint.figma.js` im DDS-File aus
und speichert das Ergebnis als JSON. Dann:

```bash
node packages/tokens/scripts/fingerprint.mjs /pfad/zu/figma-fingerprint.json
# ✓ Primitives  ✓ Brand  ✗ Semantic › color/action  …
```

Zeigt pro Collection und Token-Gruppe, was abweicht.

## 2. Export

`packages/tokens/figma/export-variables.figma.js` im DDS-File ausführen (betroffene Collections
in `COLLECTIONS` eintragen) und das Ergebnis nach `packages/tokens/figma/raw/<collection>.json` schreiben.
Danach Schritt 1 wiederholen → muss überall ✓ zeigen.

Text- und Effect-Styles (`raw/styles.json`) werden aktuell manuell nachgezogen.

## 3. Build + Review

```bash
pnpm --filter @dextinity/tokens build
git diff packages/tokens          # Review: was ändert sich wirklich?
pnpm test                         # Stories inkl. a11y
```

PR mit dem Diff aufmachen. Neue Inkonsistenzen in `docs/figma-gap-report.md` eintragen.

## Später (Phase 6)

- Visueller Diff (Screenshots) für geänderte Tokens
- Figma-Dev-Plugin für Designer: Export per Klick ohne Claude/MCP
