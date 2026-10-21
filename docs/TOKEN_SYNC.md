# Sync Figma → Code

Figma ist die Quelle für Tokens, Styles und Icons. Der Sync läuft über das Figma-Plugin
**DDS Export** ([`tools/figma-plugin`](../tools/figma-plugin/README.md)) und ein Import-Skript.
Jede Änderung ist danach ein normaler Git-Diff.

## Ablauf

```bash
# 1. In Figma: Plugins → Development → DDS Export → Export  (→ ~/Downloads/dds-export.json)

# 2. Branch
git checkout main && git pull && git checkout -b chore/figma-sync-<datum>

# 3. Was hat sich geändert?
pnpm figma:import ~/Downloads/dds-export.json --dry-run
#   Figma-Version: DDS v0.1.1 → DDS v0.1.2
#   ✓ Primitives: 300 Variablen — unverändert
#   ● Semantic: 92 Variablen
#     neu (1)   color/background/brand
#   ● Icons: 286
#     geändert (2) …

# 4. Übernehmen (schreibt raw-Dateien + SVGs, baut Tokens und Icons neu,
#    legt ein Changeset „Sync mit Figma DDS vX“ an → Text/Stufe prüfen)
pnpm figma:import ~/Downloads/dds-export.json

# 5. Prüfen
git diff --stat
pnpm typecheck           # z.B. wenn ein benutztes Icon in Figma gelöscht/umbenannt wurde
pnpm test                # Interaktion + a11y
pnpm test:visual         # optische Auswirkungen; gewollt → pnpm test:visual:update
pnpm contrast            # Kontrast-Audit → docs/reports/contrast.md (neue Befunde → Gap-Report)
pnpm manifest            # ai/manifest.json + llms.txt aktualisieren

# 6. PR mit dem Diff (+ ggf. neuen Referenzbildern)
```

## Was wo landet

| Aus Figma                  | Roh-Export (Quelle)                           | Generiert                           |
| -------------------------- | --------------------------------------------- | ----------------------------------- |
| Variablen (5 Collections)  | `packages/tokens/figma/raw/<collection>.json` | `css/`, `dtcg/`, `tokens.meta.json` |
| Text- & Effect-Styles      | `packages/tokens/figma/raw/styles.json`       | `typo-*`-Utilities, `shadow-*`      |
| Icons (Page „Iconography“) | `packages/icons/svg/*.svg`                    | `packages/icons/src/generated/`     |

Nie die generierten Dateien von Hand ändern. `pnpm tokens:check` prüft, ob sie zum Roh-Export passen.

## Neue Collection / neuer Mode in Figma

Der Import meldet neue Collections als Warnung. Dann in `scripts/figma-import.mjs` (`COLLECTION_FILES`)
und `packages/tokens/scripts/build.mjs` (`COLLECTIONS`, Selektoren) eintragen. Neue Modes einer
bestehenden Collection brauchen einen CSS-Selektor in `build.mjs`.

## Für Claude / Figma MCP

`packages/tokens/figma/fingerprint.figma.js` per `use_figma` ausführen und das Ergebnis mit
`node packages/tokens/scripts/fingerprint.mjs <datei.json>` vergleichen → zeigt, welche
Token-Gruppen abweichen, ohne kompletten Export.

## Figma-Version

Das Figma-File führt seinen Stand in der Variable `version` (Collection Primitives, z. B. „DDS v0.1.1“).
Der Import zeigt Änderungen daran an und legt ein Changeset an (Stufe nach `AGENTS.md` → „Versionen & Changesets“);
Storybook (Introduction), `ai/manifest.json` (`figmaVersion`) und `llms.txt` zeigen den zuletzt synchronisierten Stand.
DDS hat **eine** Versionsnummer für Figma und Code: Nach einem Release (`pnpm release:version`) dieselbe Nummer in
Figma setzen. Weichen „Code“ und „Stand Figma“ in Storybook ab, ist eins von beiden noch nicht nachgezogen.
