/**
 * DDS Export — Figma-Plugin (Development).
 * Exportiert Variablen, Text-/Effect-Styles, Icons und Logos des DDS-Files als JSON für `pnpm figma:import`.
 * Format = packages/tokens/figma/raw/*.json + styles.json + Icons als SVG-Strings.
 */
const ICON_PAGE_MATCH = 'Iconography';
const LOGO_PAGE_MATCH = 'Logos';
const LOGO_SET = 'Dextinity Logos';

const hex = (x) =>
  Math.round(x * 255)
    .toString(16)
    .padStart(2, '0');
const colorHex = (c) =>
  '#' + hex(c.r) + hex(c.g) + hex(c.b) + (c.a !== undefined && c.a < 1 ? hex(c.a) : '');

async function exportVariables() {
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
  async function val(x) {
    if (x && typeof x === 'object' && x.type === 'VARIABLE_ALIAS') return '@' + (await vname(x.id));
    if (x && typeof x === 'object' && 'r' in x) return colorHex(x);
    return x;
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
    out[c.name] = { collection: c.name, modes: c.modes.map((m) => m.name), variables: rows };
  }
  return { collections: out, refName: vname };
}

async function exportStyles(refName) {
  const ref = async (a) => (a && a.id ? '@' + (await refName(a.id)) : undefined);
  const textStyles = [];
  for (const s of await figma.getLocalTextStylesAsync()) {
    const bindings = {};
    for (const [k, a] of Object.entries(s.boundVariables || {})) bindings[k] = await ref(a);
    textStyles.push({
      name: s.name,
      family: s.fontName.family,
      style: s.fontName.style,
      fontSize: s.fontSize,
      lineHeight: s.lineHeight.unit === 'PIXELS' ? s.lineHeight.value : s.lineHeight,
      letterSpacing: s.letterSpacing.unit === 'PIXELS' ? s.letterSpacing.value : s.letterSpacing,
      bindings,
    });
  }
  const effectStyles = [];
  for (const s of await figma.getLocalEffectStylesAsync()) {
    effectStyles.push({
      name: s.name,
      layers: s.effects
        .filter((e) => e.type === 'DROP_SHADOW' || e.type === 'INNER_SHADOW')
        .map((e) => ({
          type: e.type,
          color: colorHex(e.color),
          x: e.offset.x,
          y: e.offset.y,
          blur: e.radius,
          spread: e.spread || 0,
        })),
    });
  }
  return { textStyles, effectStyles };
}

async function exportIcons() {
  const page = figma.root.children.find((p) => p.name.includes(ICON_PAGE_MATCH));
  if (!page) return { page: null, icons: {} };
  await page.loadAsync();
  const icons = {};
  for (const c of page.findAllWithCriteria({ types: ['COMPONENT'] })) {
    if (c.name.startsWith('_')) continue; // Entwürfe / intern
    icons[c.name] = (await c.exportAsync({ format: 'SVG_STRING' })).replace(/\n/g, '');
    figma.ui.postMessage({ type: 'progress', text: `Icons: ${Object.keys(icons).length}` });
  }
  return { page: page.name, icons };
}

/** Logos: ComponentSet „Dextinity Logos“ (Page „Logos“) — jede Variante als SVG, Schlüssel = Variantenname. */
async function exportLogos() {
  const page = figma.root.children.find((p) => p.name.includes(LOGO_PAGE_MATCH));
  if (!page) return null;
  await page.loadAsync();
  const set = page
    .findAllWithCriteria({ types: ['COMPONENT_SET'] })
    .find((s) => s.name === LOGO_SET);
  if (!set) return null;
  const logos = {};
  for (const v of set.children) {
    if (v.type !== 'COMPONENT') continue;
    logos[v.name] = (await v.exportAsync({ format: 'SVG_STRING' })).replace(/\n/g, '');
    figma.ui.postMessage({ type: 'progress', text: `Logos: ${Object.keys(logos).length}` });
  }
  return { page: page.name, set: set.name, logos };
}

figma.showUI(__html__, { width: 360, height: 260 });

figma.ui.onmessage = async (msg) => {
  if (msg.type !== 'export') return;
  try {
    figma.ui.postMessage({ type: 'progress', text: 'Variablen …' });
    const { collections, refName } = await exportVariables();
    figma.ui.postMessage({ type: 'progress', text: 'Styles …' });
    const styles = await exportStyles(refName);
    const icons = msg.icons ? await exportIcons() : null;
    const logos = msg.icons ? await exportLogos() : null;
    const data = {
      format: 'dds-export@1',
      file: figma.root.name,
      fileKey: figma.fileKey || null,
      exportedAt: new Date().toISOString(),
      collections,
      styles,
      icons,
      logos,
    };
    figma.ui.postMessage({ type: 'done', json: JSON.stringify(data) });
  } catch (e) {
    figma.ui.postMessage({ type: 'error', text: String(e && e.message ? e.message : e) });
  }
};
