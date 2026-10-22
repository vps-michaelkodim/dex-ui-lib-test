# Screenshot-Tests (Visual Regression)

Ausgewählte Stories werden in 4 Modi fotografiert (Light, Dark, High Contrast · Dextinity, Light · Crimson)
und mit Referenzbildern verglichen. Eine Abweichung, auch eine kleine Farbänderung, lässt den Test fehlschlagen.

```bash
pnpm test:visual          # vergleichen
pnpm test:visual:new      # nur fehlende Referenzbilder erzeugen (z.B. neue Komponente)
pnpm test:visual:update   # alle Referenzbilder neu erzeugen
```

**Automatisch beim Push:** Der `pre-push`-Hook (`.githooks/pre-push`, aktiv nach `pnpm install`) prüft auf dem Mac,
ob für einen Fall in `CASES` Mac-Referenzbilder fehlen. Wenn ja: Bilder erzeugen, als eigenen Commit
`test(visual): …` committen und den Push einmal abbrechen → einfach nochmal pushen. Geänderte Bilder
(gewollte Design-Änderungen) bleiben bewusst Handarbeit mit `pnpm test:visual:update` — außer nach einem
**Figma-Sync**: Ändert der Branch den Roh-Export (`packages/tokens/figma/raw`, `packages/icons/svg|logos`) und noch
kein Referenzbild, erzeugt der Hook alle Bilder neu und committet sie.
Überspringen: `git push --no-verify`.

## Ablauf

1. **Einmalig / nach gewollten Design-Änderungen:** `pnpm test:visual:update` → Referenzbilder in
   `apps/storybook/visual/__screenshots__/` entstehen bzw. werden überschrieben → im PR mitcommitten.
   Im PR-Diff sieht man die Bilder vorher/nachher.
2. **Bei jeder Änderung:** `pnpm test:visual`. Schlägt etwas fehl, liegen unter
   `apps/storybook/.vitest/attachments/` je Test ein **actual**- und ein **diff**-Bild (rot = Abweichung).
   - Ungewollt → Code fixen.
   - Gewollt (z.B. Token-Update aus Figma) → `pnpm test:visual:update` und Bilder committen.

## Wichtig

- Referenzbilder sind **betriebssystemabhängig** (Dateiname endet auf `-chromium-darwin.png`).
  Maßgeblich sind die **Mac-Bilder**. Auf Linux/Windows fehlen Referenzen → dort nicht ausführen
  bzw. eigene Bilder erzeugen, die nicht committet werden.
- Getrennt von `pnpm test` (Interaktion + a11y), weil die Bilder plattformabhängig sind.
- Welche Stories fotografiert werden: `apps/storybook/visual/visual.test.tsx` → `CASES`.
  Neue Komponente → dort eintragen.
- Toleranz: `threshold 0.02` pro Pixel, max. 0,2 % abweichende Pixel (`vitest.visual.config.ts`).
