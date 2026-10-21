import type { Meta, StoryObj } from '@storybook/react-vite';
import { meta, tokensOf } from './meta';
import { Code, Page, Section } from './ui';
import { figmaDesign } from '../figma';

function Bar({ cssVar }: { cssVar: string | null }) {
  return (
    <div
      aria-hidden
      className="h-4 rounded-xs bg-action-primary"
      style={{ width: `var(${cssVar})` }}
    />
  );
}

function SpacingRadius() {
  return (
    <Page
      title="Spacing, Radius & Elevation"
      intro="Spacing folgt der Tailwind-Skala: unit/N = N × 4px = Tailwind p-N / gap-N. Layout-Spacing ist responsive."
    >
      <Section title="Units (Primitives)" note="Tailwind: p-4, gap-2, m-0.5 …">
        <div className="space-y-2">
          {tokensOf('Primitives', 'unit/').map((t) => (
            <div key={t.name} className="grid grid-cols-[8rem_5rem_1fr] items-center gap-4">
              <Code>{t.name.replace('unit/', '').replace(',', '.')}</Code>
              <span className="typo-body-xs-normal text-foreground-muted">
                {String(t.values.Default)}
              </span>
              <Bar cssVar={t.cssVar} />
            </div>
          ))}
        </div>
      </Section>
      <Section title="Layout-Spacing (Responsive)" note="Tailwind: p-layout-md, gap-layout-lg …">
        <div className="space-y-2">
          {tokensOf('Responsive', 'space/layout/').map((t) => (
            <div key={t.name} className="grid grid-cols-[8rem_9rem_1fr] items-center gap-4">
              <Code>{t.name.split('/').at(-1)}</Code>
              <span className="typo-body-xs-normal text-foreground-muted">
                {String(t.values.Desktop)} / {String(t.values.Mobile)}
              </span>
              <Bar cssVar={t.cssVar} />
            </div>
          ))}
        </div>
      </Section>
      <Section
        title="Radius"
        note="Primitives (rounded-sm …) und Brand-Rollen (rounded-control, rounded-forms …) — Brand-Rollen wechseln mit dem Brand."
      >
        <div className="flex flex-wrap gap-4">
          {meta.tailwind.radius.map((r) => (
            <div key={r} className="w-28 space-y-2">
              <div
                aria-hidden
                className={`h-16 border border-border-strong bg-background-muted ${r}`}
              />
              <Code>{r}</Code>
            </div>
          ))}
        </div>
      </Section>
      <Section title="Elevation" note="Figma Effect Styles → shadow-xs … shadow-xl">
        <div className="flex flex-wrap gap-8 p-4">
          {meta.tailwind.shadows.map((s) => (
            <div
              key={s}
              className={`flex h-24 w-32 items-end rounded-surface bg-background p-3 ${s}`}
            >
              <Code>{s}</Code>
            </div>
          ))}
        </div>
      </Section>
      <Section
        title="Motion"
        note="Easing: ease-standard … · Dauer: duration-(--dx-primitive-motion-duration-md)"
      >
        <table className="w-full text-left typo-body-sm-normal">
          <tbody>
            {tokensOf('Primitives', 'motion/').map((t) => (
              <tr key={t.name} className="border-b border-border-subtle">
                <td className="py-1.5">
                  <Code>{t.cssVar}</Code>
                </td>
                <td>{String(t.values.Default)}</td>
                <td className="text-foreground-muted">{t.description ?? ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
    </Page>
  );
}

const storyMeta = {
  title: 'Foundations/Spacing, Radius & Elevation',
  parameters: { layout: 'fullscreen', design: figmaDesign('128:27') },
  tags: ['!autodocs'],
} satisfies Meta;
export default storyMeta;

export const Overview: StoryObj<typeof storyMeta> = { render: () => <SpacingRadius /> };
