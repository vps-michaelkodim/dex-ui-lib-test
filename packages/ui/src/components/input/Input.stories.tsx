import { InvisibleIcon, SearchIcon, VisibleIcon } from '@dextinity/icons';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { IconButton } from '../icon-button';
import { Input } from './Input';

const meta = {
  title: 'Components/Input',
  component: Input,
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    helperText: 'Additional info text',
    onChange: fn(),
  },
  argTypes: {
    status: { control: 'inline-radio', options: [undefined, 'error', 'success', 'warning'] },
    startAdornment: { control: 'text' },
    endAdornment: { control: 'text' },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Figma: `03 Components / Form – Input` mit `Form Label` und `Form Helper Text`. Validierung (`_State` Error/Success/Warning) ist im Code der Prop `status`, Read-only ist `readOnly`. Label/Helper sind über Base UI `Field` per `for`/`aria-describedby` verknüpft.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Label');
    // Label ist verknüpft: Klick aufs Label fokussiert das Feld
    await userEvent.click(canvas.getByText('Label'));
    await expect(input).toHaveFocus();
    await userEvent.type(input, 'Hallo');
    await expect(input).toHaveValue('Hallo');
    await expect(args.onChange).toHaveBeenCalled();
    // Helper-Text ist per aria-describedby verknüpft
    await expect(input).toHaveAccessibleDescription('Additional info text');
  },
};

/** Alle Zustände wie im Figma-Component-Set. */
export const States: Story = {
  // Bekannter Figma-Befund: Fehlertext/-label (feedback/danger/default) = 4,48:1 < 4,5:1.
  // Siehe docs/figma-gap-report.md #22 — bis zum Fix in Figma nur Warnung.
  parameters: { a11y: { test: 'todo' } },
  render: (args) => (
    <div className="flex flex-col gap-6">
      <Input {...args} label="Default" />
      <Input
        {...args}
        label="Error"
        status="error"
        helperText="Bitte gib einen gültigen Wert ein."
      />
      <Input {...args} label="Success" status="success" defaultValue="max@dextinity.com" />
      <Input
        {...args}
        label="Warning"
        status="warning"
        helperText="Diese Adresse ist bereits vergeben."
      />
      <Input {...args} label="Loading" loading />
      <Input {...args} label="Disabled" disabled />
      <Input {...args} label="Read-only" readOnly defaultValue="Nur lesen" />
    </div>
  ),
};

export const Required: Story = {
  args: { label: 'E-Mail', type: 'email', required: true, helperText: undefined },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', { name: /E-Mail/ });
    await expect(input).toBeRequired();
  },
};

export const WithError: Story = {
  name: 'Error',
  // Bekannter Figma-Befund: Fehlertext/-label (feedback/danger/default) = 4,48:1 < 4,5:1.
  // Siehe docs/figma-gap-report.md #22 — bis zum Fix in Figma nur Warnung.
  parameters: { a11y: { test: 'todo' } },
  args: { label: 'Name', status: 'error', helperText: 'Bitte ausfüllen.' },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', { name: 'Name' });
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAccessibleDescription('Bitte ausfüllen.');
  },
};

export const Adornments: Story = {
  render: (args) => (
    <div className="flex flex-col gap-6">
      <Input
        {...args}
        label="Betrag"
        startAdornment="€"
        endAdornment="netto"
        helperText={undefined}
      />
      <Input
        {...args}
        label={undefined}
        aria-label="Suchen"
        placeholder="Suchen …"
        startAdornment={<SearchIcon />}
        helperText={undefined}
      />
    </div>
  ),
};

function PasswordInput() {
  const [visible, setVisible] = useState(false);
  return (
    <Input
      label="Passwort"
      type={visible ? 'text' : 'password'}
      endAdornment={
        <IconButton
          aria-label={visible ? 'Passwort verbergen' : 'Passwort anzeigen'}
          variant="text"
          color="secondary"
          size="small"
          onClick={() => setVisible((v) => !v)}
        >
          {visible ? <InvisibleIcon /> : <VisibleIcon />}
        </IconButton>
      }
    />
  );
}

/** Beispiel: IconButton als End-Adornment. */
export const Password: Story = {
  render: () => <PasswordInput />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Passwort');
    await expect(input).toHaveAttribute('type', 'password');
    await userEvent.click(canvas.getByRole('button', { name: 'Passwort anzeigen' }));
    await expect(input).toHaveAttribute('type', 'text');
  },
};

export const Counter: Story = {
  args: { label: 'Titel', maxLength: 40, showCount: true, helperText: 'Kurz und prägnant.' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('0 / 40')).toBeInTheDocument();
    await userEvent.type(canvas.getByLabelText('Titel'), 'Dextinity');
    await expect(canvas.getByText('9 / 40')).toBeInTheDocument();
  },
};

export const DisabledAndReadOnly: Story = {
  name: 'Disabled & read-only',
  render: (args) => (
    <div className="flex flex-col gap-6">
      <Input {...args} label="Disabled" disabled defaultValue="Gesperrt" helperText={undefined} />
      <Input {...args} label="Read-only" readOnly defaultValue="Nur lesen" helperText={undefined} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText('Disabled')).toBeDisabled();
    const ro = canvas.getByLabelText('Read-only');
    await userEvent.click(ro);
    await expect(ro).toHaveFocus();
    await userEvent.type(ro, 'x');
    await expect(ro).toHaveValue('Nur lesen');
  },
};
