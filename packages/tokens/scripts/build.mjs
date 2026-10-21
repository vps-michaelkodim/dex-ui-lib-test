/**
 * @dextinity/tokens — Build
 *
 *   figma/raw/*.json  ──►  dtcg/*.json            (DTCG, eine Datei pro Collection × Mode)
 *                     ──►  css/tokens.css         (CSS-Variablen, Themes + Brands per data-Attribut)
 *                     ──►  css/theme.css          (Tailwind v4 @theme + Typo-Utilities)
 *                     ──►  tokens.meta.json       (flache Liste für Storybook, Doku, AI)
 *
 * Aufruf: pnpm --filter @dextinity/tokens build
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import StyleDictionary from 'style-dictionary';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const RAW = join(ROOT, 'figma', 'raw');
const DTCG = join(ROOT, 'dtcg');
const CSS = join(ROOT, 'css');
const PREFIX = 'dx';

// ─── Konfiguration: Collection → Datei, Pfad-Prefix, CSS-Selektor pro Mode ──────────────────
const COLLECTIONS = [
  {
    name: 'Primitives',
    file: 'primitives',
    prefix: ['primitive'],
    selectors: { Default: ':root' },
  },
  {
    name: 'Brand',
    file: 'brand',
    prefix: [],
    attr: 'data-brand',
    selectors: { Dextinity: ':root, [data-brand="dextinity"]', Crimson: '[data-brand="crimson"]' },
  },
  {
    name: 'Semantic',
    file: 'semantic',
    prefix: [],
    attr: 'data-theme',
    selectors: {
      Light: ':root, [data-theme="light"]',
      Dark: '[data-theme="dark"]',
      'High Contrast': '[data-theme="high-contrast"]',
    },
  },
  {
    name: 'Responsive',
    file: 'responsive',
    prefix: [],
    selectors: { Desktop: ':root', Mobile: ':root' },
    media: { Mobile: '(max-width: 1023.98px)' },
  },
  {
    name: 'Components',
    file: 'components',
    prefix: [],
    // Component-Tokens referenzieren Semantic/Brand → dort neu auflösen, wo Theme/Brand gesetzt wird.
    selectors: { Default: ':root, [data-theme], [data-brand]' },
  },
];
const byName = Object.fromEntries(COLLECTIONS.map((c) => [c.name, c]));

const slug = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

// ─── Raw laden ─────────────────────────────────────────────────────────────────────────────
const raw = {};
for (const c of COLLECTIONS)
  raw[c.name] = JSON.parse(readFileSync(join(RAW, `${c.file}.json`), 'utf8'));
const styles = JSON.parse(readFileSync(join(RAW, 'styles.json'), 'utf8'));

function parseRow(row) {
  const [name, t, values, ...rest] = row;
  const scopes = rest.find((r) => typeof r === 'string' && !r.startsWith('D:'));
  const desc = rest.find((r) => typeof r === 'string' && r.startsWith('D:'));
  return {
    name,
    t,
    values,
    scopes: scopes ? scopes.split(',') : ['ALL_SCOPES'],
    description: desc ? desc.slice(2) : undefined,
  };
}

const pathOf = (collection, name) => [...byName[collection].prefix, ...name.split('/')];
const cssVarOf = (collection, name) =>
  `--${PREFIX}-${pathOf(collection, name).map(slug).join('-')}`;
const isAlias = (v) => typeof v === 'string' && v.startsWith('@');
function parseAlias(v) {
  const [collection, name] = v.slice(1).split('::');
  return { collection, name };
}

const isWeight = (name) => /(^|\/)weight$/.test(name) || /^font\/weight\/[a-z]+$/.test(name);
const round = (n, d = 4) => Math.round(n * 10 ** d) / 10 ** d;

function tokenType(v) {
  if (v.t === 'C') return 'color';
  if (v.t === 'F') return isWeight(v.name) ? 'fontWeight' : 'dimension';
  if (v.t === 'E') return 'cubicBezier';
  if (v.t === 'T') return 'duration';
  if (v.scopes.includes('FONT_FAMILY')) return 'fontFamily';
  return 'string';
}

function tokenValue(v, value) {
  if (isAlias(value)) {
    const a = parseAlias(value);
    return `{${pathOf(a.collection, a.name).join('.')}}`;
  }
  switch (tokenType(v)) {
    case 'dimension':
      return `${round(value)}px`;
    case 'cubicBezier': {
      const b = value.easingFunctionCubicBezier;
      return [b.x1, b.y1, b.x2, b.y2].map((n) => round(n, 3));
    }
    case 'duration':
      return `${Math.round(value * 1000)}ms`;
    default:
      return value;
  }
}

// ─── 1) DTCG schreiben ──────────────────────────────────────────────────────────────────────
rmSync(DTCG, { recursive: true, force: true });
mkdirSync(DTCG, { recursive: true });
const dtcgFiles = {}; // `${collection}:${mode}` → Pfad

for (const c of COLLECTIONS) {
  const { modes, variables } = raw[c.name];
  modes.forEach((mode, mi) => {
    const tree = {};
    for (const row of variables) {
      const v = parseRow(row);
      const path = pathOf(c.name, v.name);
      let node = tree;
      for (const key of path.slice(0, -1)) {
        node[key] ??= {};
        if ('$value' in node[key]) throw new Error(`Token/Gruppe-Kollision bei ${v.name}`);
        node = node[key];
      }
      const leaf = path.at(-1);
      if (node[leaf]) throw new Error(`Doppelter Token-Pfad: ${c.name}::${v.name}`);
      node[leaf] = {
        $type: tokenType(v),
        $value: tokenValue(v, v.values[mi]),
        ...(v.description ? { $description: v.description } : {}),
        $extensions: { 'com.figma': { collection: c.name, mode, name: v.name, scopes: v.scopes } },
      };
    }
    const file = modes.length > 1 ? `${c.file}.${slug(mode)}.json` : `${c.file}.json`;
    writeFileSync(join(DTCG, file), JSON.stringify(tree, null, 2) + '\n');
    dtcgFiles[`${c.name}:${mode}`] = join(DTCG, file);
  });
}

// ─── 2) CSS via Style Dictionary ────────────────────────────────────────────────────────────
StyleDictionary.registerTransform({
  name: 'name/dx',
  type: 'name',
  transform: (token, options) => [options.prefix, ...token.path].map(slug).join('-'),
});
StyleDictionary.registerTransform({
  name: 'cubicBezier/dx',
  type: 'value',
  transitive: true,
  filter: (token) =>
    (token.$type ?? token.type) === 'cubicBezier' && Array.isArray(token.$value ?? token.value),
  transform: (token) => `cubic-bezier(${(token.$value ?? token.value).join(', ')})`,
});
StyleDictionary.registerTransform({
  name: 'fontFamily/dx',
  type: 'value',
  transitive: true,
  filter: (token) => (token.$type ?? token.type) === 'fontFamily',
  transform: (token) => {
    const v = token.$value ?? token.value;
    return /\s/.test(v) ? `'${v}'` : v;
  },
});

const defaults = {
  Primitives: 'Default',
  Brand: 'Dextinity',
  Semantic: 'Light',
  Responsive: 'Desktop',
  Components: 'Default',
};

async function buildCss(collection, mode) {
  const source = [dtcgFiles[`${collection}:${mode}`]];
  const include = Object.entries(defaults)
    .filter(([c]) => c !== collection)
    .map(([c, m]) => dtcgFiles[`${c}:${m}`]);
  const sd = new StyleDictionary({
    source,
    include,
    usesDtcg: true,
    log: { verbosity: 'silent', warnings: 'disabled' },
    platforms: {
      css: {
        prefix: PREFIX,
        transforms: ['name/dx', 'cubicBezier/dx', 'fontFamily/dx'],
        files: [
          {
            destination: 'x.css',
            format: 'css/variables',
            // Figma-only Tokens (Font-Style-Namen wie "Semi Bold") gehören nicht ins CSS.
            filter: (t) =>
              t.isSource && !(t.$extensions?.['com.figma']?.scopes ?? []).includes('FONT_STYLE'),
            options: {
              selector: byName[collection].selectors[mode],
              outputReferences: true,
              showFileHeader: false,
            },
          },
        ],
      },
    },
  });
  const [file] = await sd.formatPlatform('css');
  let css = file.output.trim();
  const media = byName[collection].media?.[mode];
  if (media) css = `@media ${media} {\n${css.replace(/^/gm, '  ')}\n}`;
  return `/* ${collection} · ${mode} */\n${css}\n`;
}

mkdirSync(CSS, { recursive: true });
const HEADER = `/**\n * GENERIERT von packages/tokens/scripts/build.mjs — nicht von Hand ändern.\n * Quelle: Figma "DDS – Dextinity Admin UI" (figma/raw/*.json)\n */\n`;
let tokensCss = HEADER;
for (const c of COLLECTIONS)
  for (const mode of raw[c.name].modes) tokensCss += '\n' + (await buildCss(c.name, mode));
writeFileSync(join(CSS, 'tokens.css'), tokensCss);

// ─── 3) Meta (flache Liste, aufgelöste Werte) ───────────────────────────────────────────────
const index = {};
for (const c of COLLECTIONS)
  for (const row of raw[c.name].variables) index[`${c.name}::${row[0]}`] = parseRow(row);

function resolve(collection, name, mode) {
  const v = index[`${collection}::${name}`];
  if (!v) throw new Error(`Alias-Ziel fehlt: ${collection}::${name}`);
  const modes = raw[collection].modes;
  const mi = Math.max(0, modes.indexOf(mode));
  const value = v.values[mi];
  if (isAlias(value)) {
    const a = parseAlias(value);
    const nextMode = a.collection === collection ? modes[mi] : defaults[a.collection];
    return resolve(a.collection, a.name, nextMode);
  }
  return tokenValue(v, value);
}

const meta = { generatedFrom: 'figma/raw', prefix: PREFIX, collections: {}, tokens: [] };
for (const c of COLLECTIONS) {
  meta.collections[c.name] = { modes: raw[c.name].modes, attribute: c.attr ?? null };
  for (const row of raw[c.name].variables) {
    const v = parseRow(row);
    const values = {};
    const aliases = {};
    raw[c.name].modes.forEach((m, i) => {
      values[m] = resolve(c.name, v.name, m);
      if (isAlias(v.values[i])) aliases[m] = v.values[i].slice(1);
    });
    meta.tokens.push({
      collection: c.name,
      name: v.name,
      type: tokenType(v),
      cssVar: tokenType(v) === 'string' ? null : cssVarOf(c.name, v.name),
      values,
      ...(Object.keys(aliases).length ? { aliases } : {}),
      ...(v.description ? { description: v.description } : {}),
    });
  }
}

// ─── 4) Tailwind-Theme ──────────────────────────────────────────────────────────────────────
const tw = { colors: [], radius: [], spacing: [], text: [], shadows: [], ease: [], utilities: [] };
const v = (collection, name) => `var(${cssVarOf(collection, name)})`;

// Farben: nur Semantic (+ white/black). color/action/primary/default → --color-action-primary
for (const t of meta.tokens.filter((t) => t.collection === 'Semantic' && t.type === 'color')) {
  const key = t.name
    .replace(/^color\//, '')
    .replace(/\/default$/, '')
    .split('/')
    .map(slug)
    .join('-');
  tw.colors.push([`--color-${key}`, v('Semantic', t.name), t.name]);
}
tw.colors.push(
  ['--color-white', v('Primitives', 'color/white')],
  ['--color-black', v('Primitives', 'color/black')],
);

for (const t of meta.tokens.filter(
  (t) => t.collection === 'Primitives' && t.name.startsWith('radius/') && t.name !== 'radius/none',
))
  tw.radius.push([`--radius-${slug(t.name.split('/')[1])}`, v('Primitives', t.name)]);
for (const t of meta.tokens.filter(
  (t) => t.collection === 'Brand' && t.name.startsWith('brand/radius/'),
))
  tw.radius.push([`--radius-${slug(t.name.split('/')[2])}`, v('Brand', t.name)]);

for (const t of meta.tokens.filter(
  (t) => t.collection === 'Responsive' && t.name.startsWith('space/layout/'),
))
  tw.spacing.push([`--spacing-layout-${slug(t.name.split('/')[2])}`, v('Responsive', t.name)]);

const typoKeys = [
  ...new Set(
    meta.tokens.filter((t) => t.name.startsWith('typography/')).map((t) => t.name.split('/')[1]),
  ),
];
for (const k of typoKeys) {
  tw.text.push([`--text-${k}`, v('Responsive', `typography/${k}/size`)]);
  tw.text.push([`--text-${k}--line-height`, v('Responsive', `typography/${k}/line-height`)]);
}

for (const e of styles.effectStyles) {
  const value = e.layers
    .map((l) => `${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${l.color}`)
    .join(', ');
  tw.shadows.push([`--shadow-${slug(e.name.split('/').at(-1))}`, value]);
}

for (const t of meta.tokens.filter((t) => t.name.startsWith('motion/easing/')))
  tw.ease.push([`--ease-${slug(t.name.split('/')[2])}`, v('Primitives', t.name)]);

// Text-Styles → Utilities mit Figma-Namen: "Heading/H1/Bold" → typo-heading-h1-bold
const WEIGHT = { Regular: 400, Medium: 500, 'Semi Bold': 600, Bold: 700 };
const refToVar = (ref) => {
  const a = parseAlias(ref);
  return v(a.collection, a.name);
};
for (const s of styles.textStyles) {
  const b = s.bindings;
  tw.utilities.push({
    name: `typo-${slug(s.name)}`,
    figma: s.name,
    decl: {
      // Code nutzt immer die Brand-Schrift (Figma-Label-Styles binden direkt an Inter → Gap-Report).
      'font-family': 'var(--font-sans)',
      'font-size': refToVar(b.fontSize),
      'line-height': refToVar(b.lineHeight),
      'font-weight': String(WEIGHT[s.style]),
      'letter-spacing': refToVar(b.letterSpacing),
    },
  });
}

const block = (rows) =>
  rows.map(([k, val, c]) => `  ${k}: ${val};${c ? ` /* ${c} */` : ''}`).join('\n');
const themeCss = `${HEADER}
/* Tailwind v4 Theme — mappt Tailwind-Utilities auf die Token-Variablen aus tokens.css.
 * "inline": Utilities referenzieren direkt var(--dx-…), damit Theme/Brand-Wechsel per
 * data-Attribut auch in verschachtelten Containern greifen. */
@theme inline {
  /* Default-Palette, Radien, Schatten, Typo von Tailwind entfernen → nur DS-Tokens. */
  --color-*: initial;
  --radius-*: initial;
  --shadow-*: initial;
  --text-*: initial;
  --ease-*: initial;

  /* Farben (Semantic) */
${block(tw.colors)}

  /* Radius (Primitives + Brand) */
${block(tw.radius)}

  /* Spacing: Tailwind-Skala (p-4 = 16px) entspricht Primitives unit/N × 4px */
  --spacing: 0.25rem;
${block(tw.spacing)}

  /* Schrift */
  --font-sans: var(--${PREFIX}-brand-font-family-sans), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--${PREFIX}-brand-font-family-mono), ui-monospace, SFMono-Regular, monospace;

  /* Schriftgrößen (Responsive) */
${block(tw.text)}

  /* Schatten (Figma Effect Styles) */
${block(tw.shadows)}

  /* Easing */
${block(tw.ease)}

  --breakpoint-desktop: 1024px;
}

/* Text-Styles aus Figma als Utilities */
${tw.utilities
  .map(
    (u) =>
      `/* ${u.figma} */\n@utility ${u.name} {\n${Object.entries(u.decl)
        .map(([k, val]) => `  ${k}: ${val};`)
        .join('\n')}\n}`,
  )
  .join('\n\n')}
`;
writeFileSync(join(CSS, 'theme.css'), themeCss);

meta.tailwind = {
  colors: tw.colors.map(([k, , src]) => ({ class: k.replace('--color-', ''), token: src ?? null })),
  radius: tw.radius.map(([k]) => k.replace('--radius-', 'rounded-')),
  spacing: tw.spacing.map(([k]) => k.replace('--spacing-', '')),
  text: typoKeys.map((k) => `text-${k}`),
  shadows: tw.shadows.map(([k]) => k.replace('--shadow-', 'shadow-')),
  ease: tw.ease.map(([k]) => k.replace('--ease-', 'ease-')),
  typography: tw.utilities.map((u) => ({ class: u.name, figma: u.figma })),
};
// Safelist für Doku/Storybook: dort werden Klassen dynamisch aus der Meta gebaut,
// die Tailwind im Quelltext nicht findet. NICHT in Apps importieren (bläht CSS auf).
const safelist = [
  ...meta.tailwind.typography.map((t) => t.class),
  ...meta.tailwind.radius,
  ...meta.tailwind.shadows,
  ...meta.tailwind.text,
];
writeFileSync(
  join(CSS, 'safelist.css'),
  `${HEADER}\n${safelist.map((c) => `@source inline("${c}");`).join('\n')}\n`,
);

meta.textStyles = styles.textStyles;
meta.effectStyles = styles.effectStyles;
writeFileSync(join(ROOT, 'tokens.meta.json'), JSON.stringify(meta, null, 2) + '\n');

console.log(
  `✓ ${meta.tokens.length} Tokens · ${Object.keys(dtcgFiles).length} DTCG-Dateien · css/tokens.css · css/theme.css · tokens.meta.json`,
);
