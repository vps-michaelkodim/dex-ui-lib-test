import { EditIcon, InfoIcon } from '@dextinity/icons';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Button } from '../button';
import { IconButton } from '../icon-button';
import { Tooltip } from './Tooltip';
import { figmaDesign } from '../../lib/figma';

const COLORS = ['light', 'dark', 'success', 'error', 'warning'] as const;

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  args: {
    content: 'Notification text',
    children: <Button variant="outlined">Hover oder Fokus</Button>,
  },
  argTypes: {
    color: { control: 'inline-radio', options: COLORS },
    side: { control: 'inline-radio', options: ['top', 'bottom', 'left', 'right'] },
    align: { control: 'inline-radio', options: ['start', 'center', 'end'] },
    children: { control: false },
  },
  parameters: {
    design: figmaDesign('849:2583'),
    layout: 'centered',
    docs: {
      description: {
        component:
          'Figma: `03 Components / Tooltip`. Position „Top — Left“ entspricht `side="top" align="start"`, „Middle“ = `center`. Öffnet bei Hover und Tastaturfokus, Escape schließt.',
      },
    },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { delay: 0 },
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'Hover oder Fokus' });
    const body = within(canvasElement.ownerDocument.body);
    // Tastatur: Fokus öffnet, Escape schließt
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await waitFor(() => expect(body.getByText('Notification text')).toBeVisible());
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByText('Notification text')).not.toBeInTheDocument());
  },
};

/** Typischer Einsatz: Label für einen IconButton. */
export const OnIconButton: Story = {
  name: 'On IconButton',
  args: {
    content: 'Bearbeiten',
    color: 'dark',
    children: (
      <IconButton aria-label="Bearbeiten" variant="text" color="secondary">
        <EditIcon />
      </IconButton>
    ),
  },
};

export const WithTitle: Story = {
  name: 'With title',
  args: {
    title: 'Synchronisierung',
    content: 'Inhalte werden jede Nacht um 2:00 Uhr abgeglichen.',
    color: 'light',
    side: 'right',
    defaultOpen: true,
    children: (
      <button
        type="button"
        aria-label="Info zur Synchronisierung"
        className="inline-flex rounded-full text-foreground-muted"
      >
        <InfoIcon />
      </button>
    ),
  },
};

/** Alle Farben aus Figma (geöffnet). */
export const Colors: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="grid grid-cols-5 gap-x-16 px-8 pt-24 pb-4">
      {COLORS.map((c) => (
        <Tooltip key={c} color={c} title="Title" content="Notification text" open side="top">
          <Button variant="text" color="secondary">
            {c}
          </Button>
        </Tooltip>
      ))}
    </div>
  ),
};

/** Alle 12 Positionen aus Figma (geöffnet). */
export const Positions: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="grid grid-cols-3 gap-x-40 gap-y-28 p-28">
      {(['top', 'bottom', 'left', 'right'] as const).flatMap((side) =>
        (['start', 'center', 'end'] as const).map((align) => (
          <Tooltip
            key={`${side}-${align}`}
            side={side}
            align={align}
            content={`${side} · ${align}`}
            open
          >
            <Button variant="outlined" color="secondary" size="small">
              {side} · {align}
            </Button>
          </Tooltip>
        )),
      )}
    </div>
  ),
};
