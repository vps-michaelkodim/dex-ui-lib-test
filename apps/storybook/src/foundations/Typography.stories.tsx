import type { Meta, StoryObj } from '@storybook/react-vite';
import { meta, tokensOf } from './meta';
import { Code, Page, Section } from './ui';
import { figmaDesign } from '../figma';

function TextStyles() {
  return (
    <Page
      title="Typography"
      intro="Text-Styles aus Figma als Tailwind-Utilities (typo-*). Größen sind responsive (Desktop/Mobile < 1024px)."
    >
      <Section title="Text-Styles">
        <div className="divide-y divide-border-subtle">
          {meta.tailwind.typography.map((t) => (
            <div key={t.class} className="grid grid-cols-[1fr_16rem] items-baseline gap-4 py-3">
              <div className={t.class}>Dextinity Admin — {t.figma}</div>
              <div className="space-y-1">
                <Code>{t.class}</Code>
                <div className="typo-body-xs-normal text-foreground-muted">{t.figma}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>
      <Section title="Größen (Responsive)" note="Tailwind: text-display, text-h1 … text-label-xs">
        <table className="w-full text-left typo-body-sm-normal">
          <thead className="typo-label-xs text-foreground-muted">
            <tr>
              <th className="pb-2">Token</th>
              <th className="pb-2">Desktop</th>
              <th className="pb-2">Mobile</th>
            </tr>
          </thead>
          <tbody>
            {tokensOf('Responsive', 'typography/').map((t) => (
              <tr key={t.name} className="border-b border-border-subtle">
                <td className="py-1.5">
                  <Code>{t.cssVar}</Code>
                </td>
                <td>{String(t.values.Desktop)}</td>
                <td>{String(t.values.Mobile)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
    </Page>
  );
}

const storyMeta = {
  title: 'Foundations/Typography',
  parameters: { layout: 'fullscreen', design: figmaDesign('128:26') },
  tags: ['!autodocs'],
} satisfies Meta;
export default storyMeta;

export const Styles: StoryObj<typeof storyMeta> = { render: () => <TextStyles /> };
