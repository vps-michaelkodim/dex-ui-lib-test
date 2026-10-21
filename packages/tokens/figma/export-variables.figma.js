// Figma-Plugin-Script: exportiert Variable Collections im Roh-Format von figma/raw/*.json.
// Ausführen via Figma MCP (use_figma) im DDS-File; Ergebnis pro Collection nach figma/raw/<name>.json.
// Zeilenformat: [name, typ (C|F|S|B|E|T), [wert pro Mode], scopes?, "D:beschreibung"?]
// Aliase: "@<Collection>::<variablenname>", Farben: "#rrggbb(aa)".
const COLLECTIONS = ['Primitives', 'Brand', 'Semantic', 'Responsive', 'Components'];

const cols = await figma.variables.getLocalVariableCollectionsAsync();
const colName = Object.fromEntries(cols.map((c) => [c.id, c.name]));
const cache = {};
async function vname(id) {
  if (!cache[id]) {
    const v = await figma.variables.getVariableByIdAsync(id);
    cache[id] = v ? colName[v.variableCollectionId] + '::' + v.name : 'MISSING:' + id;
  }
  return cache[id];
}
const hex = (x) =>
  Math.round(x * 255)
    .toString(16)
    .padStart(2, '0');
async function val(x) {
  if (x && typeof x === 'object' && x.type === 'VARIABLE_ALIAS') return '@' + (await vname(x.id));
  if (x && typeof x === 'object' && 'r' in x)
    return '#' + hex(x.r) + hex(x.g) + hex(x.b) + (x.a !== undefined && x.a < 1 ? hex(x.a) : '');
  return x;
}
const res = {};
for (const c of cols.filter((c) => COLLECTIONS.includes(c.name))) {
  const rows = [];
  for (const id of c.variableIds) {
    const v = await figma.variables.getVariableByIdAsync(id);
    const vals = [];
    for (const m of c.modes) vals.push(await val(v.valuesByMode[m.modeId]));
    const row = [v.name, v.resolvedType[0], vals];
    const sc = v.scopes.join(',');
    if (sc !== 'ALL_SCOPES') row.push(sc);
    if (v.description) row.push('D:' + v.description);
    rows.push(row);
  }
  res[c.name] = { collection: c.name, modes: c.modes.map((m) => m.name), variables: rows };
}
return res;
