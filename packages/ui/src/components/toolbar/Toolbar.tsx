import { ArrowLeftIcon, ChevronRightIcon, InfoIcon } from '@dextinity/icons';
import type { ComponentPropsWithoutRef, ElementType, ReactNode, Ref } from 'react';
import { Fragment } from 'react';
import { cn } from '../../lib/cn';
import { IconButton } from '../icon-button';
import { Tooltip } from '../tooltip';

export interface ToolbarBreadcrumbItem {
  /** Angezeigter Text. */
  label: ReactNode;
  /** Link-Ziel. Ohne `href` und `onClick` ist das Element reiner Text. */
  href?: string;
  onClick?: () => void;
}

export interface ToolbarProps extends Omit<ComponentPropsWithoutRef<'div'>, 'title'> {
  /** Figma: Title. */
  title: ReactNode;
  /** Überschrift-Ebene des Titels. @default 'h1' */
  titleAs?: 'h1' | 'h2' | 'h3';
  /** Figma: Breadcrumb (`_Show Breadcrumb`). Letzter Eintrag = aktuelle Seite. */
  breadcrumb?: ToolbarBreadcrumbItem[];
  /** Zugänglicher Name der Breadcrumb-Navigation. @default 'Breadcrumb' */
  breadcrumbLabel?: string;
  /** Figma: Back Button (`_Show Back Button`). Wird gezeigt, sobald `onBack` gesetzt ist. */
  onBack?: () => void;
  /** Zugänglicher Name des Zurück-Buttons. @default 'Zurück' */
  backLabel?: string;
  /** Figma: Info Icon (`_Show Info Icon`). Inhalt des Tooltips am Info-Icon neben dem Titel. */
  info?: ReactNode;
  /** Zugänglicher Name des Info-Icons. @default 'Mehr Informationen' */
  infoLabel?: string;
  /** Figma: Support Text (`_Show Support Text`) — Zeile unter dem Titel. */
  supportText?: ReactNode;
  /** Figma: Slot „Actions“ (`_Show Actions`), rechts. Primäre Aktion zuletzt. */
  actions?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

/** Breadcrumb- und Titelzeile teilen sich die Abstände (Figma: `space/layout/md` horizontal). */
const row = 'flex items-center px-layout-md';

/**
 * Toolbar — Figma: `04 Patterns / Toolbar` (Device=Desktop | Mobile).
 * Kopf einer Admin-Seite: Breadcrumb, Zurück-Button, Titel mit Info-Icon, Support Text, Aktionen rechts.
 * Bewusst kein `<header>`-Landmark (das ist die App Bar) — der Titel ist die Seitenüberschrift.
 * Abstände und Schriftgrößen wechseln über die Responsive-Tokens automatisch auf Mobile —
 * auf schmalen Screens Aktionen am besten in ein Overflow-Menü (`IconButton` mit `MoreVerticalIcon`) packen.
 *
 * ```tsx
 * <Toolbar
 *   title="Kampagnen"
 *   breadcrumb={[{ label: 'Marketing', href: '/marketing' }, { label: 'Kampagnen' }]}
 *   actions={<><Button variant="outlined">Filter</Button><Button>Exportieren</Button></>}
 * />
 * ```
 */
export function Toolbar({
  title,
  titleAs = 'h1',
  breadcrumb,
  breadcrumbLabel = 'Breadcrumb',
  onBack,
  backLabel = 'Zurück',
  info,
  infoLabel = 'Mehr Informationen',
  supportText,
  actions,
  className,
  ...props
}: ToolbarProps) {
  const Title: ElementType = titleAs;
  return (
    <div
      {...props}
      className={cn(
        'flex w-full flex-col border-b border-solid border-border-subtle bg-background font-sans',
        className,
      )}
    >
      {breadcrumb?.length ? (
        <nav
          aria-label={breadcrumbLabel}
          className={cn(row, 'border-b border-solid border-border-subtle py-2')}
        >
          <ol className="flex min-w-0 flex-wrap items-center gap-2">
            {breadcrumb.map((item, i) => {
              const current = i === breadcrumb.length - 1;
              const text = current
                ? 'typo-body-sm-bold text-foreground'
                : 'typo-body-sm-normal text-foreground-muted';
              return (
                <Fragment key={i}>
                  {i > 0 ? (
                    <li aria-hidden className="flex text-foreground-muted [&_svg]:size-3">
                      <ChevronRightIcon />
                    </li>
                  ) : null}
                  <li className="min-w-0">
                    {current || (!item.href && !item.onClick) ? (
                      <span className={text} aria-current={current ? 'page' : undefined}>
                        {item.label}
                      </span>
                    ) : (
                      <a
                        href={item.href}
                        onClick={
                          item.onClick
                            ? (e) => {
                                if (!item.href) e.preventDefault();
                                item.onClick?.();
                              }
                            : undefined
                        }
                        className={cn(
                          text,
                          'cursor-pointer rounded-xs underline-offset-2 hover:text-foreground hover:underline',
                        )}
                      >
                        {item.label}
                      </a>
                    )}
                  </li>
                </Fragment>
              );
            })}
          </ol>
        </nav>
      ) : null}
      <div className={cn(row, 'gap-layout-sm py-3')}>
        {onBack ? (
          <IconButton aria-label={backLabel} variant="text" color="secondary" onClick={onBack}>
            <ArrowLeftIcon />
          </IconButton>
        ) : null}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex min-w-0 items-center gap-2">
            <Title className="min-w-0 truncate typo-heading-h3-normal text-foreground">
              {title}
            </Title>
            {info ? (
              <Tooltip content={info} side="bottom">
                <button
                  type="button"
                  aria-label={infoLabel}
                  className="inline-flex shrink-0 cursor-help rounded-full text-foreground-muted hover:text-foreground [&_svg]:size-4"
                >
                  <InfoIcon />
                </button>
              </Tooltip>
            ) : null}
          </div>
          {supportText ? (
            <p className="typo-body-sm-normal text-foreground-muted">{supportText}</p>
          ) : null}
        </div>
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}
