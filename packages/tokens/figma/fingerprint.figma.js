// Figma-Plugin-Script: Fingerprint aller Collections (FNV-1a über sortierte Zeilen).
// Vergleich mit Code: Ergebnis als JSON speichern, dann
//   node packages/tokens/scripts/fingerprint.mjs <datei.json>
// Gleiche Logik wie export-variables.figma.js + scripts/fingerprint.mjs.
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
function fnv(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16);
}
const out = {};
for (const c of cols) {
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
  rows.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
  const groups = {};
  for (const r of rows) {
    const p = r[0].split('/').slice(0, 2).join('/');
    (groups[p] = groups[p] || []).push(r);
  }
  out[c.name] = {
    all: fnv(JSON.stringify(rows)),
    groups: Object.fromEntries(Object.entries(groups).map(([k, v]) => [k, fnv(JSON.stringify(v))])),
  };
}
return out;
