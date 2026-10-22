# DDS Backlog: COMET → Dextinity Admin UI

> Was aus der alten COMET DXP Library noch ins DDS muss, zusammengezogen und vereinfacht.
> Stand: 2026-10-22 · Quelle: [COMET DXP Library](https://www.figma.com/design/Swzee5YSEkPVlCXHcyL7mp/COMET-DXP-Library) vs. [DDS V 0.1](https://www.figma.com/design/xAe7acdpccDSRCrfeOdAg3/DDS---Dextinity-Admin-UI---V-0.1)

**Kurzfassung:** ~250 COMET Component Sets → ~30 neue DDS-Komponenten + 5 Erweiterungen bestehender + ~5 Patterns.
Definition of Done pro Komponente: siehe [`docs/CONTRIBUTING.md`](./docs/CONTRIBUTING.md) (Contract, Tokens, Figma-Set, Changelog-Eintrag).

Prio: **P1** = Basics, blockiert viele Screens · **P2** = Daten-/Content-Screens · **P3** = App Shell, Domain, Nice-to-have

---

## Offene Fragen (vor Start klären)

| # | Frage | Empfehlung | Blockiert |
|---|---|---|---|
| Q1 | Density (Standard/Compact/Comfortable) und Breakpoint (Desktop/Mobile) als **Variable Modes** statt Varianten-Achsen? | Ja, Variable Modes | AP-08, alle mit Mobile-Varianten |
| Q2 | MUI Charts (~30 Sets) ins DDS nachbauen? | Nein, nur Chart-Tokens, Legende, KPI-Kachel; Rendering macht die Library | AP-11 |
| Q3 | CMS-Spezialteile (Blocks, Table Block, Page Tree, Preview Toolbar, Focal Point) als Patterns statt Komponenten? | Ja, `04 Patterns` | AP-12 |
| Q4 | Textarea als Prop `Multiline` am Input oder eigenes Set? | Prop am Input | AP-04 |
| Q5 | Number Field als eigenes Set oder Input + Stepper-Slot? | Input + Slot | AP-04 |
| Q6 | Neues Menu Item ersetzt DDS `Select Option` – ok, obwohl bestehende Komponente (Breaking in dex-ui-lib)? | Ja, jetzt noch billig | AP-05 |
| Q7 | Werden Legacy-Multi-Scopes (2/3 Scopes) noch irgendwo gebraucht? | Weglassen, außer ein Kunde nutzt sie | AP-10 |
| Q8 | Braucht der Button einen „Done“-Feedback-State (COMET Feedback Button)? | Offen – Produkt fragen | AP-03 |
| Q9 | Drawer: eigene Komponente oder Dialog-Container mit `Placement=Side`? | Eigene Komponente, aber Dialog Header/Actions wiederverwenden | AP-06 |
| Q10 | Date Picker: Locale/Wochenstart (Mo) und Datumsformat als Content oder Tokens? | Content/Code, nicht Figma-Varianten | AP-07 |

---

## AP-01 · Querschnitt-Regeln festziehen · P1

Damit alle folgenden Pakete gleich gebaut werden.

- [ ] Q1 entscheiden; bei Ja: Variable Collections/Modes für Density + Breakpoint anlegen
- [ ] Regel dokumentieren: keine Varianten für Anzahl/Level/Wert (Count 1–5, Level 1–8, Value 0–100 %) → Auto Layout, Slots oder Props
- [ ] Regel dokumentieren: keine „with Slots“-Duplikate, nur native Slots
- [ ] Regel dokumentieren: Skeleton-/Disabled-/Read-only-Zustände nach [Property Conventions](./docs/COMPONENT_PROPERTY_CONVENTIONS.md) (`_State`, `Disabled` als eigene Prop)
- [ ] Ergänzung in `docs/COMPONENT_PROPERTY_CONVENTIONS.md`

---

## AP-02 · Kleine Atome · P1

Werden von fast allen späteren Paketen gebraucht → zuerst bauen.

| Komponente | Ersetzt (COMET) | Notizen |
|---|---|---|
| Badge / Dot | implizit in NotificationStatus, TabStates | Count + Dot, Farben aus feedback-Tokens |
| Avatar | UserAvatarPicture, DataGrid Avatar | `Type`=Image/Initials/Icon, `Size`; Gender-Varianten raus |
| Link | InlineLink | keine `Size`, erbt Typo |
| Divider | SectionDivider, DDS `Form divider` | Form divider migrieren |
| Drag Handle | DragBar, drag handle for rows, Drag handler | ein Atom für Blocks, Table, Listen |
| Skeleton | SkeletonAnimation | `Shape`=Text/Rect/Circle, Animation nur im Code (Motion-Tokens) |
| Progress Bar | LinearProgress, Statistic Bar (Charts + DataGrid) | `Determinate`/`Indeterminate`, Wert statt %-Varianten |

- [ ] Je Komponente: Tokens, Figma-Set, Contract
- [ ] `Form divider` auf Divider umstellen, alte Instanzen tauschen

---

## AP-03 · Bestehende DDS-Komponenten erweitern · P1

- [ ] **Button:** Variante für dunkle Hintergründe (COMET „Text Light“) · ggf. „Done“-State (→ Q8)
- [ ] **Form Label:** `Position=Left` (COMET Label Position Left/Top)
- [ ] **Search:** „Enriched actions“ (Trailing-Actions-Slot)
- [ ] **Tooltip:** `Compact`
- [ ] **Toolbar:** EditBar ergänzen; Breadcrumb-Texte durch Breadcrumb-Komponente ersetzen (nach AP-05)

---

## AP-04 · Form-Field-Erweiterungen · P1

Alles auf Basis der bestehenden Field-Architektur ([`FIELD_ARCHITECTURE_STANDARD.md`](./docs/FIELD_ARCHITECTURE_STANDARD.md)).

| Komponente | Ersetzt (COMET) | Notizen |
|---|---|---|
| Textarea | TextArea | Prop `Multiline` am Input (→ Q4) |
| Number Field | NumberSpinner, NumberSpinner → Button | Input + Stepper im Trailing-Slot (→ Q5) |
| Select Multi / Searchable | Autocomplete-MultiSelectCombi, Chips_Text, Chip array | Props `Multiple`, `Searchable` am Select; Werte als Chips |
| Color Field | ColorPicker, ColorPickerDropdown, ColorBox | Input mit Swatch-Prefix + Popover |
| Slider | ValueSlider, RangeSlider, Slider, Drag | `Range`=No/Yes; keine %-Varianten |

- [ ] Abhängigkeit: Select Multi braucht Menu Item aus AP-05

---

## AP-05 · Menu & Navigation · P1

| Komponente | Ersetzt (COMET) | Notizen |
|---|---|---|
| Menu + Menu Item | ContextMenu, ListItems, ListGrouping, ListItems_Separator | **ein** Item für Context Menu, Select, Autocomplete; ersetzt DDS `Select Option` (→ Q6) |
| Tabs | Tab, TabGroup, TabStates, TabArrows | `Status` (none/success/warning/error) als Prop, Scroll-Pfeile intern, „Separator“ raus |
| Breadcrumb | Breadcrumb, Breadcrumb Items, Breadcrumb Mobile Dropdown | Auto Layout + Slot statt Level 1–6 |
| Segmented Control | ToggleButton, ToggleButtonItem | Auto Layout statt 2–5-Optionen-Varianten |
| Tree Item | TreeItems (2×), TreeLevels, Mini Page Tree Rows/Types | Indent statt Level 1–8, Seitentyp per Instance Swap |

- [ ] DDS `Select Option` + `Select Menu` auf Menu/Menu Item migrieren
- [ ] dex-ui-lib informieren (Breaking)

---

## AP-06 · Feedback & Container · P1/P2

| Komponente | Prio | Ersetzt (COMET) | Notizen |
|---|---|---|---|
| Alert | P1 | Alert, InlineAlert | `Severity` + `Variant`=Banner/Inline; Snackbar bleibt separat |
| Section Header | P1 | SectionHeadline | optionale Linie, Actions-Slot |
| Card | P2 | CardsHeader, Quick Link Cards, Dashboard Quick Links, NavigationCards | Header/Body/Footer-Slots, `Interactive` |
| Fieldset / Accordion | P2 | FieldSet, FieldSet with Slots, FieldSetHeader (2×) | nur Slot-Version, `Expandable`/`Expanded` |
| Drawer | P2 | Drawer, Drawer Header, AddBlock | Dialog Header/Actions wiederverwenden (→ Q9) |
| Expandable Preview | P2 | Content-overflow Code/RichText + Modals | `Type`=Code/Text, Modal = Dialog |
| Empty State | P2 | Content Placeholder | |

---

## AP-07 · Date & Time · P1

Größtes Einzelpaket bei den Fields (~15 COMET Sets).

- [ ] **Date/Time Field:** `Type`=Date/Time/DateTime, `Range`=No/Yes (ersetzt DatePicker, DateTimePicker, TimePicker, DateRangePicker, TimeRangePicker)
- [ ] **Calendar Popover:** 1 oder 2 Monate (ersetzt Calendar/Days, Rows, Button, Grid, Grid_mobile, Dropdown)
- [ ] **Time List:** ersetzt Time/Dropdown, TimeItems; LEGACY Time/Dropdown entfällt
- [ ] Q10 klären

---

## AP-08 · Table & Pagination · P2

Ersetzt DataGrid (~30 Sets). Abhängig von Q1, AP-02, AP-05.

- [ ] **Table Header Cell:** Sort (none/asc/desc), Align
- [ ] **Table Cell:** **eine** Cell mit Content-Slot statt Text/Chips/CTA/Boolean/Checkbox/Thumbnail/Avatar/NumberSpinner/Preview/Drag/Actions-Cells
- [ ] **Table Row:** `_State`, `Selected`, Dragging
- [ ] **Table Toolbar:** Columns, Filter, Density, Export, More (Panels = Popover + Form)
- [ ] **Columns-Panel:** inkl. Pinning (ersetzt List Items ManageDatagridColumns, Pinning Buttons)
- [ ] **Pagination:** `Language`-Variante raus
- [ ] Density über Variable Mode (Q1)

---

## AP-09 · Upload & Rich Text · P2

- [ ] **File Upload:** Dropzone + File Item mit `Type`=File/Image, `Status`=Idle/Uploading/Error (ersetzt FileUpload, DropZone, Attachment, ImagePreview, ImageGallery, ImageTitle); Skeleton-Prop → Skeleton (AP-02)
- [ ] **Rich Text Editor:** Feld nach Field-Architektur, Toolbar aus Icon Buttons, Presets Simple/Full (ersetzt RTE, RTEToolbar, RTEToolbarSettings)

---

## AP-10 · App Shell erweitern · P3

- [ ] **App Bar Slots:** User Menu (inkl. Impersonation), Notifications (Badge), Publisher Status, Help/FAQ – mit Menu aus AP-05
- [ ] **Scope Indicator:** ersetzt ContentScopeIndicator, Scope, ScopeGroup, ScopeBreadcrumb (→ Q7)
- [ ] **Dashboard Header** (Slim/Default) als Pattern, ggf. Toolbar-Variante
- [ ] Additional Logos (AUDI/SEAT/SKODA/VW) nicht übernehmen – Kunden-Content

---

## AP-11 · Charts · P3

Abhängig von Q2.

- [ ] Chart-Farb-Tokens (kategorisch, sequenziell, Heatmap)
- [ ] Legende
- [ ] KPI-Kachel (ersetzt Number block, RingDiagram, Gauge)
- [ ] Bei Q2 = Nein: COMET-„Elements → …“-Sets (Achsen, Bars, Zoom-Slider) nicht übernehmen

---

## AP-12 · Domain-Patterns (04 Patterns) · P3

Abhängig von Q3. Nur aus DDS-Komponenten zusammenbauen, keine neuen Atome.

- [ ] **Blocks:** Block Master, Optional Block, minMaxVisible, Block Header/Actions → Card + Drag Handle + Checkbox + Switch
- [ ] **Table Block:** editierbare Zellen, Hover-Divider
- [ ] **Page Tree:** aus Tree Item
- [ ] **Preview Toolbar:** Segmented Control + Icon Buttons
- [ ] **Choose Focal Point**

---

## AP-13 · Nicht übernehmen (dokumentieren & abhaken)

Einmal im Figma-Changelog bzw. Migrationsdoku festhalten, damit niemand danach sucht.

- [ ] LoadingThreeDots, LoadingBallTriangle → Spinner
- [ ] Scrollbar → CSS
- [ ] Logos COMET, GroupCMS, COMET App Icon
- [ ] Button list, Chip Group, CheckboxGroup, RadioGroup → Auto Layout / Form Layout
- [ ] CheckboxWithRipple, Checkbox_Item, RadioItem, SwitchItem (Duplikate)
- [ ] `_Frame 22/23`, Layerauswahl Test, TRY AND ERROR, alle LEGACY-Sets
- [ ] Mapping-Tabelle COMET → DDS für Devs (aus diesem Backlog ableiten)

---

## Reihenfolge-Vorschlag

1. AP-01 → AP-02 → AP-03 (Fundament, schnell)
2. AP-05 → AP-04 → AP-06 (P1-Teile) → AP-07
3. AP-08 → AP-09 → AP-06 (Rest)
4. AP-10 → AP-11 → AP-12 → AP-13
