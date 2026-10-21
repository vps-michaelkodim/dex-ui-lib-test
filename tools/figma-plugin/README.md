# Figma-Plugin „DDS Export“

Exportiert aus dem DDS-Figma-File **Variablen, Text-/Effect-Styles und Icons** als eine JSON-Datei,
die `pnpm figma:import` ins Repo übernimmt. Kein Figma-Enterprise, kein Claude/MCP nötig.

## Einmalig installieren (Figma Desktop-App)

1. DDS-File öffnen
2. Menü **Plugins → Development → Import plugin from manifest…**
3. `tools/figma-plugin/manifest.json` aus diesem Repo auswählen

Danach unter **Plugins → Development → DDS Export (Dextinity UI)** verfügbar.

## Benutzen

1. Plugin starten → **Export** (Icons-Checkbox an lassen, dauert ein paar Sekunden)
2. `dds-export.json` landet im Download-Ordner
3. Im Repo:

```bash
pnpm figma:import ~/Downloads/dds-export.json --dry-run   # nur anschauen, was sich ändert
pnpm figma:import ~/Downloads/dds-export.json             # übernehmen + neu bauen
```

Siehe [`docs/TOKEN_SYNC.md`](../../docs/TOKEN_SYNC.md).
