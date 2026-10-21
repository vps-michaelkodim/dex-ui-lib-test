/**
 * Kontrast-Audit aller Component-Tokens (Text/Icon vs. Hintergrund) in allen Theme × Brand-Kombinationen.
 *
 *   pnpm contrast   → Konsole + docs/reports/contrast.md (generiert)
 *
 * Paare: `…/foreground` bzw. `…/foreground-placeholder` gegen `…/background` mit gleichem Prefix.
 * Fehlt der Hintergrund oder ist er transparent → Seitenhintergrund (Semantic color/background/default).
 * Disabled-States sind ausgenommen (WCAG 1.4.3 gilt nicht für inaktive Elemente). Schwelle: 4.5:1 (AA).
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const RAW = join(ROOT, 'packages/tokens/figma/raw');
const FILES = {
  Primitives: 'primitives',
  Brand: 'brand',
  Semantic: 'semantic',
  Responsive: 'responsive',
  Components: 'components',
};
const raw = Object.fromEntries(
  Object.entries(FILES).map(([c, f]) => [
    c,
    JSON.parse(readFileSync(join(RAW, `${f}.json`), 'utf8')),
  ]),
);
const row = Object.fromEntries(
  Object.entries(raw).flatMap(([c, r]) => r.variables.map((v) => [`${c}::${v[0]}`, v])),
);
const THEMES = raw.Semantic.modes;
const BRANDS = raw.Brand.modes;
const AA = 4.5;

function resolve(collection, name, theme, brand) {
  const r = row[`${collection}::${name}`];
  if (!r) return null;
  const modes = raw[collection].modes;
  const mode = collection === 'Semantic' ? theme : collection === 'Brand' ? brand : modes[0];
  const v = r[2][Math.max(0, modes.indexOf(mode))];
  if (typeof v === 'string' && v.startsWith('@')) {
    const [c, n] = v.slice(1).split('::');
    return resolve(c, n, theme, brand);
  }
  return v;
}

const channel = (h, i) => parseInt(h.slice(i, i + 2), 16) / 255;
const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const lum = (h) =>
  0.2126 * lin(channel(h, 1)) + 0.7152 * lin(channel(h, 3)) + 0.0722 * lin(channel(h, 5));
/** Hintergrund mit Alpha über den Seitenhintergrund legen. */
function flatten(color, page) {
  if (color.length !== 9) return color.slice(0, 7);
  const a = parseInt(color.slice(7, 9), 16) / 255;
  const mix = (i) =>
    Math.round((channel(color, i) * a + channel(page, i) * (1 - a)) * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${mix(1)}${mix(3)}${mix(5)}`;
}
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};

const pairs = raw.Components.variables
  .map((v) => v[0])
  .filter((n) => /\/foreground(-placeholder)?$/.test(n) && !/\/disabled\//.test(n))
  .map((fg) => ({ fg, bg: fg.replace(/\/foreground(-placeholder)?$/, '/background') }));

const failures = [];
for (const brand of BRANDS) {
  for (const theme of THEMES) {
    const page = resolve('Semantic', 'color/background/default', theme, brand);
    for (const { fg, bg } of pairs) {
      const f = resolve('Components', fg, theme, brand);
      const bRaw = row[`Components::${bg}`] ? resolve('Components', bg, theme, brand) : page;
      if (typeof f !== 'string' || typeof bRaw !== 'string') continue;
      const b = flatten(bRaw, page);
      const r = ratio(flatten(f, b), b);
      if (r < AA)
        failures.push({
          brand,
          theme,
          fg,
          bg: row[`Components::${bg}`] ? bg : '(Seite)',
          fgHex: f,
          bgHex: b,
          r,
        });
    }
  }
}

// Gruppieren: gleiche Token-Paare über Modi zusammenfassen
const byPair = new Map();
for (const f of failures) {
  const key = `${f.fg}`;
  if (!byPair.has(key)) byPair.set(key, []);
  byPair.get(key).push(f);
}
const component = (n) => n.split('/')[0];
const lines = [...byPair.entries()]
  .sort((a, b) => Math.min(...a[1].map((x) => x.r)) - Math.min(...b[1].map((x) => x.r)))
  .map(([fg, list]) => {
    const worst = list.reduce((m, x) => (x.r < m.r ? x : m));
    const modes = list.map((x) => `${x.theme}/${x.brand}`).join(', ');
    return `| ${component(fg)} | \`${fg}\` | ${worst.r.toFixed(2)}:1 (${worst.theme}/${worst.brand}) | \`${worst.fgHex}\` auf \`${worst.bgHex}\` | ${modes} |`;
  });

const md = `# Kontrast-Audit Component-Tokens

> GENERIERT mit \`pnpm contrast\` aus \`packages/tokens/figma/raw\` — nicht von Hand ändern.
> Prüft Text-/Icon-Farbe gegen Hintergrund für alle ${pairs.length} Paare × ${THEMES.length * BRANDS.length} Modi
> (Themes ${THEMES.join(', ')} × Brands ${BRANDS.join(', ')}). Schwelle WCAG AA ${AA}:1, Disabled ausgenommen.

**${byPair.size} Token-Paare unter ${AA}:1** (${failures.length} Fälle). Ursache und Status: [Gap-Report](../figma-gap-report.md).

| Komponente | Vordergrund-Token | schlechtester Wert | Farben | betroffene Modi |
| --- | --- | --- | --- | --- |
${lines.join('\n')}
`;
mkdirSync(join(ROOT, 'docs/reports'), { recursive: true });
writeFileSync(join(ROOT, 'docs/reports/contrast.md'), md);
console.log(
  `${byPair.size} Token-Paare unter ${AA}:1 (${failures.length} Fälle in ${THEMES.length * BRANDS.length} Modi) → docs/reports/contrast.md`,
);
for (const l of lines.slice(0, 40)) console.log(l);
