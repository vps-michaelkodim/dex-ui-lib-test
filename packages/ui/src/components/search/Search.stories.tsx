import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { figmaDesign } from '../../lib/figma';
import { Search } from './Search';

const meta = {
  title: 'Components/Search',
  component: Search,
  args: { placeholder: 'Benutzer suchen', onValueChange: fn() },
  parameters: {
    design: figmaDesign('1190:18720'),
    docs: {
      description: {
        component:
          'Figma: `03 Components / Form – Search`. Lupe, Leeren-Button (erscheint, sobald Text da ist), Loading. Escape leert das Feld. Ohne sichtbares Label ist der Platzhalter der zugängliche Name.',
      },
    },
  },
} satisfies Meta<typeof Search>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ canvasElement, args }) => {
    const c = within(canvasElement);
    const input = c.getByRole('searchbox', { name: 'Benutzer suchen' });
    await expect(c.queryByRole('button', { name: 'Suche leeren' })).toBeNull();
    await userEvent.type(input, 'Lena');
    await expect(args.onValueChange).toHaveBeenLastCalledWith('Lena');
    await userEvent.click(c.getByRole('button', { name: 'Suche leeren' }));
    await expect(input).toHaveValue('');
    await expect(input).toHaveFocus();
    await userEvent.type(input, 'Max{Escape}');
    await expect(input).toHaveValue('');
  },
};

export const States: Story = {
  parameters: { layout: 'padded' },
  render: (args) => (
    <div className="flex w-80 flex-col gap-4">
      <Search {...args} />
      <Search {...args} defaultValue="Lena" />
      <Search {...args} defaultValue="Lena" loading />
      <Search {...args} helperText="Name oder E-Mail-Adresse" />
      <Search {...args} disabled />
    </div>
  ),
};

export const WithLabel: Story = {
  args: { label: 'Suche', helperText: 'Durchsucht Titel und Inhalte.' },
};
