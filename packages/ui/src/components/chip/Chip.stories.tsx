import { CheckIcon, SettingsIcon } from '@dextinity/icons';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Chip } from './Chip';
import { figmaDesign } from '../../lib/figma';

const VARIANTS = ['contained', 'outlined'] as const;
const COLORS = ['primary', 'secondary', 'info', 'warning', 'error', 'success'] as const;

const meta = {
  title: 'Components/Chip',
  component: Chip,
  args: { children: 'Label' },
  argTypes: {
    variant: { control: 'inline-radio', options: VARIANTS },
    color: { control: 'inline-radio', options: COLORS },
    size: { control: 'inline-radio', options: ['default', 'small'] },
    startIcon: { control: false },
    endIcon: { control: false },
  },
  parameters: {
    design: figmaDesign('857:8838'),
    docs: {
      description: {
        component:
          'Figma: `03 Components / Chip`. Statisch (Status, Tag), klickbar (`onClick`, z.B. Filter) oder entfernbar (`onDelete`, Figma: Clear). Hover/Focus gibt es nur, wenn der Chip interaktiv ist.',
      },
    },
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Matrix: Story = {
  parameters: { layout: 'padded' },
  render: (args) => (
    <div className="grid w-max grid-cols-[auto_repeat(2,max-content)] items-center gap-3">
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
            <Chip key={v} {...args} variant={v} color={c}>
              {c}
            </Chip>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Chip {...args} size="default" startIcon={<SettingsIcon />}>
        Default
      </Chip>
      <Chip {...args} size="small" startIcon={<SettingsIcon />}>
        Small
      </Chip>
    </div>
  ),
};

function FilterChips() {
  const [active, setActive] = useState<string[]>(['Entwurf']);
  const toggle = (f: string) =>
    setActive((a) => (a.includes(f) ? a.filter((x) => x !== f) : [...a, f]));
  return (
    <div className="flex gap-2" role="group" aria-label="Status-Filter">
      {['Entwurf', 'Veröffentlicht', 'Archiviert'].map((f) => {
        const on = active.includes(f);
        return (
          <Chip
            key={f}
            color={on ? 'primary' : 'secondary'}
            variant={on ? 'contained' : 'outlined'}
            startIcon={on ? <CheckIcon /> : undefined}
            onClick={() => toggle(f)}
          >
            {f}
          </Chip>
        );
      })}
    </div>
  );
}

/** Klickbare Chips als Filter. */
export const Clickable: Story = {
  render: () => <FilterChips />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const chip = canvas.getByRole('button', { name: 'Veröffentlicht' });
    await userEvent.click(chip);
    await expect(chip.closest('[data-color]')).toHaveAttribute('data-color', 'primary');
    // per Tastatur bedienbar
    chip.focus();
    await userEvent.keyboard('{Enter}');
    await expect(chip.closest('[data-color]')).toHaveAttribute('data-color', 'secondary');
  },
};

function DeletableChips() {
  const [tags, setTags] = useState(['React', 'Tailwind', 'Base UI']);
  return (
    <div className="flex gap-2">
      {tags.map((t) => (
        <Chip
          key={t}
          onDelete={() => setTags((x) => x.filter((y) => y !== t))}
          deleteLabel={`${t} entfernen`}
        >
          {t}
        </Chip>
      ))}
    </div>
  );
}

/** Figma: Clear — entfernbare Chips (Tags). */
export const Deletable: Story = {
  render: () => <DeletableChips />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Tailwind entfernen' }));
    await expect(canvas.queryByText('Tailwind')).not.toBeInTheDocument();
    await expect(canvas.getByText('React')).toBeInTheDocument();
  },
};

export const Disabled: Story = {
  args: { disabled: true, onClick: fn(), onDelete: fn() },
  play: async ({ canvasElement, args }) => {
    const buttons = within(canvasElement).getAllByRole('button');
    for (const b of buttons) await expect(b).toBeDisabled();
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};
