import rawMeta from '@dextinity/tokens/meta';

export interface TokenMeta {
  collection: 'Primitives' | 'Brand' | 'Semantic' | 'Responsive' | 'Components';
  name: string;
  type: string;
  cssVar: string | null;
  values: Record<string, unknown>;
  aliases?: Record<string, string>;
  description?: string;
}

export interface TokensMeta {
  prefix: string;
  collections: Record<string, { modes: string[]; attribute: string | null }>;
  tokens: TokenMeta[];
  tailwind: {
    colors: { class: string; token: string | null }[];
    radius: string[];
    spacing: string[];
    text: string[];
    shadows: string[];
    ease: string[];
    typography: { class: string; figma: string }[];
  };
  textStyles: { name: string; style: string; fontSize: number; lineHeight: number }[];
  effectStyles: { name: string; layers: unknown[] }[];
}

export const meta = rawMeta as unknown as TokensMeta;

export const tokensOf = (collection: TokenMeta['collection'], prefix = '') =>
  meta.tokens.filter((t) => t.collection === collection && t.name.startsWith(prefix));

/** Tailwind-Farbklasse zu einem Semantic-Token, z.B. color/action/primary/default → action-primary */
export const twColorFor = (name: string) =>
  meta.tailwind.colors.find((c) => c.token === name)?.class ?? null;

/** Gruppiert nach den ersten n Pfad-Segmenten. */
export function groupBy(tokens: TokenMeta[], depth: number) {
  const groups = new Map<string, TokenMeta[]>();
  for (const t of tokens) {
    const key = t.name.split('/').slice(0, depth).join('/');
    groups.set(key, [...(groups.get(key) ?? []), t]);
  }
  return groups;
}
