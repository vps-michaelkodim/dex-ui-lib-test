/**
 * Erzeugt die maschinenlesbare Beschreibung der Library für AI-Tools und das Claude Design System:
 *
 *   ai/manifest.json   Komponenten (Props + Figma-Mapping + Beispiele), Tokens je Theme × Brand,
 *                      Tailwind-Klassen, Text-Styles, Icons, Regeln
 *   llms.txt           Einstieg nach llmstxt.org (verlinkt Doku + Manifest)
 *
 * Aufruf: pnpm manifest   (nach Änderungen an Komponenten, Tokens oder Icons)
 * Quelle ist immer das Repo — das Manifest wird nie von Hand bearbeitet.
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import docgen from 'react-docgen-typescript';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const REPO = 'https://github.com/vps-michaelkodim/dex-ui-lib-test';
const FIGMA_FILE =
  'https://www.figma.com/design/xAe7acdpccDSRCrfeOdAg3/DDS---Dextinity-Admin-UI---V-0.1';
const read = (p) => readFileSync(join(ROOT, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const pkg = (p) => json(`${p}/package.json`);

/** Props aus Base UI, die bewusst dokumentiert werden (z.B. Button als Link: render + nativeButton). */
const BASE_UI_PROPS = ['render', 'nativeButton', 'focusableWhenDisabled'];
/** Zusätzlich bei Checkbox, Radio, Switch: Wert/Zustand kommen aus Base UI. */
const CHOICE_PROPS = [
  'checked',
  'defaultChecked',
  'onCheckedChange',
  'value',
  'name',
  'required',
  'parent',
];
const CHOICE_COMPONENTS = ['Checkbox', 'Radio', 'Switch'];

// ─── Komponenten ───────────────────────────────────────────────────────────────────────────
const COMPONENTS_DIR = 'packages/ui/src/components';
const parser = docgen.withCustomConfig(join(ROOT, 'apps/storybook/tsconfig.json'), {
  shouldExtractLiteralValuesFromEnum: true,
  shouldRemoveUndefinedFromOptional: true,
  savePropValueAsString: true,
  // Eigene Props + ausgewählte Base-UI-Props, die man im Alltag braucht
  propFilter: (prop, component) =>
    !prop.parent ||
    !/node_modules/.test(prop.parent.fileName) ||
    BASE_UI_PROPS.includes(prop.name) ||
    (CHOICE_COMPONENTS.includes(component.name) && CHOICE_PROPS.includes(prop.name)),
});

/** Figma-Nodes für Komponenten ohne eigene Stories (sonst aus parameters.design der Stories). */
const FIGMA_NODES = { FormLabel: '774:618', FormHelperText: '775:620', Spinner: '783:1598' };

const components = [];
for (const dir of readdirSync(join(ROOT, COMPONENTS_DIR)).sort()) {
  const files = readdirSync(join(ROOT, COMPONENTS_DIR, dir)).filter(
    (f) => /^[A-Z].*\.tsx$/.test(f) && !f.includes('.stories.'),
  );
  for (const file of files) {
    const path = join(ROOT, COMPONENTS_DIR, dir, file);
    for (const doc of parser.parse(path)) {
      const storiesPath = join(ROOT, COMPONENTS_DIR, dir, `${doc.displayName}.stories.tsx`);
      const stories = existsSync(storiesPath) ? readFileSync(storiesPath, 'utf8') : '';
      const figmaNode =
        stories.match(/figmaDesign\('([^']+)'\)/)?.[1] ?? FIGMA_NODES[doc.displayName] ?? null;
      const storyNames = [...stories.matchAll(/^export const (\w+): Story/gm)].map((m) => m[1]);
      const title = stories.match(/title: '([^']+)'/)?.[1] ?? null;
      const description = doc.description ?? '';
      const examples = [...description.matchAll(/```tsx\n([\s\S]*?)```/g)].map((m) => m[1].trim());
      components.push({
        name: doc.displayName,
        import: `import { ${doc.displayName} } from '@dextinity/ui';`,
        summary: description
          .replace(/```[\s\S]*?```/g, '')
          .replace(new RegExp(`^${doc.displayName} — `), '')
          .trim(),
        figma: figmaNode
          ? { node: figmaNode, url: `${FIGMA_FILE}?node-id=${figmaNode.replace(':', '-')}` }
          : null,
        source: relative(ROOT, path),
        storybook: title ? { title, stories: storyNames } : null,
        props: Object.values(doc.props)
          .map((p) => ({
            name: p.name,
            type: p.type.name,
            ...(p.type.value
              ? { values: p.type.value.map((v) => v.value.replace(/^"|"$/g, '')) }
              : {}),
            required: p.required,
            ...(p.defaultValue?.value !== undefined ? { default: p.defaultValue.value } : {}),
            description: p.description,
          }))
          .sort((a, b) => Number(b.required) - Number(a.required) || a.name.localeCompare(b.name)),
        examples,
      });
    }
  }
}

// ─── Tokens (aufgelöst je Theme × Brand) ───────────────────────────────────────────────────
const meta = json('packages/tokens/tokens.meta.json');
const RAW = 'packages/tokens/figma/raw';
const raw = {};
for (const [c, f] of Object.entries({
  Primitives: 'primitives',
  Brand: 'brand',
  Semantic: 'semantic',
  Responsive: 'responsive',
  Components: 'components',
}))
  raw[c] = json(`${RAW}/${f}.json`);
const rowOf = Object.fromEntries(
  Object.entries(raw).flatMap(([c, r]) => r.variables.map((row) => [`${c}::${row[0]}`, row])),
);
const THEMES = raw.Semantic.modes; // Light, Dark, High Contrast
const BRANDS = raw.Brand.modes; // Dextinity, Crimson
function resolve(collection, name, theme, brand) {
  const row = rowOf[`${collection}::${name}`];
  const modes = raw[collection].modes;
  const mode =
    collection === 'Semantic'
      ? theme
      : collection === 'Brand'
        ? brand
        : collection === 'Responsive'
          ? 'Desktop'
          : modes[0];
  const v = row[2][Math.max(0, modes.indexOf(mode))];
  if (typeof v === 'string' && v.startsWith('@')) {
    const [c, n] = v.slice(1).split('::');
    return resolve(c, n, theme, brand);
  }
  return v;
}
const slug = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
const twFor = Object.fromEntries(
  meta.tailwind.colors.filter((c) => c.token).map((c) => [c.token, c.class]),
);
const semanticColors = meta.tokens
  .filter((t) => t.collection === 'Semantic' && t.type === 'color')
  .map((t) => ({
    name: t.name,
    cssVar: t.cssVar,
    tailwind: twFor[t.name] ?? null,
    values: Object.fromEntries(
      BRANDS.flatMap((b) =>
        THEMES.map((th) => [`${slug(th)}/${slug(b)}`, resolve('Semantic', t.name, th, b)]),
      ),
    ),
  }));
/** Semantic-Tokens ohne Farbe (z.B. focus-ring/width), je Theme. */
const semanticOther = meta.tokens
  .filter((t) => t.collection === 'Semantic' && t.type !== 'color')
  .map((t) => ({
    name: t.name,
    cssVar: t.cssVar,
    type: t.type,
    values: Object.fromEntries(THEMES.map((th) => [slug(th), t.values[th]])),
  }));
const tokenList = (collection) =>
  meta.tokens
    .filter((t) => t.collection === collection && t.cssVar)
    .map((t) => ({
      name: t.name,
      cssVar: t.cssVar,
      type: t.type,
      values: t.values,
      ...(t.aliases ? { alias: Object.values(t.aliases)[0] } : {}),
      ...(t.description ? { description: t.description } : {}),
    }));

// ─── Icons ─────────────────────────────────────────────────────────────────────────────────
const icons = json('packages/icons/icons.meta.json').map((i) => ({
  name: i.name,
  figma: i.figma,
  keywords: i.keywords,
  colored: i.colored,
}));

// ─── Manifest ──────────────────────────────────────────────────────────────────────────────
const manifest = {
  $schema: 'dextinity-ui-manifest@1',
  name: 'Dextinity UI',
  description:
    'React-Komponenten, Design Tokens und Icons für Dextinity (Admin + Chatbot), generiert aus dem Figma-Design-System „DDS – Dextinity Admin UI“. Das Repo ist die Quelle; dieses Manifest wird aus dem Code erzeugt.',
  repository: REPO,
  figma: FIGMA_FILE,
  packages: Object.fromEntries(
    ['packages/ui', 'packages/tokens', 'packages/icons'].map((p) => [
      pkg(p).name,
      { version: pkg(p).version, path: p },
    ]),
  ),
  stack: {
    react: pkg('packages/ui').peerDependencies.react,
    headless: `@base-ui/react ${pkg('packages/ui').dependencies['@base-ui/react']}`,
    styling: `tailwindcss ${pkg('packages/ui').devDependencies.tailwindcss} (Default-Palette deaktiviert, nur Token-Klassen)`,
  },
  setup: {
    css: ["@import '@dextinity/ui/fonts.css';", "@import '@dextinity/ui/styles.css';"],
    html: '<html data-theme="light" data-brand="dextinity">',
    themes: THEMES.map(slug),
    brands: BRANDS.map(slug),
    themeAttribute:
      'data-theme (am <html> oder Container; im Container immer zusammen mit data-brand)',
    fonts: {
      dextinity: { family: 'Inter', npm: '@fontsource/inter', weights: [400, 500, 600, 700] },
      crimson: {
        family: 'Source Sans Pro',
        npm: '@fontsource/source-sans-pro',
        weights: [400, 600, 700],
        note: 'Kein Medium (500) — Medium fällt auf 400/600 zurück (Gap-Report #3). Nicht durch Source Sans 3 ersetzen, sonst weicht die Darstellung vom Code ab.',
      },
    },
  },
  rules: [
    'Das Repo ist die Quelle. Neue Komponenten entstehen zuerst im Repo (aus Figma), nie nur im Design System.',
    'Nur Komponenten aus @dextinity/ui und Token-Klassen verwenden — keine Hex-Werte, keine Tailwind-Default-Farben (deaktiviert).',
    'Props entsprechen den Figma-Properties (camelCase). _State (Hover, Focus, Pressed) ist kein Prop.',
    'IconButton braucht immer aria-label. Icons ohne title sind dekorativ.',
    'Validierung bei Input über status="error|success|warning", Fehlertext über helperText.',
    'Sprache der UI: Deutsch, informelles „du“.',
    'Bekannte Kontrastprobleme aus Figma stehen in docs/figma-gap-report.md — Werte nicht eigenmächtig ändern.',
  ],
  components,
  tokens: {
    semanticColors,
    semanticOther,
    brand: tokenList('Brand'),
    responsive: tokenList('Responsive'),
    primitives: tokenList('Primitives'),
    components: tokenList('Components'),
  },
  tailwind: meta.tailwind,
  textStyles: meta.textStyles.map((s) => ({
    name: s.name,
    class: `typo-${slug(s.name)}`,
    fontSize: s.fontSize,
    lineHeight: s.lineHeight,
    weight: s.style,
  })),
  effectStyles: meta.effectStyles,
  icons: {
    count: icons.length,
    import: "import { SearchIcon } from '@dextinity/icons';",
    items: icons,
  },
  docs: {
    agents: 'AGENTS.md',
    tokens: 'packages/tokens/README.md',
    sync: 'docs/TOKEN_SYNC.md',
    visualTests: 'docs/VISUAL_TESTS.md',
    gapReport: 'docs/figma-gap-report.md',
    roadmap: 'docs/ROADMAP.md',
  },
};

mkdirSync(join(ROOT, 'ai'), { recursive: true });
writeFileSync(join(ROOT, 'ai/manifest.json'), JSON.stringify(manifest, null, 2) + '\n');

// ─── llms.txt ──────────────────────────────────────────────────────────────────────────────
const blob = (p) => `${REPO}/blob/main/${p}`;
const llms = `# Dextinity UI

> ${manifest.description}

Stack: React 19, Base UI, Tailwind v4 (nur Token-Klassen), Storybook 10. Themes: ${manifest.setup.themes.join(', ')} · Brands: ${manifest.setup.brands.join(', ')} (\`data-theme\`, \`data-brand\` am \`<html>\`).

## Regeln

${manifest.rules.map((r) => `- ${r}`).join('\n')}

## Komponenten (\`@dextinity/ui\`)

${components.map((c) => `- ${c.name}: ${c.summary.split('\n')[0].replace(/\s+$/, '')}${c.props.length ? ` Props: ${c.props.map((p) => p.name).join(', ')}` : ''}`).join('\n')}

## Doku

- [AGENTS.md](${blob('AGENTS.md')}): Regeln für Code, Tokens, Tailwind-Klassen, Stories
- [Manifest](${blob('ai/manifest.json')}): alle Komponenten mit Props, Tokens je Theme × Brand, Icons (maschinenlesbar)
- [Tokens](${blob('packages/tokens/README.md')}): Ebenen, CSS-Variablen, Theming
- [Figma-Sync](${blob('docs/TOKEN_SYNC.md')}): Plugin „DDS Export“ + figma:import
- [Gap-Report](${blob('docs/figma-gap-report.md')}): bekannte Abweichungen/Kontrastprobleme in Figma

## Optional

- [Icons](${blob('packages/icons/icons.meta.json')}): ${icons.length} Icons mit Suchbegriffen
- [Screenshot-Tests](${blob('docs/VISUAL_TESTS.md')})
- [Roadmap](${blob('docs/ROADMAP.md')})
`;
writeFileSync(join(ROOT, 'llms.txt'), llms);

console.log(
  `✓ ai/manifest.json · ${components.length} Komponenten · ${semanticColors.length} Semantic-Farben × ${THEMES.length * BRANDS.length} Modi · ${icons.length} Icons · llms.txt`,
);
