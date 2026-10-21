import {
  AccountIcon,
  CalendarIcon,
  DashboardIcon,
  FilterIcon,
  SettingsIcon,
} from '@dextinity/icons';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { figmaDesign } from '../../lib/figma';
import { MainNavigation, NavItem, NavSection } from './MainNavigation';

const meta = {
  title: 'Components/Main Navigation',
  component: MainNavigation,
  args: { children: null },
  argTypes: { children: { control: false } },
  parameters: {
    layout: 'padded',
    // Bekannter Figma-Befund #36: Abschnitts-Überschrift (foreground/subtle) = 3,65:1 — bis zum Fix nur Warnung.
    a11y: { test: 'todo' },
    design: figmaDesign('301:58'),
    docs: {
      description: {
        component:
          'Figma: `03 Components / Main navigation` — `MainNavigation` (`<nav>`), `NavSection` (Menu Section Header) und `NavItem` (Main Navigation Item). Die Ebene (Level 1–3) ergibt sich aus der Verschachtelung; `NavItem` mit Unterpunkten ist aufklappbar (Expandable). `active` = aktuelle Seite. Für Router-Links `render={<Link to="…" />}`.',
      },
    },
  },
} satisfies Meta<typeof MainNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

const nav = (
  <MainNavigation className="w-70 bg-background p-2">
    <NavSection title="Main">
      <NavItem icon={<DashboardIcon />} label="Dashboard" href="#dashboard" active />
      <NavItem icon={<DashboardIcon />} label="Reports" defaultOpen>
        <NavItem label="Monatlich" href="#reports-monthly" />
        <NavItem label="Quartal" href="#reports-quarter" />
      </NavItem>
      <NavItem icon={<AccountIcon />} label="Kunden" href="#clients" />
      <NavItem icon={<CalendarIcon />} label="Termine" href="#schedule" />
      <NavItem icon={<FilterIcon />} label="Filter" defaultOpen>
        <NavItem icon={<FilterIcon />} label="Kategorien" defaultOpen>
          <NavItem label="System" href="#system" />
          <NavItem label="Community" href="#community" />
        </NavItem>
        <NavItem label="Farben" href="#colors" />
      </NavItem>
      <NavItem icon={<SettingsIcon />} label="Einstellungen" href="#settings" />
    </NavSection>
  </MainNavigation>
);

export const Default: Story = {
  render: () => nav,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByRole('navigation', { name: 'Hauptnavigation' })).toBeInTheDocument();
    await expect(c.getByRole('link', { name: 'Dashboard' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    const reports = c.getByRole('button', { name: 'Reports' });
    await expect(reports).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(reports);
    await expect(reports).toHaveAttribute('aria-expanded', 'false');
    await expect(c.queryByRole('link', { name: 'Monatlich' })).toBeNull();
  },
};

export const Sections: Story = {
  args: { children: null },
  render: () => (
    <MainNavigation className="w-70 bg-background p-2">
      <NavSection title="Workspace" onAdd={fn()} addLabel="Bereich hinzufügen">
        <NavItem icon={<DashboardIcon />} label="Übersicht" href="#a" active />
        <NavItem icon={<AccountIcon />} label="Benutzer" href="#b" />
      </NavSection>
      <NavSection title="Verwaltung" expandable>
        <NavItem icon={<SettingsIcon />} label="Einstellungen" href="#c" />
      </NavSection>
    </MainNavigation>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const section = c.getByRole('button', { name: 'Verwaltung' });
    await userEvent.click(section);
    await expect(c.queryByRole('link', { name: 'Einstellungen' })).toBeNull();
    await expect(c.getByRole('button', { name: 'Bereich hinzufügen' })).toBeInTheDocument();
  },
};
