import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { figmaDesign } from '../../lib/figma';
import { Text, type TextSize, type TextVariant } from './Text';

const meta = {
  title: 'Components/Text',
  component: Text,
  args: { children: 'Verwalte, wer Zugriff auf deinen Workspace hat.' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['display', 'heading', 'body', 'caption', 'label', 'data'],
    },
    size: {
      control: 'select',
      options: [undefined, 'h1', 'h2', 'h3', 'h4', 'large', 'medium', 'small', 'x-small'],
    },
    weight: { control: 'inline-radio', options: ['normal', 'bold'] },
    color: { control: 'inline-radio', options: ['default', 'muted', 'subtle', 'inherit'] },
  },
  parameters: {
    design: figmaDesign('1088:30'),
    docs: {
      description: {
        component:
          'Figma: `03 Components / Typography` (Variant × Size). Setzt die Figma-Text-Styles mit passendem HTML-Element (`heading` → `h1`–`h4`, `body` → `p`). Bold ist im Code die Prop `weight="bold"` (nutzt die Bold-Text-Styles). Caption ist automatisch `muted`, Data hat gleich breite Ziffern.',
      },
    },
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

const ROWS: { variant: TextVariant; size?: TextSize; label: string }[] = [
  { variant: 'display', label: 'Display' },
  { variant: 'heading', size: 'h1', label: 'Heading H1' },
  { variant: 'heading', size: 'h2', label: 'Heading H2' },
  { variant: 'heading', size: 'h3', label: 'Heading H3' },
  { variant: 'heading', size: 'h4', label: 'Heading H4' },
  { variant: 'body', size: 'large', label: 'Body Large' },
  { variant: 'body', size: 'medium', label: 'Body Medium' },
  { variant: 'body', size: 'small', label: 'Body Small' },
  { variant: 'body', size: 'x-small', label: 'Body X-Small' },
  { variant: 'caption', label: 'Caption' },
  { variant: 'label', size: 'medium', label: 'Label Medium' },
  { variant: 'label', size: 'small', label: 'Label Small' },
  { variant: 'label', size: 'x-small', label: 'Label X-Small' },
  { variant: 'data', size: 'medium', label: 'Data Medium 1.284,50 €' },
  { variant: 'data', size: 'small', label: 'Data Small 1.284,50 €' },
];

export const Variants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="grid w-max grid-cols-2 items-baseline gap-x-10 gap-y-3">
      {ROWS.map((r) => (
        <div key={r.label} className="contents">
          <Text variant={r.variant} size={r.size}>
            {r.label}
          </Text>
          <Text variant={r.variant} size={r.size} weight="bold" as="span">
            {r.label}
          </Text>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(
      c.getAllByRole('heading', { level: 2, name: 'Heading H2' })[0],
    ).toBeInTheDocument();
  },
};
