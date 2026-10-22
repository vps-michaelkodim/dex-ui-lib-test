/**
 * Importiert einen Export des Figma-Plugins „DDS Export“ (tools/figma-plugin) ins Repo.
 *
 *   pnpm figma:import ~/Downloads/dds-export.json [--dry-run]
 *
 * 1. Vergleicht mit dem Stand im Repo und zeigt, was sich geändert hat
 * 2. Schreibt packages/tokens/figma/raw/*.json, styles.json, packages/icons/svg/*.svg
 * 3. Baut Tokens (CSS, DTCG, Tailwind) und Icons (React) neu
 * Danach: git diff prüfen, pnpm test + pnpm test:visual, PR.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const RAW = join(ROOT, 'packages/tokens/figma/raw');
const SVG = join(ROOT, 'packages/icons/svg');
const LOGOS = join(ROOT, 'packages/icons/logos');
const COLLECTION_FILES = {
  Primitives: 'primitives',
  Brand: 'brand',
  Semantic: 'semantic',
  Responsive: 'responsive',
  Components: 'components',
};

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const file = args.find((a) => !a.startsWith('--'));
if (!file) {
  console.error('Aufruf: pnpm figma:import <dds-export.json> [--dry-run]');
  process.exit(1);
}
const data = JSON.parse(readFileSync(resolve(process.cwd(), file), 'utf8'));
if (data.format !== 'dds-export@1') {
  console.error(`Unbekanntes Format: ${data.format} (erwartet dds-export@1)`);
  process.exit(1);
}

const c = {
  g: (s) => `\x1b[32m${s}\x1b[0m`,
  r: (s) => `\x1b[31m${s}\x1b[0m`,
  y: (s) => `\x1b[33m${s}\x1b[0m`,
  b: (s) => `\x1b[1m${s}\x1b[0m`,
};
const MAX = 12;
/** Vergleich unabhängig von der Schlüssel-Reihenfolge in Objekten. */
const canon = (v) =>
  Array.isArray(v)
    ? `[${v.map(canon).join(',')}]`
    : v && typeof v === 'object'
      ? `{${Object.keys(v)
          .sort()
          .map((k) => `${JSON.stringify(k)}:${canon(v[k])}`)
          .join(',')}}`
      : JSON.stringify(v);
const list = (title, items, color) => {
  if (!items.length) return;
  console.log(`  ${color(`${title} (${items.length})`)}`);
  for (const i of items.slice(0, MAX)) console.log(`    ${i}`);
  if (items.length > MAX) console.log(`    … +${items.length - MAX}`);
};
let changes = 0;
const summary = { added: 0, changed: 0, removed: 0, styles: 0, icons: 0 };

// ── Variablen ──────────────────────────────────────────────────────────────────────────────
console.log(c.b(`\nFigma: ${data.file} · exportiert ${data.exportedAt}\n`));
const versionOf = (rows) => rows?.find((r) => r[0] === 'version')?.[2][0];
const oldPrimitives = join(RAW, 'primitives.json');
const oldVersion = existsSync(oldPrimitives)
  ? versionOf(JSON.parse(readFileSync(oldPrimitives, 'utf8')).variables)
  : undefined;
const newVersion = versionOf(data.collections.Primitives?.variables);
console.log(
  newVersion === oldVersion
    ? `Figma-Version: ${newVersion ?? '–'}\n`
    : c.y(`Figma-Version: ${oldVersion ?? '–'} → ${newVersion ?? '–'}\n`),
);
const writes = [];
for (const [name, col] of Object.entries(data.collections)) {
  const slug = COLLECTION_FILES[name];
  if (!slug) {
    console.log(
      c.y(
        `⚠ Neue Collection „${name}“ wird ignoriert — in COLLECTION_FILES + build.mjs eintragen.`,
      ),
    );
    continue;
  }
  const path = join(RAW, `${slug}.json`);
  const old = existsSync(path)
    ? JSON.parse(readFileSync(path, 'utf8'))
    : { modes: [], variables: [] };
  const oldMap = new Map(old.variables.map((r) => [r[0], canon(r)]));
  const newMap = new Map(col.variables.map((r) => [r[0], canon(r)]));
  const added = [...newMap.keys()].filter((k) => !oldMap.has(k));
  const removed = [...oldMap.keys()].filter((k) => !newMap.has(k));
  const changed = [...newMap.keys()].filter(
    (k) => oldMap.has(k) && oldMap.get(k) !== newMap.get(k),
  );
  const modesChanged = JSON.stringify(old.modes) !== JSON.stringify(col.modes);
  const n = added.length + removed.length + changed.length + (modesChanged ? 1 : 0);
  changes += n;
  summary.added += added.length;
  summary.changed += changed.length + (modesChanged ? 1 : 0);
  summary.removed += removed.length;
  console.log(
    `${n ? '●' : c.g('✓')} ${name}: ${col.variables.length} Variablen${n ? '' : ' — unverändert'}`,
  );
  if (modesChanged) console.log(c.y(`  Modes: ${old.modes.join(', ')} → ${col.modes.join(', ')}`));
  list('neu', added, c.g);
  list('entfernt', removed, c.r);
  list(
    'geändert',
    changed.map((k) => {
      const o = old.variables.find((r) => r[0] === k);
      const nw = col.variables.find((r) => r[0] === k);
      return `${k}: ${JSON.stringify(o.slice(2))} → ${JSON.stringify(nw.slice(2))}`;
    }),
    c.y,
  );
  const body = `{"collection":${JSON.stringify(name)},"modes":${JSON.stringify(col.modes)},"variables":[\n${col.variables.map((r) => JSON.stringify(r)).join(',\n')}\n]}\n`;
  writes.push([path, body]);
}

// ── Styles ─────────────────────────────────────────────────────────────────────────────────
{
  const path = join(RAW, 'styles.json');
  const old = existsSync(path)
    ? JSON.parse(readFileSync(path, 'utf8'))
    : { textStyles: [], effectStyles: [] };
  for (const kind of ['textStyles', 'effectStyles']) {
    const o = new Map(old[kind].map((s) => [s.name, canon(s)]));
    const nw = new Map(data.styles[kind].map((s) => [s.name, canon(s)]));
    const added = [...nw.keys()].filter((k) => !o.has(k));
    const removed = [...o.keys()].filter((k) => !nw.has(k));
    const changed = [...nw.keys()].filter((k) => o.has(k) && o.get(k) !== nw.get(k));
    const n = added.length + removed.length + changed.length;
    changes += n;
    summary.styles += n;
    console.log(`${n ? '●' : c.g('✓')} ${kind}: ${nw.size}${n ? '' : ' — unverändert'}`);
    list('neu', added, c.g);
    list('entfernt', removed, c.r);
    list('geändert', changed, c.y);
  }
  writes.push([path, JSON.stringify(data.styles, null, 1) + '\n']);
}

// ── Icons ──────────────────────────────────────────────────────────────────────────────────
const iconDeletes = [];
if (data.icons) {
  const existing = new Set(
    readdirSync(SVG)
      .filter((f) => f.endsWith('.svg'))
      .map((f) => f.slice(0, -4)),
  );
  const incoming = data.icons.icons;
  const added = Object.keys(incoming).filter((k) => !existing.has(k));
  const removed = [...existing].filter((k) => !(k in incoming));
  const changed = Object.keys(incoming).filter(
    (k) =>
      existing.has(k) && readFileSync(join(SVG, `${k}.svg`), 'utf8').trim() !== incoming[k].trim(),
  );
  const n = added.length + removed.length + changed.length;
  changes += n;
  summary.icons += n;
  console.log(
    `${n ? '●' : c.g('✓')} Icons: ${Object.keys(incoming).length}${n ? '' : ' — unverändert'}`,
  );
  list('neu', added, c.g);
  list('entfernt', removed, c.r);
  list('geändert', changed, c.y);
  for (const [k, svg] of Object.entries(incoming))
    writes.push([join(SVG, `${k}.svg`), svg.trim() + '\n']);
  iconDeletes.push(...removed.map((k) => join(SVG, `${k}.svg`)));
} else {
  console.log(c.y('– Icons nicht im Export (Checkbox im Plugin) — übersprungen'));
}

// ── Logos (ComponentSet „Dextinity Logos“) ───────────────────────────────────────────────────
// Variantenname „Brand=Dextinity AI Hub, Color=Negative, onlySign=False“ → logos/dextinity-ai-hub--negative.svg
const logoKey = (variant) => {
  const p = Object.fromEntries(variant.split(',').map((kv) => kv.split('=').map((x) => x.trim())));
  const slug = (x) =>
    x
      .toLowerCase()
      .replace(/\(.*?\)/g, '')
      .trim()
      .replace(/[^a-z0-9]+/g, '-');
  return `${slug(p.Brand)}--${slug(p.Color)}${p.onlySign === 'True' ? '--sign' : ''}`;
};
if (data.logos) {
  mkdirSync(LOGOS, { recursive: true });
  const existing = new Set(
    readdirSync(LOGOS)
      .filter((f) => f.endsWith('.svg'))
      .map((f) => f.slice(0, -4)),
  );
  const incoming = Object.fromEntries(
    Object.entries(data.logos.logos).map(([k, v]) => [logoKey(k), v]),
  );
  const added = Object.keys(incoming).filter((k) => !existing.has(k));
  const removed = [...existing].filter((k) => !(k in incoming));
  const changed = Object.keys(incoming).filter(
    (k) =>
      existing.has(k) &&
      readFileSync(join(LOGOS, `${k}.svg`), 'utf8').trim() !== incoming[k].trim(),
  );
  const n = added.length + removed.length + changed.length;
  changes += n;
  summary.icons += n;
  console.log(
    `${n ? '●' : c.g('✓')} Logos: ${Object.keys(incoming).length}${n ? '' : ' — unverändert'}`,
  );
  list('neu', added, c.g);
  list('entfernt', removed, c.r);
  list('geändert', changed, c.y);
  for (const [k, svg] of Object.entries(incoming))
    writes.push([join(LOGOS, `${k}.svg`), svg.trim() + '\n']);
  iconDeletes.push(...removed.map((k) => join(LOGOS, `${k}.svg`)));
} else if (data.icons) {
  console.log(c.y('– Logos nicht im Export (Plugin-Version ohne Logos?) — übersprungen'));
}

console.log(`\n${changes ? c.b(`${changes} Änderung(en)`) : c.g('Figma und Code sind synchron.')}`);
if (dryRun) {
  console.log(c.y('--dry-run: nichts geschrieben.'));
  process.exit(0);
}

for (const [path, body] of writes) writeFileSync(path, body);
for (const path of iconDeletes) rmSync(path);

// Changeset für den Changelog: „Sync mit DDS vX“ (Text und Stufe vor dem Commit prüfen/anpassen)
if (changes) {
  const pkgs = [
    ...(summary.added + summary.changed + summary.removed + summary.styles
      ? ['@dextinity/tokens']
      : []),
    ...(summary.icons ? ['@dextinity/icons'] : []),
  ];
  const vars = [
    summary.added && `${summary.added} neu`,
    summary.changed && `${summary.changed} geändert`,
    summary.removed && `${summary.removed} entfernt`,
  ].filter(Boolean);
  const parts = [
    vars.length && `Variablen ${vars.join(', ')}`,
    summary.styles && `${summary.styles} Style-Änderungen`,
    summary.icons && `${summary.icons} Icon-/Logo-Änderungen`,
  ].filter(Boolean);
  const from = oldVersion && oldVersion !== newVersion ? ` (vorher ${oldVersion})` : '';
  // Stufe nach AGENTS.md → „Versionen & Changesets“: vor 1.0 Breaking (entfernt) → minor, sonst patch;
  // ab 1.0 entfernt → major, neu → minor, nur geändert → patch.
  const current = JSON.parse(
    readFileSync(join(ROOT, 'packages/tokens/package.json'), 'utf8'),
  ).version;
  const preRelease = Number(current.split('.')[0]) < 1;
  const bump = preRelease
    ? summary.removed
      ? 'minor'
      : 'patch'
    : summary.removed
      ? 'major'
      : summary.added || summary.icons
        ? 'minor'
        : 'patch';
  const file = join(ROOT, '.changeset', `figma-sync-${new Date().toISOString().slice(0, 10)}.md`);
  writeFileSync(
    file,
    `---\n${pkgs.map((p) => `'${p}': ${bump}`).join('\n')}\n---\n\nSync mit Figma ${newVersion ?? ''}${from}: ${parts.join(' · ')}.\n`,
  );
  console.log(
    c.y(`\nChangeset angelegt: ${file.replace(ROOT + '/', '')} — Text und Stufe prüfen.`),
  );
}

const run = (cwd, script) =>
  execFileSync('node', [script], { cwd: join(ROOT, cwd), stdio: 'inherit' });
run('packages/tokens', 'scripts/build.mjs');
run('packages/icons', 'scripts/generate.mjs');
console.log(
  `\nWeiter: git diff prüfen → pnpm test → pnpm test:visual (gewollte Änderungen: test:visual:update) → PR`,
);
