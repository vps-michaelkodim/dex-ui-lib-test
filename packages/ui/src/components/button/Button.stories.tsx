import { AddNoCircleIcon, ChevronDownIcon, DeleteIcon, EditIcon } from '@dextinity/icons';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Button } from './Button';
import { figmaDesign } from '../../lib/figma';

const VARIANTS = ['contained', 'outlined', 'text'] as const;
const COLORS = ['primary', 'secondary', 'error', 'success'] as const;

const meta = {
  title: 'Components/Button',
  component: Button,
  args: {
    children: 'Button',
    onClick: fn(),
  },
  argTypes: {
    variant: { control: 'inline-radio', options: VARIANTS },
    color: { control: 'inline-radio', options: COLORS },
    size: { control: 'inline-radio', options: ['default', 'small'] },
    startIcon: { control: false },
    endIcon: { control: false },
  },
  parameters: {
    design: figmaDesign('25:2'),
    docs: {
      description: {
        component:
          'Figma: `03 Components / Button`. Props entsprechen den Figma-Properties (Variant, Color, Size, Disabled, Loading, Start/End Icon, Children). `_State` (Hover, Focus, Active) ist kein Prop, sondern echtes Interaktionsverhalten.',
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ canvasElement, args }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Button' });
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
    // Tastatur: Enter + Leertaste lösen aus
    button.focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    await expect(args.onClick).toHaveBeenCalledTimes(3);
  },
};

/** Alle Kombinationen aus Variant × Color, wie im Figma-Component-Set. */
export const Matrix: Story = {
  parameters: {
    layout: 'padded',
    // Bekannter Figma-Befund: Success (und je nach Theme/Brand weitere Farben) < 4.5:1.
    // Siehe docs/figma-gap-report.md #17 — bis zum Fix in Figma nur Warnung statt Fehler.
    a11y: { test: 'todo' },
  },
  render: (args) => (
    <div className="grid w-max grid-cols-[auto_repeat(3,max-content)] items-center gap-4">
      <span />
      {VARIANTS.map((v) => (
        <span key={v} className="typo-label-xs text-foreground-muted">
          {v}
        </span>
      ))}
      {COLORS.map((c) => (
        <div key={c} className="contents">
          <span className="typo-label-xs text-foreground-muted">{c}</span>
          {VARIANTS.map((v) => (
            <Button key={v} {...args} variant={v} color={c}>
              Button
            </Button>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Button {...args} size="default">
        Default
      </Button>
      <Button {...args} size="small">
        Small
      </Button>
    </div>
  ),
};

export const WithIcons: Story = {
  name: 'With icons',
  render: (args) => (
    <div className="flex flex-wrap items-center gap-4">
      <Button {...args} startIcon={<AddNoCircleIcon />}>
        Hinzufügen
      </Button>
      <Button {...args} variant="outlined" color="secondary" startIcon={<EditIcon />}>
        Bearbeiten
      </Button>
      <Button {...args} variant="text" endIcon={<ChevronDownIcon />}>
        Mehr
      </Button>
      <Button {...args} color="error" startIcon={<DeleteIcon />} size="small">
        Löschen
      </Button>
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <div className="flex items-center gap-4">
      {VARIANTS.map((v) => (
        <Button key={v} {...args} variant={v}>
          {v}
        </Button>
      ))}
    </div>
  ),
  play: async ({ canvasElement, args }) => {
    const buttons = within(canvasElement).getAllByRole('button');
    for (const b of buttons) {
      await expect(b).toBeDisabled();
      await userEvent.click(b, { pointerEventsCheck: 0 });
    }
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const Loading: Story = {
  args: { loading: true, children: 'Speichern' },
  play: async ({ canvasElement, args }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Speichern' });
    await expect(button).toHaveAttribute('aria-busy', 'true');
    // bleibt fokussierbar, löst aber nicht aus
    button.focus();
    await expect(button).toHaveFocus();
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const AsLink: Story = {
  name: 'As link',
  args: {
    children: 'Zur Doku',
    render: <a href="#doku" />,
    nativeButton: false,
    variant: 'outlined',
  },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('button', { name: 'Zur Doku' }).tagName).toBe('A');
  },
};
