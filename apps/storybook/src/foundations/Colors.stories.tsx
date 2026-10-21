import type { Meta, StoryObj } from '@storybook/react-vite';
import { groupBy, meta, tokensOf, twColorFor, type TokenMeta } from './meta';
import { Code, Page, Section } from './ui';

function Swatch({ cssVar }: { cssVar: string | null }) {
  return (
    <div
      aria-hidden
      className="size-10 shrink-0 rounded-md border border-border-subtle"
      style={{
        background: cssVar
          ? `linear-gradient(var(${cssVar}), var(${cssVar})), repeating-conic-gradient(#ccc 0 25%, #fff 0 50%) 0 0 / 8px 8px`
          : undefined,
      }}
    />
  );
}

/** Passendes Tailwind-Utility je Gruppe: Text-, Border- oder Background-Farbe. */
const utilityPrefix = (name: string) =>
  /^color\/foreground/.test(name) ? 'text' : /^color\/border/.test(name) ? 'border' : 'bg';

function SemanticRow({ t }: { t: TokenMeta }) {
  const tw = twColorFor(t.name);
  const modes = meta.collections.Semantic?.modes ?? [];
  return (
    <tr className="border-b border-border-subtle align-top">
      <td className="py-2 pr-3">
        <Swatch cssVar={t.cssVar} />
      </td>
      <td className="py-2 pr-3">
        <div className="typo-label-sm">{t.name}</div>
        <div className="mt-1 flex flex-wrap gap-1">
          <Code>{t.cssVar}</Code>
          {tw ? (
            <Code>
              {utilityPrefix(t.name)}-{tw}
            </Code>
          ) : null}
        </div>
      </td>
      {modes.map((m) => (
        <td key={m} className="py-2 pr-3 typo-body-xs-normal text-foreground-muted">
          <div className="font-mono">{String(t.values[m])}</div>
          <div>{t.aliases?.[m]?.replace(/^.*::/, '') ?? '—'}</div>
        </td>
      ))}
    </tr>
  );
}

function SemanticColors() {
  const groups = groupBy(tokensOf('Semantic', 'color/'), 2);
  const modes = meta.collections.Semantic?.modes ?? [];
  return (
    <Page
      title="Colors"
      intro="Semantische Farben aus Figma (Collection „Semantic“). Swatches folgen live dem Theme/Brand aus der Toolbar. Komponenten verwenden ausschließlich diese Ebene."
    >
      {[...groups].map(([group, tokens]) => (
        <Section key={group} title={group}>
          <table className="w-full text-left">
            <thead>
              <tr className="typo-label-xs text-foreground-muted">
                <th className="w-12 pb-2">
                  <span className="sr-only">Vorschau</span>
                </th>
                <th className="pb-2">Token</th>
                {modes.map((m) => (
                  <th key={m} className="pb-2">
                    {m}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tokens.map((t) => (
                <SemanticRow key={t.name} t={t} />
              ))}
            </tbody>
          </table>
        </Section>
      ))}
    </Page>
  );
}

function Palette({
  collection,
  prefix,
  depth,
}: {
  collection: 'Brand' | 'Primitives';
  prefix: string;
  depth: number;
}) {
  const groups = groupBy(
    tokensOf(collection, prefix).filter((t) => t.type === 'color'),
    depth,
  );
  return (
    <div className="space-y-6">
      {[...groups].map(([group, tokens]) => (
        <div key={group} className="space-y-2">
          <div className="typo-label-sm">{group}</div>
          <div className="flex flex-wrap gap-2">
            {tokens.map((t) => (
              <div key={t.name} className="w-20 space-y-1">
                <div
                  className="h-12 rounded-md border border-border-subtle"
                  style={{ background: `var(${t.cssVar})` }}
                />
                <div className="typo-body-xs-normal">{t.name.split('/').at(-1)}</div>
                {Object.entries(t.values).map(([mode, value]) => (
                  <div key={mode} className="font-mono text-body-xs text-foreground-muted">
                    {Object.keys(t.values).length > 1 ? `${mode.slice(0, 1)} ` : ''}
                    {String(value)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const storyMeta = {
  title: 'Foundations/Colors',
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
} satisfies Meta;
export default storyMeta;
type Story = StoryObj<typeof storyMeta>;

export const Semantic: Story = { render: () => <SemanticColors /> };

export const BrandPalettes: Story = {
  name: 'Brand palettes',
  render: () => (
    <Page
      title="Brand palettes"
      intro="Funktionale Paletten der Collection „Brand“ — wechseln mit dem Brand in der Toolbar."
    >
      <Palette collection="Brand" prefix="brand/color/" depth={3} />
    </Page>
  ),
};

export const Primitives: Story = {
  render: () => (
    <Page title="Primitives" intro="Rohwerte. Nicht direkt in Komponenten verwenden.">
      <Palette collection="Primitives" prefix="color/" depth={2} />
    </Page>
  ),
};
