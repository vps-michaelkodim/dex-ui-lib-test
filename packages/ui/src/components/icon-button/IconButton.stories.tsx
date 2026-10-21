import { CloseIcon, EditIcon, MoreVerticalIcon, SettingsIcon } from '@dextinity/icons';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { IconButton } from './IconButton';

const VARIANTS = ['contained', 'outlined', 'text'] as const;
const COLORS = ['primary', 'secondary', 'error', 'success'] as const;

const meta = {
  title: 'Components/IconButton',
  component: IconButton,
  args: {
    'aria-label': 'Bearbeiten',
    children: <EditIcon />,
    onClick: fn(),
  },
  argTypes: {
    variant: { control: 'inline-radio', options: VARIANTS },
    color: { control: 'inline-radio', options: COLORS },
    size: { control: 'inline-radio', options: ['default', 'small'] },
    children: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Figma: `03 Components / Icon Button`. Gleiche Farb-Tokens wie Button. `aria-label` ist Pflicht (kein sichtbares Label).',
      },
    },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Bearbeiten' }));
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

export const Matrix: Story = {
  parameters: { layout: 'padded' },
  render: (args) => (
    <div className="grid w-max grid-cols-[auto_repeat(3,max-content)] items-center gap-4">
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
            <IconButton key={v} {...args} variant={v} color={c} />
          ))}
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <IconButton {...args} aria-label="Einstellungen" size="default">
        <SettingsIcon />
      </IconButton>
      <IconButton {...args} aria-label="Einstellungen (klein)" size="small">
        <SettingsIcon />
      </IconButton>
    </div>
  ),
};

/** Typischer Einsatz: Toolbar-/Tabellen-Aktionen als Text-Variante in Secondary. */
export const Toolbar: Story = {
  render: () => (
    <div className="flex items-center gap-1">
      <IconButton aria-label="Bearbeiten" variant="text" color="secondary">
        <EditIcon />
      </IconButton>
      <IconButton aria-label="Weitere Aktionen" variant="text" color="secondary">
        <MoreVerticalIcon />
      </IconButton>
      <IconButton aria-label="Schließen" variant="text" color="secondary">
        <CloseIcon />
      </IconButton>
    </div>
  ),
};

export const States: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <IconButton {...args} disabled aria-label="Deaktiviert" />
      <IconButton {...args} loading aria-label="Lädt" />
    </div>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Deaktiviert' })).toBeDisabled();
    const loading = canvas.getByRole('button', { name: 'Lädt' });
    await expect(loading).toHaveAttribute('aria-busy', 'true');
    await userEvent.click(loading);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};
