import {
  AccountIcon,
  ChevronDownIcon,
  DomainIcon,
  HamburgerIcon,
  SearchIcon,
  SidebarIcon,
} from '@dextinity/icons';
import type { ComponentPropsWithoutRef, ReactNode, Ref } from 'react';
import { cn } from '../../lib/cn';
import { IconButton } from '../icon-button';
import { useAppShell } from './context';

export interface AppBarScope {
  /** Figma: Scope — aktueller Bereich/Mandant. */
  label: ReactNode;
  /** Öffnet die Bereichsauswahl (Menü baut die App selbst). */
  onClick?: () => void;
}

export interface AppBarUser {
  /** Figma: User Name. Auf Mobile nur als Avatar (Name als zugänglicher Name). */
  name: string;
  /** Eigener Avatar (Bild). Standard: Personen-Icon. */
  avatar?: ReactNode;
  /** Öffnet das Benutzer-Menü (Menü baut die App selbst). */
  onClick?: () => void;
}

export interface AppBarProps extends ComponentPropsWithoutRef<'header'> {
  /** Figma: Branding › Application Logo. @default Platzhalter „Example Project“ wie in Figma */
  logo?: ReactNode;
  /** Figma: Branding › Application Title. Auf Mobile ausgeblendet. */
  appName?: ReactNode;
  /** Figma: Search (`Show Search`). Suchfeld ab Desktop, z.B. `<Search placeholder="Suchen …" />`. */
  search?: ReactNode;
  /** Mobile: Such-Button statt Suchfeld (Figma: Device=Mobile › Search Button). */
  onSearchClick?: () => void;
  /** Figma: Scope (`Show Scope`). Nur ab Desktop. */
  scope?: AppBarScope;
  /** Figma: User. */
  user?: AppBarUser;
  /**
   * Klick auf den Navigation-Toggle. In `AppShell` automatisch (Desktop: ein-/ausklappen, Mobile: Drawer).
   * Ohne beides wird kein Toggle gezeigt.
   */
  onNavigationToggle?: () => void;
  /** Zugänglicher Name des Navigation-Toggles. @default 'Navigation umschalten' */
  navigationToggleLabel?: string;
  /** Figma: App Bar ist dunkel. `'inherit'` übernimmt das Theme der Seite. @default 'dark' */
  theme?: 'dark' | 'inherit';
  ref?: Ref<HTMLElement>;
}

/** Abschnitt rechts mit Trennlinie (Figma: Search / Scope / User, `unit/4` Padding, `unit/2` Gap). */
const segment = 'flex h-full items-center gap-2 px-4 border-l border-solid border-border-subtle';

const trigger =
  'inline-flex cursor-pointer items-center gap-2 rounded-control typo-body-md-normal text-foreground-muted hover:text-foreground [&_svg]:size-4';

/** Platzhalter-Logo aus Figma (LogosHeader › Variante=Example). */
export function LogoPlaceholder({ className }: { className?: string }) {
  return (
    <span
      aria-label="Example Project"
      role="img"
      className={cn(
        'inline-flex h-10 w-30 items-center justify-between rounded-xs border border-solid border-foreground/30 px-2.5 text-foreground',
        className,
      )}
    >
      <span aria-hidden className="size-0.75 rounded-full bg-current" />
      <span
        aria-hidden
        className="flex flex-col items-center text-[11px] leading-[13px] tracking-[0.2em]"
      >
        <span className="font-medium">EXAMPLE</span>
        <span className="font-light italic">PROJECT</span>
      </span>
      <span aria-hidden className="size-0.75 rounded-full bg-current" />
    </span>
  );
}

/**
 * App Bar — Figma: `04 Patterns / App Shell › App Bar` (Device=Desktop | Mobile).
 * Kopfzeile der Dextinity-Apps (dunkel): links Navigation-Toggle + Branding, rechts Suche, Scope, Benutzer.
 * Unter 1024px automatisch Mobile: Hamburger, Logo, Such-Button, Avatar.
 *
 * ```tsx
 * <AppBar
 *   appName="Content Hub"
 *   search={<Search placeholder="Suchen …" />}
 *   scope={{ label: 'Vivid Planet', onClick: openScopes }}
 *   user={{ name: 'Maria Muster', onClick: openUserMenu }}
 * />
 * ```
 */
export function AppBar({
  logo,
  appName,
  search,
  onSearchClick,
  scope,
  user,
  onNavigationToggle,
  navigationToggleLabel = 'Navigation umschalten',
  theme = 'dark',
  className,
  ...props
}: AppBarProps) {
  const shell = useAppShell();
  const toggle = onNavigationToggle ?? shell?.toggleNavigation;
  return (
    <header
      {...props}
      data-theme={theme === 'dark' ? 'dark' : undefined}
      className={cn(
        // Figma: 60px hoch, fest (kein Token, siehe Gap-Report AS1)
        'flex h-15 w-full shrink-0 items-center border-b border-solid border-border-subtle bg-background font-sans text-foreground',
        className,
      )}
    >
      <div className="flex h-full min-w-0 items-center gap-2 px-4">
        {toggle ? (
          <>
            <IconButton
              aria-label={navigationToggleLabel}
              aria-expanded={shell ? shell.navigationOpen : undefined}
              variant="outlined"
              color="secondary"
              className="max-desktop:hidden"
              onClick={toggle}
            >
              <SidebarIcon />
            </IconButton>
            <IconButton
              aria-label={navigationToggleLabel}
              aria-expanded={shell ? shell.navigationOpen : undefined}
              variant="text"
              color="secondary"
              className="desktop:hidden"
              onClick={toggle}
            >
              <HamburgerIcon />
            </IconButton>
          </>
        ) : null}
        <div className="flex min-w-0 items-center gap-5">
          {logo ?? <LogoPlaceholder />}
          {appName ? (
            <span className="truncate typo-body-md-normal max-desktop:hidden">{appName}</span>
          ) : null}
        </div>
      </div>
      <div className="flex-1" />
      <div className="flex h-full items-center">
        {search ? <div className={cn(segment, 'max-desktop:hidden')}>{search}</div> : null}
        {onSearchClick ? (
          <div className="flex h-full items-center pl-4 desktop:hidden">
            <IconButton
              aria-label="Suchen"
              variant="text"
              color="secondary"
              onClick={onSearchClick}
            >
              <SearchIcon />
            </IconButton>
          </div>
        ) : null}
        {scope ? (
          <div className={cn(segment, 'max-desktop:hidden')}>
            <button type="button" className={trigger} onClick={scope.onClick}>
              <DomainIcon />
              <span className="max-w-50 truncate">{scope.label}</span>
              <ChevronDownIcon className="size-3!" />
            </button>
          </div>
        ) : null}
        {user ? (
          <div className={cn(segment, 'max-desktop:border-l-0')}>
            <button type="button" className={trigger} onClick={user.onClick} aria-label={user.name}>
              <span
                aria-hidden
                className="inline-flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-background-subtle text-foreground-muted"
              >
                {user.avatar ?? <AccountIcon />}
              </span>
              <span aria-hidden className="max-w-40 truncate max-desktop:hidden">
                {user.name}
              </span>
              <ChevronDownIcon aria-hidden className="size-3! max-desktop:hidden" />
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
