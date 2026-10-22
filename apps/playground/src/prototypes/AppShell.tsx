import {
  AccountIcon,
  CalendarIcon,
  DashboardIcon,
  DownloadIcon,
  FilterIcon,
  SettingsIcon,
} from '@dextinity/icons';
import {
  AppBar,
  Button,
  NavItem,
  NavSection,
  Search,
  AppShell as Shell,
  Text,
  Toolbar,
} from '@dextinity/ui';
import { useState } from 'react';

/**
 * Prototyp: App-Shell (Roadmap Phase 17) — `AppShell` mit `AppBar`, Sidebar (Main Navigation) und `Toolbar`.
 * Vorlage für neue Prototypen mit App-Gerüst. Nur @dextinity/ui + Token-Klassen.
 */
export const title = 'App-Shell';

const PAGES = [
  { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { id: 'clients', label: 'Kunden', icon: <AccountIcon /> },
  { id: 'schedule', label: 'Termine', icon: <CalendarIcon /> },
] as const;

export function AppShell() {
  const [page, setPage] = useState<string>('dashboard');
  const go = (id: string) => (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setPage(id);
  };
  const current =
    [
      ...PAGES,
      { id: 'monthly', label: 'Monatsberichte' },
      { id: 'settings', label: 'Einstellungen' },
    ].find((p) => p.id === page)?.label ?? '';

  return (
    <Shell
      appBar={
        <AppBar
          appName="Dextinity"
          search={<Search placeholder="Im Workspace suchen" wrapperClassName="w-60" />}
          onSearchClick={() => {}}
          scope={{ label: 'Vivid Planet' }}
          user={{ name: 'Maria Muster' }}
        />
      }
      navigation={
        <>
          <NavSection title="Main">
            {PAGES.map((p) => (
              <NavItem
                key={p.id}
                icon={p.icon}
                label={p.label}
                href={`#${p.id}`}
                active={page === p.id}
                onClick={go(p.id)}
              />
            ))}
            <NavItem icon={<FilterIcon />} label="Berichte" defaultOpen>
              <NavItem
                label="Monatsberichte"
                href="#monthly"
                active={page === 'monthly'}
                onClick={go('monthly')}
              />
            </NavItem>
          </NavSection>
          <NavSection title="Verwaltung" expandable>
            <NavItem
              icon={<SettingsIcon />}
              label="Einstellungen"
              href="#settings"
              active={page === 'settings'}
              onClick={go('settings')}
            />
          </NavSection>
        </>
      }
    >
      <Toolbar
        title={current}
        breadcrumb={[{ label: 'Workspace', href: '#dashboard' }, { label: current }]}
        supportText="Hier steht eine kurze Beschreibung der Seite."
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
        <Text color="muted">Hier steht der Inhalt der Seite.</Text>
      </div>
    </Shell>
  );
}
