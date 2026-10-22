import { DownloadIcon, FilterIcon, MoreVerticalIcon } from '@dextinity/icons';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { figmaDesign } from '../../lib/figma';
import { Button } from '../button';
import { IconButton } from '../icon-button';
import { Toolbar } from './Toolbar';

const defaultActions = (
  <>
    <Button variant="outlined" startIcon={<FilterIcon />}>
      Filter
    </Button>
    <Button startIcon={<DownloadIcon />}>Exportieren</Button>
  </>
);

const meta = {
  title: 'Patterns/Toolbar',
  component: Toolbar,
  args: {
    title: 'Kampagnen',
    breadcrumb: [{ label: 'Marketing', href: '#marketing' }, { label: 'Alle Kampagnen' }],
    actions: defaultActions,
  },
  argTypes: {
    titleAs: { control: 'inline-radio', options: ['h1', 'h2', 'h3'] },
    actions: { control: false },
    breadcrumb: { control: 'object' },
  },
  parameters: {
    layout: 'fullscreen',
    design: figmaDesign('1462:20277'),
    docs: {
      description: {
        component:
          'Figma: `04 Patterns / Toolbar` (Device=Desktop | Mobile). Kopf einer Admin-Seite über dem Inhalt: Breadcrumb, Zurück-Button, Titel mit Info-Icon, Support Text und Aktionen rechts (Figma-Slot „Actions“). Mobile-Abstände und -Schriftgrößen kommen automatisch über die Responsive-Tokens; Aktionen auf Mobile in ein Overflow-Menü packen.',
      },
    },
  },
} satisfies Meta<typeof Toolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma: Device=Desktop, Standard. */
export const Playground: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'Kampagnen' })).toBeVisible();
    const nav = canvas.getByRole('navigation', { name: 'Breadcrumb' });
    await expect(within(nav).getByText('Alle Kampagnen')).toHaveAttribute('aria-current', 'page');
    await expect(within(nav).getByRole('link', { name: 'Marketing' })).toHaveAttribute(
      'href',
      '#marketing',
    );
  },
};

/** Detailseite mit allen Optionen: Zurück, Info-Icon, Support Text. */
export const DetailPage: Story = {
  args: {
    title: 'Frühjahrskampagne 2027',
    breadcrumb: [
      { label: 'Marketing', href: '#marketing' },
      { label: 'Kampagnen', href: '#kampagnen' },
      { label: 'Frühjahrskampagne 2027' },
    ],
    onBack: fn(),
    info: 'Kampagnen werden jede Nacht mit dem CRM synchronisiert.',
    supportText: 'Zuletzt bearbeitet am 12.10.2026 von Maria Muster',
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: 'Zurück' }));
    await expect(args.onBack).toHaveBeenCalledOnce();
    // Info-Tooltip per Tastatur erreichbar
    canvas.getByRole('button', { name: 'Mehr Informationen' }).focus();
    await waitFor(() => expect(body.getByText(/mit dem CRM synchronisiert/)).toBeVisible(), {
      timeout: 3000,
    });
    await userEvent.keyboard('{Escape}');
    await waitFor(() =>
      expect(body.queryByText(/mit dem CRM synchronisiert/)).not.toBeInTheDocument(),
    );
  },
};

/** Nur Titel — z.B. Einstellungsseiten. */
export const TitleOnly: Story = {
  args: { title: 'Einstellungen', breadcrumb: undefined, actions: undefined },
};

/** Figma: Device=Mobile — schmal, Aktionen im Overflow-Menü. */
export const Mobile: Story = {
  args: {
    title: 'Frühjahrskampagne 2027',
    breadcrumb: undefined,
    onBack: fn(),
    supportText: 'Zuletzt bearbeitet am 12.10.2026',
    actions: (
      <IconButton aria-label="Weitere Aktionen" variant="text" color="secondary">
        <MoreVerticalIcon />
      </IconButton>
    ),
  },
  decorators: [
    (Story) => (
      <div className="w-[390px]">
        <Story />
      </div>
    ),
  ],
};

/** Alle Fälle untereinander — für Screenshots und Review. */
export const Matrix: Story = {
  render: () => (
    <div className="flex flex-col gap-8 bg-background-subtle p-6">
      <Toolbar
        title="Kampagnen"
        titleAs="h2"
        breadcrumb={[{ label: 'Marketing', href: '#' }, { label: 'Alle Kampagnen' }]}
        breadcrumbLabel="Breadcrumb Standard"
        actions={defaultActions}
      />
      <Toolbar
        title="Frühjahrskampagne 2027"
        titleAs="h2"
        breadcrumb={[{ label: 'Kampagnen', href: '#' }, { label: 'Frühjahrskampagne 2027' }]}
        breadcrumbLabel="Breadcrumb Detailseite"
        onBack={() => {}}
        info="Wird nachts synchronisiert."
        supportText="Zuletzt bearbeitet am 12.10.2026 von Maria Muster"
        actions={defaultActions}
      />
      <Toolbar title="Einstellungen" titleAs="h2" />
    </div>
  ),
};
