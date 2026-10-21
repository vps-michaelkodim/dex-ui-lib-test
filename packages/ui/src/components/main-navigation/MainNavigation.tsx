import { Collapsible } from '@base-ui/react/collapsible';
import { useRender } from '@base-ui/react/use-render';
import { ChevronDownIcon, PlusIcon } from '@dextinity/icons';
import {
  createContext,
  useContext,
  useId,
  type ComponentPropsWithoutRef,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cn } from '../../lib/cn';

const LevelContext = createContext(1);

/** Einrückung je Ebene (Figma: `Level 1–3`, Tokens `main-navigation/item/indent/level-*`). Statisch für Tailwind. */
const INDENT = [
  'pl-(--dx-main-navigation-item-indent-level-1)',
  'pl-(--dx-main-navigation-item-indent-level-2)',
  'pl-(--dx-main-navigation-item-indent-level-3)',
] as const;

export interface MainNavigationProps extends ComponentPropsWithoutRef<'nav'> {
  /** Zugänglicher Name. @default 'Hauptnavigation' */
  'aria-label'?: string;
  children: ReactNode;
}

/**
 * Main Navigation — Figma: `03 Components / Main navigation` (Item + Menu Section Header).
 *
 * ```tsx
 * <MainNavigation>
 *   <NavSection title="Main">
 *     <NavItem icon={<DashboardIcon />} label="Dashboard" href="/" active />
 *     <NavItem icon={<FilterIcon />} label="Filter" defaultOpen>
 *       <NavItem label="Kategorien" href="/filter/kategorien" />
 *     </NavItem>
 *   </NavSection>
 * </MainNavigation>
 * ```
 */
export function MainNavigation({
  'aria-label': ariaLabel = 'Hauptnavigation',
  children,
  className,
  ...props
}: MainNavigationProps) {
  return (
    <nav {...props} aria-label={ariaLabel} className={cn('flex flex-col font-sans', className)}>
      {children}
    </nav>
  );
}

export interface NavSectionProps {
  /** Figma: Menu Section Header › Text. */
  title: ReactNode;
  /** Figma: Expandable — Abschnitt auf-/zuklappbar. */
  expandable?: boolean;
  /** Anfangs offen (nur mit `expandable`). @default true */
  defaultOpen?: boolean;
  /** Figma: Show Add Icon — „+“-Button rechts (z.B. „Neuer Bereich“). */
  onAdd?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** Zugänglicher Name des „+“-Buttons. @default 'Hinzufügen' */
  addLabel?: string;
  children: ReactNode;
  className?: string;
}

const sectionHeader = [
  'flex w-full items-center gap-(--dx-main-navigation-section-header-gap)',
  'px-(--dx-main-navigation-section-header-padding-horizontal) py-(--dx-main-navigation-section-header-padding-vertical)',
  '[font-size:var(--dx-main-navigation-section-header-font-size)] [line-height:var(--dx-main-navigation-section-header-font-line-height)] [font-weight:var(--dx-main-navigation-section-header-font-weight)]',
  'text-(color:--dx-main-navigation-section-header-default-foreground)',
  '[&_svg]:size-(--dx-main-navigation-item-icon-size) [&_svg]:text-(color:--dx-main-navigation-section-header-default-icon)',
].join(' ');

const sectionHover =
  'cursor-pointer hover:text-(color:--dx-main-navigation-section-header-hover-foreground) hover:[&_svg]:text-(color:--dx-main-navigation-section-header-hover-icon)';

/** Abschnitt mit Überschrift (Figma: Menu Section Header). */
export function NavSection({
  title,
  expandable = false,
  defaultOpen = true,
  onAdd,
  addLabel = 'Hinzufügen',
  children,
  className,
}: NavSectionProps) {
  const headingId = useId();
  const add = onAdd ? (
    <button
      type="button"
      aria-label={addLabel}
      onClick={onAdd}
      className={cn('ml-auto inline-flex rounded-sm', sectionHover)}
    >
      <PlusIcon />
    </button>
  ) : null;
  const list = (
    <ul aria-labelledby={headingId} className="flex flex-col">
      {children}
    </ul>
  );

  if (!expandable) {
    return (
      <div className={cn('flex flex-col', className)}>
        <div className={sectionHeader}>
          <span id={headingId}>{title}</span>
          {add}
        </div>
        {list}
      </div>
    );
  }
  return (
    <Collapsible.Root defaultOpen={defaultOpen} className={cn('flex flex-col', className)}>
      <div className={sectionHeader}>
        <Collapsible.Trigger
          className={cn('group/sec inline-flex items-center gap-[inherit]', sectionHover)}
        >
          <span id={headingId}>{title}</span>
          <ChevronDownIcon className="transition-transform duration-(--dx-primitive-motion-duration-sm) not-group-data-panel-open/sec:-rotate-90" />
        </Collapsible.Trigger>
        {add}
      </div>
      <Collapsible.Panel>{list}</Collapsible.Panel>
    </Collapsible.Root>
  );
}

export interface NavItemProps {
  /** Figma: Text. */
  label: ReactNode;
  /** Figma: Choose Icon (Show Icon = Icon gesetzt). */
  icon?: ReactNode;
  /** Ziel-URL. Für Router-Links `render={<Link to="…" />}` verwenden. */
  href?: string;
  /** Eigenes Link-Element (z.B. React-Router `<Link>`). */
  render?: ReactElement;
  /** Figma: Active — aktuelle Seite (`aria-current="page"`). */
  active?: boolean;
  /** Klick (z.B. für Navigation ohne `href`). */
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  /** Unterpunkte (Figma: Expandable = Yes, Level 2/3). Dann wird der Punkt zum Auf-/Zuklapp-Button. */
  children?: ReactNode;
  /** Unterpunkte anfangs offen. */
  defaultOpen?: boolean;
  className?: string;
}

const row = [
  'group/item flex w-full items-center gap-(--dx-main-navigation-item-gap) outline-none select-none',
].join(' ');

const content = [
  'flex min-w-0 flex-1 items-center gap-(--dx-main-navigation-item-gap) text-left',
  // Figma: Item 40px hoch (Token item/height = 48, siehe Gap-Report N1)
  'h-(--dx-primitive-unit-10) pr-(--dx-main-navigation-item-padding-horizontal) rounded-(--dx-main-navigation-item-radius)',
  '[font-size:var(--dx-main-navigation-item-font-size)] [line-height:var(--dx-main-navigation-item-font-line-height)] [font-weight:var(--dx-main-navigation-item-font-weight)] tracking-tight',
  'bg-(--dx-main-navigation-item-default-background) text-(color:--dx-main-navigation-item-default-foreground)',
  'group-hover/item:bg-(--dx-main-navigation-item-hover-background) group-hover/item:text-(color:--dx-main-navigation-item-hover-foreground)',
  'group-data-active/item:bg-(--dx-main-navigation-item-active-background) group-data-active/item:text-(color:--dx-main-navigation-item-active-foreground)',
  'group-focus-visible/item:outline-solid group-focus-visible/item:outline-(length:--dx-focus-ring-width) group-focus-visible/item:outline-offset-(--dx-focus-ring-offset) group-focus-visible/item:outline-border-focus',
  'transition-colors duration-(--dx-primitive-motion-duration-sm) ease-standard',
  '[&_svg]:size-(--dx-main-navigation-item-icon-size) [&_svg]:shrink-0',
].join(' ');

const indicator =
  'h-(--dx-main-navigation-item-indicator-height) w-(--dx-main-navigation-item-indicator-width) shrink-0 rounded-full bg-(--dx-main-navigation-item-default-indicator) group-data-active/item:bg-(--dx-main-navigation-item-active-indicator)';

/** Ein Navigationspunkt (Figma: Main Navigation Item). Ebene ergibt sich aus der Verschachtelung. */
export function NavItem({
  label,
  icon,
  href,
  render,
  active = false,
  onClick,
  children,
  defaultOpen,
  className,
}: NavItemProps) {
  const level = Math.min(useContext(LevelContext), 3);
  const inner = (
    <>
      <span aria-hidden className={indicator} />
      <span className={cn(content, INDENT[level - 1])}>
        {icon ? (
          <span
            aria-hidden
            className="inline-flex text-(color:--dx-main-navigation-item-default-icon) group-data-active/item:text-(color:--dx-main-navigation-item-active-icon)"
          >
            {icon}
          </span>
        ) : null}
        <span className="min-w-0 flex-1 truncate">{label}</span>
        {children ? (
          <ChevronDownIcon className="size-3! transition-transform duration-(--dx-primitive-motion-duration-sm) not-group-data-panel-open/item:-rotate-90" />
        ) : null}
      </span>
    </>
  );

  const link = useRender({
    render: render ?? <a href={href} />,
    props: {
      className: cn(row, 'cursor-pointer', className),
      'aria-current': active ? 'page' : undefined,
      'data-active': active ? '' : undefined,
      onClick,
      children: inner,
    } as Record<string, unknown>,
  });

  if (!children) return <li>{link}</li>;

  return (
    <li>
      <Collapsible.Root defaultOpen={defaultOpen}>
        <Collapsible.Trigger
          data-active={active ? '' : undefined}
          onClick={onClick}
          className={cn(row, 'cursor-pointer', className)}
        >
          {inner}
        </Collapsible.Trigger>
        <Collapsible.Panel>
          <LevelContext.Provider value={level + 1}>
            <ul className="flex flex-col">{children}</ul>
          </LevelContext.Provider>
        </Collapsible.Panel>
      </Collapsible.Root>
    </li>
  );
}
