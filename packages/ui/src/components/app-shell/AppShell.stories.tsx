import {
  AccountIcon,
  CalendarIcon,
  DashboardIcon,
  DownloadIcon,
  FilterIcon,
  SettingsIcon,
} from '@dextinity/icons';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { figmaDesign } from '../../lib/figma';
import { Button } from '../button';
import { NavItem, NavSection } from '../main-navigation';
import { Search } from '../search';
import { Text } from '../text';
import { Toolbar } from '../toolbar';
import { AppBar } from './AppBar';
import { AppShell } from './AppShell';
import { Sidebar } from './Sidebar';

const navigation = (
  <>
    <NavSection title="Main">
      <NavItem icon={<DashboardIcon />} label="Dashboard" href="#dashboard" active />
      <NavItem icon={<FilterIcon />} label="Berichte" defaultOpen>
        <NavItem label="Monatlich" href="#monthly" />
        <NavItem label="Quartal" href="#quarter" />
      </NavItem>
      <NavItem icon={<AccountIcon />} label="Kunden" href="#clients" />
      <NavItem icon={<CalendarIcon />} label="Termine" href="#schedule" />
    </NavSection>
    <NavSection title="System">
      <NavItem icon={<SettingsIcon />} label="Einstellungen" href="#settings" />
    </NavSection>
  </>
);

const appBar = (
  <AppBar
    appName="Application Title"
    search={<Search placeholder="Suchen …" wrapperClassName="w-60" />}
    onSearchClick={() => {}}
    scope={{ label: 'Scope title' }}
    user={{ name: 'Maria Muster' }}
  />
);

const content = (
  <>
    <Toolbar
      title="Dashboard"
      breadcrumb={[{ label: 'Kampagnen', href: '#' }, { label: 'Alle Kampagnen' }]}
      actions={
        <>
          <Button variant="outlined" startIcon={<FilterIcon />}>
            Filter
          </Button>
          <Button startIcon={<DownloadIcon />}>Exportieren</Button>
        </>
      }
    />
    <div className="p-layout-md">
      <Text color="muted">Seiteninhalt</Text>
    </div>
  </>
);

const meta = {
  title: 'Patterns/App Shell',
  component: AppShell,
  args: { appBar, navigation, children: content, className: 'h-[640px]' },
  argTypes: {
    appBar: { control: false },
    navigation: { control: false },
    children: { control: false },
  },
  parameters: {
    layout: 'fullscreen',
    // Main Navigation: bekannter Figma-Befund #36 (Section Header 3,65:1) — bis zum Fix nur Warnung.
    a11y: { test: 'todo' },
    design: figmaDesign('1450:266'),
    docs: {
      description: {
        component:
          'Figma: `04 Patterns / App Shell` — `AppShell` (Gerüst) mit `AppBar`, `Sidebar` (Main Navigation) und Inhalt, z.B. `Toolbar`. Desktop: Toggle klappt die Sidebar auf Icons ein (Name als Tooltip). Unter 1024px: Mobile-App-Bar und Sidebar als Drawer über dem Inhalt (Escape, Klick daneben, Schließen oder Link-Klick schließt).',
      },
    },
  },
} satisfies Meta<typeof AppShell>;

export default meta;
type Story = StoryObj<typeof meta>;

const isMobile = () => window.matchMedia('(max-width: 1023.98px)').matches;

/** Figma: Templates › Desktop (bzw. Mobile bei schmalem Viewport). */
export const Playground: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const toggle = canvas
      .getAllByRole('button', { name: 'Navigation umschalten' })
      .find((el) => el.checkVisibility());
    if (!toggle) throw new Error('Navigation-Toggle nicht sichtbar');

    if (isMobile()) {
      // Mobile: Drawer öffnen, per Link-Klick schließen, erneut öffnen, per Escape schließen
      await userEvent.click(toggle);
      const drawer = await body.findByRole('dialog', { name: 'Hauptnavigation' });
      await userEvent.click(within(drawer).getByRole('link', { name: 'Kunden' }));
      await waitFor(() => expect(body.queryByRole('dialog')).toBeNull());
      await userEvent.click(toggle);
      await body.findByRole('dialog');
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(body.queryByRole('dialog')).toBeNull());
      return;
    }

    // Desktop: einklappen → nur Icons mit zugänglichem Namen, wieder ausklappen
    const aside = canvasElement.querySelector('aside')!;
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(toggle);
    await expect(aside).toHaveAttribute('data-collapsed');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.getByRole('link', { name: 'Dashboard' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await expect(canvas.queryByText('Monatlich')).toBeNull();
    await userEvent.click(toggle);
    await expect(aside).not.toHaveAttribute('data-collapsed');
  },
};

/** Figma: Templates › Desktop – Sidebar eingeklappt. */
export const Collapsed: Story = { args: { defaultCollapsed: true } };

/** App Bar allein — Figma: App Bar (Device=Desktop). */
export const AppBarOnly: Story = {
  name: 'App Bar',
  render: () => (
    <AppBar
      appName="Application Title"
      search={<Search placeholder="Suchen …" wrapperClassName="w-60" />}
      scope={{ label: 'Scope title', onClick: fn() }}
      user={{ name: 'Maria Muster', onClick: fn() }}
      onNavigationToggle={fn()}
    />
  ),
};

/** Sidebar allein — Figma: Sidebar (Collapsed=No | Yes). */
export const SidebarStates: Story = {
  name: 'Sidebar',
  render: () => (
    <div className="flex h-[520px] gap-8 bg-background-subtle p-4">
      <Sidebar aria-label="Ausgeklappt" navigationLabel="Navigation ausgeklappt">
        {navigation}
      </Sidebar>
      <Sidebar aria-label="Eingeklappt" collapsed navigationLabel="Navigation eingeklappt">
        {navigation}
      </Sidebar>
      <Sidebar aria-label="Drawer" onClose={() => {}} navigationLabel="Navigation Drawer">
        {navigation}
      </Sidebar>
    </div>
  ),
};
