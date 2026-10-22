import {
  AccountIcon,
  CalendarIcon,
  DashboardIcon,
  DownloadIcon,
  FilterIcon,
  NotificationBellIcon,
  SettingsIcon,
} from '@dextinity/icons';
import {
  Button,
  IconButton,
  MainNavigation,
  NavItem,
  NavSection,
  Search,
  Text,
  Toolbar,
} from '@dextinity/ui';
import { useState } from 'react';

/**
 * Prototyp: App-Shell (Roadmap Phase 13) — Main Navigation links, Kopfzeile mit Suche, Inhalt rechts.
 * Nur @dextinity/ui + Token-Klassen.
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
    <div className="flex min-h-screen bg-background-subtle">
      <aside className="w-70 shrink-0 border-r border-border bg-background p-2">
        <div className="px-3 py-4">
          <Text variant="heading" size="h4" weight="bold" as="span">
            Dextinity
          </Text>
        </div>
        <MainNavigation>
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
        </MainNavigation>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-4 border-b border-border bg-background px-8 py-3">
          <Search placeholder="Im Workspace suchen" wrapperClassName="max-w-md" />
          <div className="ml-auto flex items-center gap-2">
            <IconButton aria-label="Benachrichtigungen" variant="text" color="secondary">
              <NotificationBellIcon />
            </IconButton>
            <Button variant="outlined" color="secondary" size="small">
              Hilfe
            </Button>
          </div>
        </header>
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
        <main className="p-layout-md">
          <Text color="muted">Hier steht der Inhalt der Seite.</Text>
        </main>
      </div>
    </div>
  );
}
