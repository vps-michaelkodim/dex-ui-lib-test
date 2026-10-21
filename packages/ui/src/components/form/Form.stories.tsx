import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { figmaDesign } from '../../lib/figma';
import { Button } from '../button';
import { Input } from '../input';
import { Radio, RadioGroup } from '../radio';
import { Search } from '../search';
import { Select } from '../select';
import { Switch } from '../switch';
import { Form, FormDivider, FormField } from './Form';

const ROLES = [
  { value: 'admin', label: 'Admin' },
  { value: 'editor', label: 'Redakteur:in' },
  { value: 'reader', label: 'Leser:in' },
];

const meta = {
  title: 'Components/Form',
  component: Form,
  args: { layout: 'stacked', children: null },
  argTypes: {
    layout: { control: 'inline-radio', options: ['stacked', 'inline'] },
    children: { control: false },
  },
  parameters: {
    layout: 'padded',
    design: figmaDesign('1157:25413'),
    docs: {
      description: {
        component:
          'Figma: `Form Layout 1 Col` (`layout="stacked"`) und `Form Layout 2 Cols` (`layout="inline"`, Label links, 200px; unter 768px automatisch gestapelt) sowie `Form divider`. `<Form layout>` gibt das Layout an alle Felder weiter; `FormField` umrahmt Inhalte ohne eigenes Label.',
      },
    },
  },
  render: (args) => (
    <Form {...args} className="max-w-2xl" onSubmit={(e) => e.preventDefault()}>
      <Input label="Name" required defaultValue="Lena Berger" />
      <Input
        label="E-Mail"
        type="email"
        helperText="Wir schicken eine Einladung an diese Adresse."
      />
      <Select label="Rolle" options={ROLES} defaultValue="editor" />
      <FormDivider />
      <FormField label="Benachrichtigungen" helperText="Gilt nur für diesen Workspace.">
        <Switch defaultChecked>Neue Kommentare</Switch>
        <Switch>Wöchentliche Zusammenfassung</Switch>
      </FormField>
      <FormField label="Sprache">
        <RadioGroup aria-label="Sprache" defaultValue="de" orientation="horizontal">
          <Radio value="de">Deutsch</Radio>
          <Radio value="en">Englisch</Radio>
        </RadioGroup>
      </FormField>
      <FormDivider />
      <div className="flex justify-end gap-2">
        <Button variant="outlined" color="secondary" type="reset">
          Verwerfen
        </Button>
        <Button type="submit">Speichern</Button>
      </div>
    </Form>
  ),
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma: Form Layout 1 Col. */
export const Stacked: Story = {
  parameters: { design: figmaDesign('1175:26023') },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByRole('textbox', { name: /Name/ })).toHaveValue('Lena Berger');
    await expect(c.getByRole('combobox', { name: 'Rolle' })).toHaveTextContent('Redakteur:in');
    await expect(c.getByRole('switch', { name: 'Neue Kommentare' })).toBeChecked();
  },
};

/** Figma: Form Layout 2 Cols. */
export const Inline: Story = { args: { layout: 'inline' } };

export const FieldError: Story = {
  // Bekannter Figma-Befund #22 (Fehlertext 4,48:1) — bis zum Fix nur Warnung.
  parameters: { a11y: { test: 'todo' } },
  render: () => (
    <Form layout="inline" className="max-w-2xl">
      <Input
        label="E-Mail"
        status="error"
        helperText="Das sieht nicht nach einer E-Mail aus."
        defaultValue="lena@"
      />
      <Select label="Rolle" options={ROLES} status="error" helperText="Bitte wähle eine Rolle." />
      <FormField label="Kanäle" required status="error" helperText="Wähle mindestens einen Kanal.">
        <Switch>E-Mail</Switch>
      </FormField>
    </Form>
  ),
};

export const WithSearch: Story = {
  render: () => (
    <Form layout="inline" className="max-w-2xl">
      <Search label="Benutzer" placeholder="Name oder E-Mail" />
    </Form>
  ),
};
