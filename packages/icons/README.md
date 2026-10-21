# @dextinity/icons

Icons aus der Figma-Page **Iconography** (DDS – Dextinity Admin UI) als React-Komponenten.

```tsx
import { SearchIcon, CloseIcon } from '@dextinity/icons';

<SearchIcon />                         // 16px, dekorativ, Farbe = Textfarbe
<CloseIcon size={24} title="Schließen" /> // mit zugänglichem Namen
```

## Benennung

Figma-Name `Search_Finding_Loupe` → `SearchIcon` (erstes Segment), Rest = Suchbegriffe
(`icons.meta.json`, Storybook-Suche). Namen mit `_`-Prefix (Entwürfe) werden übersprungen.

## Neue / geänderte Icons aus Figma

Über den Figma-Sync: Plugin **DDS Export** → `pnpm figma:import` (siehe `docs/TOKEN_SYNC.md`).
Der Import schreibt `svg/*.svg` (Dateiname = Figma-Layer-Name), entfernt gelöschte Icons und
ruft den Generator auf. Manuell: `pnpm --filter @dextinity/icons generate`.
