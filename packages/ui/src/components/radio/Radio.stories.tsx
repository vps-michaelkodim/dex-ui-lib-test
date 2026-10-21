import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { figmaDesign } from '../../lib/figma';
import { Radio, RadioGroup } from './Radio';

const OPTIONS = [
  { value: 'private', label: 'Nur ich' },
  { value: 'team', label: 'Mein Team' },
  { value: 'all', label: 'Alle im Workspace' },
];

const meta = {
  title: 'Components/Radio',
  component: RadioGroup,
  args: {
    label: 'Sichtbarkeit',
    defaultValue: 'team',
    onValueChange: fn(),
    children: OPTIONS.map((o) => (
      <Radio key={o.value} value={o.value}>
        {o.label}
      </Radio>
    )),
  },
  argTypes: { children: { control: false } },
  parameters: {
    design: figmaDesign('1186:18562'),
    docs: {
      description: {
        component:
          'Figma: `03 Components / Form – Radiobutton`. Immer als `RadioGroup` mit `Radio`-Optionen: eine Auswahl aus wenigen, sichtbaren Optionen. Pfeiltasten wechseln die Auswahl. Mehr als ~5 Optionen → Select.',
      },
    },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ canvasElement, args }) => {
    const c = within(canvasElement);
    await expect(c.getByRole('radiogroup', { name: 'Sichtbarkeit' })).toBeInTheDocument();
    await expect(c.getByRole('radio', { name: 'Mein Team' })).toBeChecked();
    await userEvent.click(c.getByText('Nur ich'));
    await expect(c.getByRole('radio', { name: 'Nur ich' })).toBeChecked();
    await expect(args.onValueChange).toHaveBeenLastCalledWith('private');
    await userEvent.keyboard('{ArrowDown}');
    await expect(c.getByRole('radio', { name: 'Mein Team' })).toBeChecked();
  },
};

export const Horizontal: Story = { args: { orientation: 'horizontal' } };

export const WithError: Story = {
  // Bekannter Figma-Befund: Fehlertext/-label (feedback/danger/default) = 4,48:1 < 4,5:1.
  // Siehe docs/figma-gap-report.md #22 — bis zum Fix in Figma nur Warnung.
  parameters: { a11y: { test: 'todo' } },
  name: 'Error',
  args: {
    defaultValue: undefined,
    required: true,
    status: 'error',
    helperText: 'Bitte wähle eine Option.',
  },
};

export const States: Story = {
  // Error-Gruppe: bekannter Figma-Befund #22 (Fehlertext 4,48:1) — bis zum Fix nur Warnung.
  parameters: { layout: 'padded', a11y: { test: 'todo' } },
  render: () => (
    <div className="flex flex-wrap gap-10">
      <RadioGroup label="Default" defaultValue="b">
        <Radio value="a">Aus</Radio>
        <Radio value="b">An</Radio>
      </RadioGroup>
      <RadioGroup label="Error" status="error" defaultValue="b">
        <Radio value="a">Aus</Radio>
        <Radio value="b">An</Radio>
      </RadioGroup>
      <RadioGroup label="Read-only" readOnly defaultValue="b">
        <Radio value="a">Aus</Radio>
        <Radio value="b">An</Radio>
      </RadioGroup>
      <RadioGroup label="Disabled" disabled defaultValue="b">
        <Radio value="a">Aus</Radio>
        <Radio value="b">An</Radio>
      </RadioGroup>
    </div>
  ),
};

export const DisabledOption: Story = {
  args: {
    children: [
      <Radio key="a" value="private">
        Nur ich
      </Radio>,
      <Radio key="b" value="team">
        Mein Team
      </Radio>,
      <Radio key="c" value="all" disabled>
        Alle (nur mit Admin-Rechten)
      </Radio>,
    ],
  },
};
