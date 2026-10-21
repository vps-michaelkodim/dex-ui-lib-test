import { Toast } from '@base-ui/react/toast';
import {
  CloseIcon,
  InfoFilledIcon,
  InfoIcon,
  StatusErrorSolidIcon,
  StatusSuccessSolidIcon,
  StatusWarningSolidIcon,
} from '@dextinity/icons';
import type { CSSProperties, MouseEvent, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Button } from '../button';
import { IconButton } from '../icon-button';

export type SnackbarColor = 'default' | 'info' | 'success' | 'warning' | 'error';

const ICON: Record<SnackbarColor, ReactNode> = {
  default: <InfoIcon />,
  info: <InfoFilledIcon />,
  success: <StatusSuccessSolidIcon />,
  warning: <StatusWarningSolidIcon />,
  error: <StatusErrorSolidIcon />,
};

/** Component-Tokens `snackbar/color/{color}/*` → lokale Variablen. */
const vars = (color: SnackbarColor) =>
  ({
    '--sb-bg': `var(--dx-snackbar-color-${color}-background)`,
    '--sb-border': `var(--dx-snackbar-color-${color}-border)`,
    '--sb-icon': `var(--dx-snackbar-color-${color}-icon)`,
  }) as CSSProperties;

const box = [
  'flex w-full items-center font-sans',
  'min-w-(--dx-snackbar-min-width) max-w-(--dx-snackbar-max-width)',
  'gap-(--dx-snackbar-gap) px-(--dx-snackbar-padding-horizontal) py-(--dx-snackbar-padding-vertical)',
  'rounded-(--dx-snackbar-radius) border-solid border-(length:--dx-snackbar-border-width) border-(color:--sb-border) bg-(--sb-bg) shadow-md',
  'text-(color:--dx-snackbar-foreground)',
].join(' ');

const iconCls =
  'inline-flex shrink-0 text-(color:--sb-icon) [&_svg]:size-(--dx-snackbar-icon-size)';

export interface SnackbarProps {
  /** Figma: Color — Bedeutung der Meldung. @default 'default' */
  color?: SnackbarColor;
  /** Figma: Title (optional, fett über der Nachricht). */
  title?: ReactNode;
  /** Figma: Children — die Nachricht. */
  children: ReactNode;
  /** Figma: Action — z.B. `<Button>Rückgängig</Button>` (wird als Text-Button klein gesetzt). */
  action?: { label: ReactNode; onClick: (event: MouseEvent<HTMLButtonElement>) => void };
  /** Figma: Close — zeigt den Schließen-Button. */
  onClose?: () => void;
  /** @default 'Schließen' */
  closeLabel?: string;
  className?: string;
}

/**
 * Snackbar — Figma: `03 Components / Snackbar`. Statische Darstellung (z.B. in Doku/Prototypen).
 * Für echte Meldungen `SnackbarProvider` + `useSnackbar()` verwenden.
 */
export function Snackbar({
  color = 'default',
  title,
  children,
  action,
  onClose,
  closeLabel = 'Schließen',
  className,
}: SnackbarProps) {
  return (
    <div role="status" data-color={color} style={vars(color)} className={cn(box, className)}>
      <span aria-hidden className={iconCls}>
        {ICON[color]}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-(--dx-snackbar-content-gap)">
        {title ? <p className="typo-body-sm-bold">{title}</p> : null}
        <p className="typo-body-sm-normal">{children}</p>
      </div>
      {action || onClose ? (
        <div className="flex shrink-0 items-center gap-(--dx-snackbar-actions-gap)">
          {action ? (
            <Button variant="text" size="small" onClick={action.onClick}>
              {action.label}
            </Button>
          ) : null}
          {onClose ? (
            <IconButton
              aria-label={closeLabel}
              variant="text"
              color="secondary"
              size="small"
              onClick={onClose}
            >
              <CloseIcon />
            </IconButton>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

// ─── Meldungen zur Laufzeit ──────────────────────────────────────────────────────────────

export interface ShowSnackbarOptions {
  /** Die Nachricht. */
  message: ReactNode;
  title?: ReactNode;
  color?: SnackbarColor;
  /** Aktion, z.B. `{ label: 'Rückgängig', onClick: undo }`. Klick schließt die Meldung. */
  action?: { label: ReactNode; onClick: () => void };
  /** Anzeigedauer in ms, `0` = bleibt bis zum Schließen. @default 5000 (mit Aktion 8000) */
  timeout?: number;
}

interface SnackbarData {
  color: SnackbarColor;
  actionLabel?: ReactNode;
}

/** Zeigt Snackbars an. `show()` gibt die ID zurück, `close(id)` schließt. */
export function useSnackbar() {
  const manager = Toast.useToastManager<SnackbarData>();
  return {
    show: ({ message, title, color = 'default', action, timeout }: ShowSnackbarOptions) => {
      let id = '';
      id = manager.add({
        title,
        description: message,
        timeout: timeout ?? (action ? 8000 : 5000),
        priority: color === 'error' ? 'high' : 'low',
        data: { color, actionLabel: action?.label },
        // Aktion ausführen und Meldung schließen
        actionProps: action
          ? {
              onClick: () => {
                action.onClick();
                manager.close(id);
              },
            }
          : undefined,
      });
      return id;
    },
    close: (id?: string) => manager.close(id),
  };
}

function SnackbarList({ closeLabel }: { closeLabel: string }) {
  const { toasts } = Toast.useToastManager<SnackbarData>();
  return toasts.map((t) => {
    const color = t.data?.color ?? 'default';
    return (
      <Toast.Root
        key={t.id}
        toast={t}
        style={vars(color)}
        className={cn(
          box,
          'transition-[opacity,translate] duration-(--dx-primitive-motion-duration-md) ease-standard data-ending-style:opacity-0 data-starting-style:translate-y-4 data-starting-style:opacity-0',
        )}
      >
        <span aria-hidden className={iconCls}>
          {ICON[color]}
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-(--dx-snackbar-content-gap)">
          {t.title ? <Toast.Title className="typo-body-sm-bold" /> : null}
          <Toast.Description className="typo-body-sm-normal" />
        </div>
        <div className="flex shrink-0 items-center gap-(--dx-snackbar-actions-gap)">
          {t.data?.actionLabel ? (
            <Toast.Action
              render={(actionProps) => (
                <Button {...(actionProps as Record<string, unknown>)} variant="text" size="small">
                  {t.data?.actionLabel}
                </Button>
              )}
            />
          ) : null}
          <Toast.Close
            render={
              <IconButton aria-label={closeLabel} variant="text" color="secondary" size="small">
                <CloseIcon />
              </IconButton>
            }
          />
        </div>
      </Toast.Root>
    );
  });
}

export interface SnackbarProviderProps {
  children: ReactNode;
  /** Wie viele Meldungen gleichzeitig sichtbar sind. @default 3 */
  limit?: number;
  /** @default 'Schließen' */
  closeLabel?: string;
}

/**
 * Einmal um die App legen, dann überall `useSnackbar().show(...)`.
 *
 * ```tsx
 * <SnackbarProvider><App /></SnackbarProvider>
 *
 * const snackbar = useSnackbar();
 * snackbar.show({ color: 'success', message: 'Gespeichert.', action: { label: 'Rückgängig', onClick: undo } });
 * ```
 */
export function SnackbarProvider({
  children,
  limit = 3,
  closeLabel = 'Schließen',
}: SnackbarProviderProps) {
  return (
    <Toast.Provider limit={limit}>
      {children}
      <Toast.Portal>
        <Toast.Viewport className="fixed bottom-(--dx-primitive-unit-6) left-1/2 z-50 flex w-[calc(100vw-2*var(--dx-primitive-unit-4))] max-w-(--dx-snackbar-max-width) -translate-x-1/2 flex-col-reverse items-center gap-(--dx-primitive-unit-2) outline-none">
          <SnackbarList closeLabel={closeLabel} />
        </Toast.Viewport>
      </Toast.Portal>
    </Toast.Provider>
  );
}
