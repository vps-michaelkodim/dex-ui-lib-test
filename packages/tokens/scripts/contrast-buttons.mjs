// Kontrast-Audit Button-Farben (Default-State) über alle Brands × Themes, WCAG AA 4.5:1.
// Aufruf: cd packages/tokens && node scripts/contrast-buttons.mjs
import { readFileSync } from 'node:fs';
const meta = JSON.parse(readFileSync('tokens.meta.json', 'utf8'));
const idx = new Map(meta.tokens.map((t) => [t.collection + '::' + t.name, t]));
// resolve Component token value under semantic mode + brand
function res(coll, name, sem, brand) {
  const t = idx.get(coll + '::' + name);
  const modes = meta.collections[coll].modes;
  const mode = coll === 'Semantic' ? sem : coll === 'Brand' ? brand : modes[0];
  const a = t.aliases?.[mode];
  if (a) {
    const [c, n] = a.split('::');
    return res(c, n, sem, brand);
  }
  return t.values[mode];
}
const lum = (h) => {
  const v = [1, 3, 5]
    .map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
};
const ratio = (a, b) => {
  const x = lum(a),
    y = lum(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};
const out = [];
for (const brand of ['Dextinity', 'Crimson'])
  for (const sem of ['Light', 'Dark', 'High Contrast']) {
    const page = res('Semantic', 'color/background/default', sem, brand);
    for (const c of ['primary', 'secondary', 'error', 'success'])
      for (const v of ['contained', 'outlined', 'text']) {
        let bg = res('Components', `button/color/${c}/${v}/default/background`, sem, brand);
        const fg = res('Components', `button/color/${c}/${v}/default/foreground`, sem, brand);
        if (bg.length === 9 && bg.endsWith('00')) bg = page;
        const r = ratio(fg.slice(0, 7), bg.slice(0, 7));
        if (r < 4.5)
          out.push(
            `${brand.padEnd(9)} ${sem.padEnd(13)} ${c}/${v}`.padEnd(48) +
              ` ${r.toFixed(2)}:1  (${fg} auf ${bg})`,
          );
      }
  }
console.log(out.join('\n') || 'alles >= 4.5');
