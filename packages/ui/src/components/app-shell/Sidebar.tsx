import { CloseIcon } from '@dextinity/icons';
import type { ComponentPropsWithoutRef, ReactNode, Ref } from 'react';
import { cn } from '../../lib/cn';
import { IconButton } from '../icon-button';
import { MainNavigation } from '../main-navigation';

export interface SidebarProps extends Omit<ComponentPropsWithoutRef<'aside'>, 'children'> {
  /** Figma: Collapsed — nur Icons (56px), Name als Tooltip. */
  collapsed?: boolean;
  /** Figma: Close Button (Drawer auf Mobile). Zeigt den Schließen-Button oben. */
  onClose?: () => void;
  /** Zugänglicher Name des Schließen-Buttons. @default 'Navigation schließen' */
  closeLabel?: string;
  /** Zugänglicher Name der Navigation. @default 'Hauptnavigation' */
  navigationLabel?: string;
  /** Inhalt der Main Navigation: `NavSection` / `NavItem`. */
  children: ReactNode;
  ref?: Ref<HTMLElement>;
}

/**
 * Sidebar — Figma: `04 Patterns / App Shell › Sidebar` (Collapsed=No | Yes, Close Button).
 * Hüllt die `MainNavigation` ein. In `AppShell` automatisch: Desktop links, Mobile als Drawer.
 *
 * ```tsx
 * <Sidebar collapsed={collapsed}>
 *   <NavSection title="Main">
 *     <NavItem icon={<DashboardIcon />} label="Dashboard" href="/" active />
 *   </NavSection>
 * </Sidebar>
 * ```
 */
export function Sidebar({
  collapsed = false,
  onClose,
  closeLabel = 'Navigation schließen',
  navigationLabel,
  children,
  className,
  ...props
}: SidebarProps) {
  return (
    <aside
      {...props}
      data-collapsed={collapsed ? '' : undefined}
      className={cn(
        // Figma: 280px / 56px breit, fest (kein Token, siehe Gap-Report AS2)
        'flex h-full shrink-0 flex-col gap-1 overflow-y-auto border-r border-solid border-border-subtle bg-background px-2 py-4 font-sans',
        'transition-[width] duration-(--dx-primitive-motion-duration-md) ease-standard',
        collapsed ? 'w-14' : 'w-70',
        className,
      )}
    >
      {onClose ? (
        <div className="flex justify-end">
          <IconButton aria-label={closeLabel} variant="text" color="secondary" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>
      ) : null}
      <MainNavigation aria-label={navigationLabel} collapsed={collapsed} className="gap-1">
        {children}
      </MainNavigation>
    </aside>
  );
}
