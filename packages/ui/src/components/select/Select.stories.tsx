import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { figmaDesign } from '../../lib/figma';
import { Select } from './Select';

const ROLES = [
  { value: 'admin', label: 'Admin' },
  { value: 'editor', label: 'Redakteur:in' },
  { value: 'reader', label: 'Leser:in' },
  { value: 'guest', label: 'Gast (nur mit Einladung)', disabled: true },
];

const meta = {
  title: 'Components/Select',
  component: Select,
  args: { label: 'Rolle', placeholder: 'Rolle wählen', options: ROLES, onValueChange: fn() },
  argTypes: { options: { control: false } },
  parameters: {
    design: figmaDesign('1194:18744'),
    docs: {
      description: {
        component:
          'Figma: `03 Components / Form – Select` mit Select Menu und Select Option. Für eine Auswahl aus mehreren Optionen (bei 2–5 sichtbaren Optionen lieber `RadioGroup`). Tastatur: Pfeiltasten, Enter, Tippen springt zum Eintrag, Escape schließt.',
      },
    },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ canvasElement, args }) => {
    const c = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const trigger = c.getByRole('combobox', { name: 'Rolle' });
    await expect(trigger).toHaveTextContent('Rolle wählen');
    await userEvent.click(trigger);
    await userEvent.click(await body.findByRole('option', { name: 'Redakteur:in' }));
    await expect(args.onValueChange).toHaveBeenLastCalledWith('editor');
    await waitFor(() => expect(trigger).toHaveTextContent('Redakteur:in'));
    // Tastatur
    trigger.focus();
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(body.getByRole('listbox')).toBeVisible());
    await userEvent.keyboard('{Escape}');
  },
};

export const States: Story = {
  // Error-Feld: bekannter Figma-Befund #22 (Fehlertext 4,48:1) — bis zum Fix nur Warnung.
  parameters: { layout: 'padded', a11y: { test: 'todo' } },
  render: (args) => (
    <div className="grid w-[640px] grid-cols-2 gap-6">
      <Select {...args} label="Default" />
      <Select {...args} label="Mit Wert" defaultValue="admin" />
      <Select {...args} label="Error" status="error" helperText="Bitte wähle eine Rolle." />
      <Select {...args} label="Success" status="success" defaultValue="editor" />
      <Select
        {...args}
        label="Warning"
        status="warning"
        helperText="Die Rolle hat viele Rechte."
        defaultValue="admin"
      />
      <Select {...args} label="Read-only" readOnly defaultValue="reader" />
      <Select {...args} label="Loading" loading />
      <Select {...args} label="Disabled" disabled />
    </div>
  ),
};

export const Open: Story = {
  parameters: { layout: 'padded' },
  args: { defaultValue: 'editor' },
  render: (args) => (
    <div className="h-64 w-80">
      <Select {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('combobox', { name: 'Rolle' }));
    await within(canvasElement.ownerDocument.body).findByRole('listbox');
  },
};

export const ReadOnly: Story = {
  args: { readOnly: true, defaultValue: 'reader' },
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('combobox');
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toHaveTextContent('Leser:in');
  },
};
