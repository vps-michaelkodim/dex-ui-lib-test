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

1. In Figma auf der Page „Iconography“ die Icon-Components auswählen →
   Export-Einstellung **SVG** → **Export** in den Ordner `packages/icons/svg/`
   (Dateiname = Layer-Name, bestehende Dateien überschreiben).
2. `pnpm --filter @dextinity/icons generate`
3. `git diff` prüfen, PR.

Status: aktuell 18 von 300 Icons im Repo (die, die die Pilot-Komponenten brauchen).
Der Voll-Export erfolgt einmalig per Schritt 1.
