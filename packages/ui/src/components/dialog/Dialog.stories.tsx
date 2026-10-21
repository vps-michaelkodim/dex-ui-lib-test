import { EditIcon, SaveIcon } from '@dextinity/icons';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { figmaDesign } from '../../lib/figma';
import { Button } from '../button';
import { Input } from '../input';
import { Select } from '../select';
import { Dialog, DialogClose } from './Dialog';

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
  args: { title: 'Benutzer bearbeiten' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'xl'] },
    trigger: { control: false },
    actions: { control: false },
    secondaryActions: { control: false },
    icon: { control: false },
  },
  parameters: {
    design: figmaDesign('829:4250'),
    docs: {
      description: {
        component:
          'Figma: `03 Components / Dialog` (Dialog Container SM–XL, Dialog Header, Dialog Actions, Slot). Für kurze Aufgaben und Entscheidungen; Fokus bleibt im Dialog, Escape oder Klick daneben schließt. `actions` rechts, `secondaryActions` links (wie in Figma).',
      },
    },
  },
  render: (args) => (
    <Dialog
      {...args}
      trigger={<Button startIcon={<EditIcon />}>Bearbeiten</Button>}
      icon={<EditIcon />}
      secondaryActions={<DialogClose render={<Button variant="text">Abbrechen</Button>} />}
      actions={<Button startIcon={<SaveIcon />}>Speichern</Button>}
    >
      <div className="flex flex-col gap-4">
        <Input label="Name" defaultValue="Lena Berger" />
        <Select
          label="Rolle"
          defaultValue="editor"
          options={[
            { value: 'admin', label: 'Admin' },
            { value: 'editor', label: 'Redakteur:in' },
          ]}
        />
      </div>
    </Dialog>
  ),
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Bearbeiten' }));
    const dialog = await body.findByRole('dialog', { name: 'Benutzer bearbeiten' });
    await waitFor(() => expect(dialog).toBeVisible());
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('dialog')).toBeNull());
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Bearbeiten' }));
    await userEvent.click(await body.findByRole('button', { name: 'Abbrechen' }));
    await waitFor(() => expect(body.queryByRole('dialog')).toBeNull());
  },
};

/** Offen, für Screenshots und Review. */
export const Open: Story = { args: { defaultOpen: true } };

export const WithoutIcon: Story = {
  args: { defaultOpen: true, title: 'Änderungen verwerfen?', size: 'sm' },
  render: (args) => (
    <Dialog
      {...args}
      secondaryActions={<DialogClose render={<Button variant="text">Weiter bearbeiten</Button>} />}
      actions={<Button color="error">Verwerfen</Button>}
    >
      <p className="typo-body-md-normal text-foreground-muted">
        Deine ungespeicherten Änderungen gehen verloren.
      </p>
    </Dialog>
  ),
};
