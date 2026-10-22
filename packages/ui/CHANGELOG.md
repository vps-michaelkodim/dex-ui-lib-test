# @dextinity/ui

## 0.1.1

### Patch Changes

- c673e47: Neu: `Select` (Optionen, Status, Read-only, Loading), `Search` (Leeren-Button, Escape, Loading), Form-Layout `Form` / `FormField` / `FormDivider` (Figma Form Layout 1 Col / 2 Cols). `Input` hat jetzt `layout="stacked" | "inline"`.
- 4a79551: Neu: `Checkbox` (inkl. `indeterminate`, „Alle auswählen“ über `parent`), `CheckboxGroup`, `Radio` + `RadioGroup`, `Switch` — nach Figma `Form – Checkbox / Radiobutton / Switch`, mit Component-Tokens, Read-only, Fehlerstatus und Hinweistext.
- 1102223: Neu: `Text` (Figma Typography, `weight="bold"`), `MainNavigation` / `NavSection` / `NavItem` (3 Ebenen, aufklappbar), `Dialog` (SM–XL, Full Height, Icon, Aktionen), `Snackbar` + `SnackbarProvider` / `useSnackbar()`. Damit sind alle Komponenten aus Figma `03 Components` umgesetzt.
- 59960e6: Toolbar: neues Pattern für den Seitenkopf (Breadcrumb, Zurück-Button, Titel mit Info-Tooltip, Support Text, Aktionen rechts), responsive über die Layout-Tokens.
- Updated dependencies [2be85d3]
  - @dextinity/tokens@0.1.1
  - @dextinity/icons@0.1.1

## 0.1.0

Erster versionierter Stand. Ab hier werden Änderungen per Changesets dokumentiert (siehe `AGENTS.md` → „Versionen & Changesets“).
