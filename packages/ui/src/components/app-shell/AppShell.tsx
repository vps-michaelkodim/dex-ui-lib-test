import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { useMemo, useState, type MouseEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { AppShellContext, useIsMobile } from './context';
import { Sidebar } from './Sidebar';

export interface AppShellProps {
  /** Figma: App Bar — `<AppBar … />`. Der Navigation-Toggle wird automatisch verdrahtet. */
  appBar: ReactNode;
  /** Inhalt der Sidebar / Main Navigation: `NavSection` / `NavItem`. */
  navigation: ReactNode;
  /** Figma: Sidebar Collapsed (kontrolliert, nur Desktop). */
  collapsed?: boolean;
  /** Anfangs eingeklappt (nur Desktop). @default false */
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Zugänglicher Name der Navigation. @default 'Hauptnavigation' */
  navigationLabel?: string;
  /** Zugänglicher Name des Schließen-Buttons im Mobile-Drawer. @default 'Navigation schließen' */
  closeLabel?: string;
  /** Seiteninhalt (Figma: Main › Toolbar + Content). */
  children: ReactNode;
  className?: string;
}

/**
 * App Shell — Figma: `04 Patterns / App Shell` (Templates Desktop, Sidebar eingeklappt, Mobile, Navigation offen).
 * Gerüst einer Dextinity-App: App Bar oben, Sidebar links, Inhalt rechts.
 * Desktop: Toggle klappt die Sidebar ein (nur Icons). Mobile (< 1024px): Sidebar als Drawer über dem Inhalt,
 * schließt mit Escape, Klick daneben, Schließen-Button oder Klick auf einen Link.
 *
 * ```tsx
 * <AppShell
 *   appBar={<AppBar appName="Content Hub" user={{ name: 'Maria Muster' }} />}
 *   navigation={
 *     <NavSection title="Main">
 *       <NavItem icon={<DashboardIcon />} label="Dashboard" href="/" active />
 *     </NavSection>
 *   }
 * >
 *   <Toolbar title="Dashboard" />
 *   <div className="p-layout-md">…</div>
 * </AppShell>
 * ```
 */
export function AppShell({
  appBar,
  navigation,
  collapsed: collapsedProp,
  defaultCollapsed = false,
  onCollapsedChange,
  navigationLabel,
  closeLabel = 'Navigation schließen',
  children,
  className,
}: AppShellProps) {
  const mobile = useIsMobile();
  const [collapsedState, setCollapsedState] = useState(defaultCollapsed);
  const collapsed = collapsedProp ?? collapsedState;
  const [drawerOpen, setDrawerOpen] = useState(false);

  const context = useMemo(
    () => ({
      mobile,
      navigationOpen: mobile ? drawerOpen : !collapsed,
      toggleNavigation: () => {
        if (mobile) {
          setDrawerOpen((open) => !open);
          return;
        }
        const next = !collapsed;
        setCollapsedState(next);
        onCollapsedChange?.(next);
      },
    }),
    [mobile, drawerOpen, collapsed, onCollapsedChange],
  );

  /** Mobile: Klick auf einen Link in der Navigation schließt den Drawer. */
  const closeOnLink = (event: MouseEvent) => {
    if ((event.target as HTMLElement).closest('a[href]')) setDrawerOpen(false);
  };

  return (
    <AppShellContext.Provider value={context}>
      <div
        className={cn(
          'flex h-dvh w-full flex-col bg-background font-sans text-foreground',
          className,
        )}
      >
        {appBar}
        <div className="flex min-h-0 flex-1">
          {mobile ? null : (
            <Sidebar collapsed={collapsed} navigationLabel={navigationLabel}>
              {navigation}
            </Sidebar>
          )}
          <main className="flex min-w-0 flex-1 flex-col overflow-y-auto bg-background-subtle">
            {children}
          </main>
        </div>
      </div>
      {mobile ? (
        <BaseDialog.Root open={drawerOpen} onOpenChange={(open) => setDrawerOpen(open)}>
          <BaseDialog.Portal>
            <BaseDialog.Backdrop className="fixed inset-0 z-50 bg-(--dx-dialog-overlay) transition-opacity duration-(--dx-primitive-motion-duration-md) data-ending-style:opacity-0 data-starting-style:opacity-0" />
            <BaseDialog.Popup
              aria-label={navigationLabel ?? 'Hauptnavigation'}
              className="fixed inset-y-0 left-0 z-50 flex shadow-lg transition-transform duration-(--dx-primitive-motion-duration-md) ease-standard outline-none data-ending-style:-translate-x-full data-starting-style:-translate-x-full"
              onClick={closeOnLink}
            >
              <Sidebar
                navigationLabel={navigationLabel}
                closeLabel={closeLabel}
                onClose={() => setDrawerOpen(false)}
                className="border-r-0"
              >
                {navigation}
              </Sidebar>
            </BaseDialog.Popup>
          </BaseDialog.Portal>
        </BaseDialog.Root>
      ) : null}
    </AppShellContext.Provider>
  );
}
