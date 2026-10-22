/**
 * @dextinity/icons — Generator
 *
 *   svg/<FigmaName>.svg  ──►  src/generated/<Name>Icon.tsx + src/generated/index.ts + icons.meta.json
 *   logos/<brand>--<color>[--sign].svg  ──►  src/generated/DextinityLogo.tsx (Figma: „Dextinity Logos“)
 *
 * Figma-Name "Search_Finding_Loupe" → Komponente SearchIcon, Suchbegriffe ["Finding", "Loupe"].
 * Namen mit "_"-Prefix (Figma-Konvention: intern/Entwurf) werden übersprungen.
 * Monochrome Icons: black → currentColor. Icons mit "Color" im Namen behalten ihre Farben.
 *
 * Aufruf: pnpm --filter @dextinity/icons generate
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SVG_DIR = join(ROOT, 'svg');
const OUT = join(ROOT, 'src', 'generated');
const LOGO_DIR = join(ROOT, 'logos');

const pascal = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const splitWords = (s) =>
  s
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .split(/\s+/)
    .filter(Boolean);
const MONO = /^(black|#000|#000000|#242424)$/i;

function toJsx(svg, { colored }) {
  let inner = svg
    .replace(/\r?\n/g, '')
    .replace(/^.*?<svg[^>]*>/, '')
    .replace(/<\/svg>\s*$/, '');
  if (!colored)
    inner = inner.replace(/(fill|stroke)="([^"]+)"/g, (m, a, v) =>
      MONO.test(v) ? `${a}="currentColor"` : m,
    );
  // Attribute → JSX (fill-rule → fillRule, …)
  inner = inner.replace(
    /\s([a-z]+(?:-[a-z]+)+)=/g,
    (_, a) => ' ' + a.replace(/-([a-z])/g, (_, c) => c.toUpperCase()) + '=',
  );
  inner = inner.replace(/\sclass=/g, ' className=').replace(/\sxlink:href=/g, ' href=');
  // IDs eindeutig machen (mehrere gleiche Icons auf einer Seite)
  const hasIds = /\sid="/.test(inner);
  if (hasIds) {
    inner = inner
      .replace(/\sid="([^"]+)"/g, (_, i) => ` id={\`\${uid}${i}\`}`)
      .replace(/(\w+)="url\(#([^)]+)\)"/g, (_, a, i) => `${a}={\`url(#\${uid}${i})\`}`);
  }
  return { inner, hasIds };
}

const files = readdirSync(SVG_DIR)
  .filter((f) => f.endsWith('.svg'))
  .sort();
const icons = [];
const seen = new Map();
const skipped = [];

for (const file of files) {
  const figma = basename(file, '.svg');
  if (figma.startsWith('_')) {
    skipped.push(figma);
    continue;
  }
  const [first, ...rest] = figma.split('_').filter(Boolean);
  const name = `${pascal(first)}Icon`;
  if (seen.has(name)) throw new Error(`Namenskollision: ${figma} und ${seen.get(name)} → ${name}`);
  seen.set(name, figma);
  const colored = /Color/.test(figma);
  const svg = readFileSync(join(SVG_DIR, file), 'utf8');
  const { inner, hasIds } = toJsx(svg, { colored });
  icons.push({
    name,
    figma,
    keywords: [...new Set(rest.flatMap(splitWords))],
    colored,
    inner,
    hasIds,
  });
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
const HEADER = '// GENERIERT von packages/icons/scripts/generate.mjs — nicht von Hand ändern.\n';

for (const i of icons) {
  const body = i.hasIds
    ? `  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');\n  return (\n    <Icon {...props}>${i.inner}</Icon>\n  );`
    : `  return <Icon {...props}>${i.inner}</Icon>;`;
  writeFileSync(
    join(OUT, `${i.name}.tsx`),
    `${HEADER}${i.hasIds ? "import { useId } from 'react';\n" : ''}import { Icon, type IconProps } from '../Icon';

/** Figma: \`${i.figma}\`${i.keywords.length ? ` · ${i.keywords.join(', ')}` : ''} */
export function ${i.name}(props: IconProps) {
${body}
}
`,
  );
}

// ── Logos ─────────────────────────────────────────────────────────────────────────────────
// Datei „dextinity-ai-hub--negative--sign.svg“ → brand 'ai-hub', color 'negative', signOnly.
const brandOf = (slug) => slug.replace(/^dextinity-/, '').replace(/-brand$/, '');
const ACRONYMS = new Set(['ai', 'cms']);
const brandLabel = (slug) =>
  slug
    .replace(/-main-brand$/, '')
    .replace(/-brand$/, '')
    .split('-')
    .map((w) => (ACRONYMS.has(w) ? w.toUpperCase() : pascal(w)))
    .join(' ');
const logoFiles = existsSync(LOGO_DIR)
  ? readdirSync(LOGO_DIR)
      .filter((f) => f.endsWith('.svg'))
      .sort()
  : [];
const logos = logoFiles.map((file) => {
  const key = basename(file, '.svg');
  const [brandSlug, color, sign] = key.split('--');
  const svg = readFileSync(join(LOGO_DIR, file), 'utf8');
  const [, w, h] = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/) ?? [];
  const { inner } = toJsx(svg, { colored: true });
  return {
    id: `${brandOf(brandSlug)}--${color}${sign ? '--sign' : ''}`,
    brand: brandOf(brandSlug),
    label: brandLabel(brandSlug),
    w,
    h,
    inner,
  };
});
const brands = [...new Set(logos.map((l) => l.brand))];
const brandType = brands.length ? brands.map((b) => `'${b}'`).join(' | ') : 'string';
const defaultBrand = brands.includes('main') ? 'main' : (brands[0] ?? 'main');
writeFileSync(
  join(OUT, 'DextinityLogo.tsx'),
  `${HEADER}import { useId, type ReactNode, type SVGProps } from 'react';

export type DextinityLogoBrand = ${brandType};

export interface DextinityLogoProps extends Omit<SVGProps<SVGSVGElement>, 'color'> {
  /** Figma: Brand. @default '${defaultBrand}' */
  brand?: DextinityLogoBrand;
  /** Figma: Color — \`positive\` für helle, \`negative\` für dunkle Flächen. @default 'positive' */
  color?: 'positive' | 'negative';
  /** Figma: onlySign — nur das Zeichen (z.B. Mobile). */
  signOnly?: boolean;
  /** Zugänglicher Name. @default Markenname, z.B. „Dextinity AI Hub“ */
  title?: string;
}

const LOGOS: Record<string, { label: string; w: number; h: number; render: (uid: string) => ReactNode }> = {
${logos
  .map(
    (l) => `  '${l.id}': {
    label: '${l.label}',
    w: ${l.w},
    h: ${l.h},
    render: (uid) => (
      <>${l.inner}</>
    ),
  },`,
  )
  .join('\n')}
};

/**
 * Dextinity-Logo — Figma: \`Dextinity Logos\` (Brand × Color × onlySign).
 * Für \`signOnly\` gibt es nur die Positive-Variante; sie wird dann auch für \`negative\` verwendet.
 */
export function DextinityLogo({
  brand = '${defaultBrand}',
  color = 'positive',
  signOnly = false,
  title,
  ...props
}: DextinityLogoProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const sign = signOnly ? '--sign' : '';
  const logo = LOGOS[\`\${brand}--\${color}\${sign}\`] ?? LOGOS[\`\${brand}--positive\${sign}\`];
  if (!logo) return null;
  return (
    <svg
      viewBox={\`0 0 \${logo.w} \${logo.h}\`}
      width={logo.w}
      height={logo.h}
      fill="none"
      role="img"
      aria-label={title ?? logo.label}
      {...props}
    >
      {logo.render(uid)}
    </svg>
  );
}
`,
);

writeFileSync(
  join(OUT, 'index.ts'),
  `${HEADER}${icons.map((i) => `export { ${i.name} } from './${i.name}';`).join('\n')}\nexport { DextinityLogo, type DextinityLogoBrand, type DextinityLogoProps } from './DextinityLogo';\n`,
);

const meta = icons.map(({ name, figma, keywords, colored }) => ({
  name,
  figma,
  keywords,
  colored,
}));
writeFileSync(
  join(OUT, 'meta.ts'),
  `${HEADER}export const iconsMeta = ${JSON.stringify(meta, null, 2)} as const;\n`,
);
writeFileSync(join(ROOT, 'icons.meta.json'), JSON.stringify(meta, null, 2) + '\n');

console.log(
  `✓ ${icons.length} Icons · ${logos.length} Logos generiert${skipped.length ? ` · ${skipped.length} übersprungen (_-Prefix)` : ''}`,
);
