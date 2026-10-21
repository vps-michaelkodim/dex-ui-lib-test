import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { figmaDesign } from '../../lib/figma';
import { Switch } from './Switch';

const meta = {
  title: 'Components/Switch',
  component: Switch,
  args: { children: 'E-Mail-Benachrichtigungen', onCheckedChange: fn() },
  parameters: {
    design: figmaDesign('1187:18556'),
    docs: {
      description: {
        component:
          'Figma: `03 Components / Form – Switch` (Figma-Property `On` = `checked`). Für Einstellungen, die sofort wirken. In Formularen mit „Speichern“-Button lieber `Checkbox`.',
      },
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ canvasElement, args }) => {
    const sw = within(canvasElement).getByRole('switch', { name: 'E-Mail-Benachrichtigungen' });
    await expect(sw).not.toBeChecked();
    await userEvent.click(within(canvasElement).getByText('E-Mail-Benachrichtigungen'));
    await expect(sw).toBeChecked();
    await expect(args.onCheckedChange).toHaveBeenCalledTimes(1);
    await userEvent.keyboard(' ');
    await expect(sw).not.toBeChecked();
  },
};

export const States: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="grid w-max grid-cols-[auto_repeat(2,max-content)] items-center gap-x-6 gap-y-2">
      <span />
      {['Aus', 'An'].map((h) => (
        <span key={h} className="typo-label-xs text-foreground-muted">
          {h}
        </span>
      ))}
      {[
        { name: 'Default', props: {} },
        { name: 'Read-only', props: { readOnly: true } },
        { name: 'Disabled', props: { disabled: true } },
      ].map((r) => (
        <div key={r.name} className="contents">
          <span className="typo-label-xs text-foreground-muted">{r.name}</span>
          <Switch {...r.props}>Label</Switch>
          <Switch {...r.props} defaultChecked>
            Label
          </Switch>
        </div>
      ))}
    </div>
  ),
};

export const WithHelperText: Story = {
  args: {
    children: 'Wöchentliche Zusammenfassung',
    helperText: 'Jeden Montag eine E-Mail mit allen Änderungen.',
    defaultChecked: true,
  },
};

export const ReadOnly: Story = {
  args: { readOnly: true, defaultChecked: true },
  play: async ({ canvasElement }) => {
    const sw = within(canvasElement).getByRole('switch');
    await userEvent.click(sw);
    await expect(sw).toBeChecked();
  },
};
