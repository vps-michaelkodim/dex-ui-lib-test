import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { figmaDesign } from '../../lib/figma';
import { Checkbox, CheckboxGroup } from './Checkbox';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  args: { children: 'Newsletter abonnieren', onCheckedChange: fn() },
  parameters: {
    design: figmaDesign('1185:18566'),
    docs: {
      description: {
        component:
          'Figma: `03 Components / Form – Checkbox`. Einzeln oder in einer `CheckboxGroup` (Überschrift, Hinweis, Fehler für alle). `indeterminate` für „teilweise ausgewählt“. Hover und Fokus sind Zustände, keine Props.',
      },
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ canvasElement, args }) => {
    const box = within(canvasElement).getByRole('checkbox', { name: 'Newsletter abonnieren' });
    await expect(box).not.toBeChecked();
    await userEvent.click(within(canvasElement).getByText('Newsletter abonnieren'));
    await expect(box).toBeChecked();
    await expect(args.onCheckedChange).toHaveBeenCalledTimes(1);
    await userEvent.keyboard(' ');
    await expect(box).not.toBeChecked();
  },
};

const ROWS = [
  { name: 'Default', props: {} },
  { name: 'Error', props: { status: 'error' as const } },
  { name: 'Read-only', props: { readOnly: true } },
  { name: 'Disabled', props: { disabled: true } },
];

export const States: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="grid w-max grid-cols-[auto_repeat(3,max-content)] items-center gap-x-6 gap-y-2">
      <span />
      {['Aus', 'An', 'Teilweise'].map((h) => (
        <span key={h} className="typo-label-xs text-foreground-muted">
          {h}
        </span>
      ))}
      {ROWS.map((r) => (
        <div key={r.name} className="contents">
          <span className="typo-label-xs text-foreground-muted">{r.name}</span>
          <Checkbox {...r.props}>Label</Checkbox>
          <Checkbox {...r.props} defaultChecked>
            Label
          </Checkbox>
          <Checkbox {...r.props} indeterminate>
            Label
          </Checkbox>
        </div>
      ))}
    </div>
  ),
};

export const WithError: Story = {
  // Bekannter Figma-Befund: Fehlertext/-label (feedback/danger/default) = 4,48:1 < 4,5:1.
  // Siehe docs/figma-gap-report.md #22 — bis zum Fix in Figma nur Warnung.
  parameters: { a11y: { test: 'todo' } },
  name: 'Error',
  args: {
    children: 'Ich akzeptiere die Nutzungsbedingungen',
    status: 'error',
    required: true,
    helperText: 'Bitte bestätige die Nutzungsbedingungen.',
  },
};

export const ReadOnly: Story = {
  args: { readOnly: true, defaultChecked: true },
  play: async ({ canvasElement }) => {
    const box = within(canvasElement).getByRole('checkbox');
    await userEvent.click(box);
    await expect(box).toBeChecked();
  },
};

const CHANNELS = [
  { value: 'mail', label: 'E-Mail' },
  { value: 'push', label: 'Push-Nachricht' },
  { value: 'sms', label: 'SMS' },
];

export const Group: Story = {
  render: () => (
    <CheckboxGroup
      label="Benachrichtigungen"
      helperText="Wir melden uns nur bei wichtigen Änderungen."
      defaultValue={['mail']}
    >
      {CHANNELS.map((c) => (
        <Checkbox key={c.value} value={c.value}>
          {c.label}
        </Checkbox>
      ))}
    </CheckboxGroup>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByRole('group', { name: 'Benachrichtigungen' })).toBeInTheDocument();
    await expect(c.getByRole('checkbox', { name: 'E-Mail' })).toBeChecked();
    await userEvent.click(c.getByText('SMS'));
    await expect(c.getByRole('checkbox', { name: 'SMS' })).toBeChecked();
  },
};

export const GroupWithError: Story = {
  // Bekannter Figma-Befund: Fehlertext/-label (feedback/danger/default) = 4,48:1 < 4,5:1.
  // Siehe docs/figma-gap-report.md #22 — bis zum Fix in Figma nur Warnung.
  parameters: { a11y: { test: 'todo' } },
  name: 'Group Error',
  render: () => (
    <CheckboxGroup
      label="Kanäle"
      required
      status="error"
      helperText="Wähle mindestens einen Kanal."
      orientation="horizontal"
    >
      {CHANNELS.map((c) => (
        <Checkbox key={c.value} value={c.value}>
          {c.label}
        </Checkbox>
      ))}
    </CheckboxGroup>
  ),
};

function SelectAll() {
  const all = CHANNELS.map((c) => c.value);
  const [value, setValue] = useState<string[]>(['push']);
  return (
    <CheckboxGroup label="Kanäle" value={value} onValueChange={setValue} allValues={all}>
      <Checkbox parent indeterminate={value.length > 0 && value.length < all.length}>
        Alle auswählen
      </Checkbox>
      <div className="flex flex-col pl-6">
        {CHANNELS.map((c) => (
          <Checkbox key={c.value} value={c.value}>
            {c.label}
          </Checkbox>
        ))}
      </div>
    </CheckboxGroup>
  );
}

export const SelectAllParent: Story = {
  name: 'Alle auswählen',
  render: () => <SelectAll />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const parent = c.getByRole('checkbox', { name: 'Alle auswählen' });
    await expect(parent).toHaveAttribute('aria-checked', 'mixed');
    await userEvent.click(parent);
    for (const ch of CHANNELS)
      await expect(c.getByRole('checkbox', { name: ch.label })).toBeChecked();
  },
};
