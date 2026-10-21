# @dextinity/tokens

Design Tokens aus dem Figma-File **DDS – Dextinity Admin UI** — 1.239 Variablen in 5 Collections,
24 Text-Styles, 5 Shadow-Styles.

```
figma/raw/*.json     Roh-Export aus Figma (Quelle, nicht von Hand ändern)
        │  pnpm --filter @dextinity/tokens build
        ▼
dtcg/*.json          DTCG-Format, eine Datei pro Collection × Mode   (für Tools/AI)
css/tokens.css       CSS-Variablen --dx-*, Themes/Brands per data-Attribut
css/theme.css        Tailwind v4 @theme + typo-* Utilities
css/safelist.css     nur für Storybook-Doku
tokens.meta.json     flache Liste aller Tokens inkl. aufgelöster Werte
```

## Ebenen

| Collection | Modes                      | CSS                                                  | Wer nutzt es                                |
| ---------- | -------------------------- | ---------------------------------------------------- | ------------------------------------------- |
| Primitives | Default                    | `--dx-primitive-*`                                   | Brand, Semantic (nie direkt in Komponenten) |
| Brand      | Dextinity, Crimson         | `--dx-brand-*` · `[data-brand]`                      | Semantic, Components                        |
| Semantic   | Light, Dark, High Contrast | `--dx-color-*`, `--dx-focus-ring-*` · `[data-theme]` | Komponenten, Apps, Tailwind-Klassen         |
| Responsive | Desktop, Mobile (< 1024px) | `--dx-typography-*`, `--dx-space-layout-*`           | Typo, Layout                                |
| Components | Default                    | `--dx-button-*`, `--dx-input-*` …                    | die jeweilige Komponente                    |

Aliase bleiben als `var()`-Kette erhalten → Theme- und Brand-Wechsel funktionieren zur Laufzeit.

## Verwendung

```css
@import '@dextinity/ui/styles.css'; /* bringt Tailwind + Tokens mit */
```

```html
<html data-theme="light" data-brand="dextinity">
  <!-- dark | high-contrast · crimson -->
</html>
```

In verschachtelten Containern (z.B. eingebetteter Chatbot) **immer beide** Attribute setzen.

## Sync mit Figma

Figma-Plugin **DDS Export** + `pnpm figma:import`, siehe [`docs/TOKEN_SYNC.md`](../../docs/TOKEN_SYNC.md).
