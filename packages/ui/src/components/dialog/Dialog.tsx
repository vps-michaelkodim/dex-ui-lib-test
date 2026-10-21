import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { CloseIcon } from '@dextinity/icons';
import type { ReactElement, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { IconButton } from '../icon-button';

export type DialogSize = 'sm' | 'md' | 'lg' | 'xl';

export interface DialogProps {
  /** Offen (kontrolliert). */
  open?: boolean;
  /** Anfangs offen. */
  defaultOpen?: boolean;
  /** Wird beim Öffnen/Schließen aufgerufen (Escape, Klick daneben, Schließen-Button). */
  onOpenChange?: (open: boolean) => void;
  /** Element, das den Dialog öffnet (z.B. `<Button>`). */
  trigger?: ReactElement;
  /** Figma: Dialog Header › Title. */
  title: ReactNode;
  /** Icon im Kreis vor dem Titel (Figma: Dialog Header › Icon). */
  icon?: ReactNode;
  /** Figma: Dialog Container › Size. SM 640px, MD 1024px, LG 1280px, XL volle Breite. @default 'sm' */
  size?: DialogSize;
  /** Figma: Full Height / Fill Height — Dialog nutzt die ganze Höhe. */
  fullHeight?: boolean;
  /** Figma: Show Close Button. @default true */
  showCloseButton?: boolean;
  /** Zugänglicher Name des Schließen-Buttons. @default 'Schließen' */
  closeLabel?: string;
  /** Figma: Dialog Actions, rechts (z.B. Speichern). */
  actions?: ReactNode;
  /** Figma: Dialog Actions, links (z.B. Abbrechen). */
  secondaryActions?: ReactNode;
  /** Inhalt bekommt die Abstände des Headers. `false` für randlose Inhalte (Tabelle, Bild). @default true */
  padded?: boolean;
  /** Figma: Slot — Inhalt des Dialogs. */
  children?: ReactNode;
  className?: string;
}

/** Breite je Size (Figma-Tokens `dialog/size/*`), max. Viewport minus Rand. Statisch für Tailwind. */
const WIDTH: Record<DialogSize, string> = {
  sm: 'w-[min(var(--dx-dialog-size-sm-width),calc(100vw-2*var(--dx-dialog-overlay-padding)))]',
  md: 'w-[min(var(--dx-dialog-size-md-width),calc(100vw-2*var(--dx-dialog-overlay-padding)))]',
  lg: 'w-[min(var(--dx-dialog-size-lg-width),calc(100vw-2*var(--dx-dialog-overlay-padding)))]',
  xl: 'w-[calc(100vw-2*var(--dx-dialog-overlay-padding))]',
};

const popup = [
  'fixed top-1/2 left-1/2 z-50 flex -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden font-sans outline-none',
  'max-h-[calc(100dvh-2*var(--dx-dialog-overlay-padding))]',
  'rounded-(--dx-dialog-radius) border border-solid border-(color:--dx-dialog-border) bg-(--dx-dialog-background) shadow-lg',
  'transition-[opacity,scale] duration-(--dx-primitive-motion-duration-md) ease-standard data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0',
].join(' ');

const header = [
  'flex shrink-0 items-center gap-(--dx-dialog-header-gap) border-b border-solid border-(color:--dx-dialog-divider)',
  'px-(--dx-dialog-header-padding-horizontal) py-(--dx-dialog-header-padding-vertical)',
].join(' ');

const actionsBar = [
  'flex shrink-0 items-center justify-between gap-(--dx-dialog-actions-gap) border-t border-solid border-(color:--dx-dialog-divider)',
  'px-(--dx-dialog-actions-padding-horizontal) py-(--dx-dialog-actions-padding-vertical)',
].join(' ');

/**
 * Dialog — Figma: `03 Components / Dialog` (Container, Header, Actions, Slot).
 * Für Entscheidungen und kurze Aufgaben, die den Rest der Seite blockieren. Fokus bleibt im Dialog,
 * Escape schließt.
 *
 * ```tsx
 * <Dialog
 *   trigger={<Button>Bearbeiten</Button>}
 *   title="Benutzer bearbeiten"
 *   icon={<EditIcon />}
 *   secondaryActions={<Button variant="text" onClick={close}>Abbrechen</Button>}
 *   actions={<Button onClick={save}>Speichern</Button>}
 * >
 *   <Input label="Name" />
 * </Dialog>
 * ```
 */
export function Dialog({
  open,
  defaultOpen,
  onOpenChange,
  trigger,
  title,
  icon,
  size = 'sm',
  fullHeight = false,
  showCloseButton = true,
  closeLabel = 'Schließen',
  actions,
  secondaryActions,
  padded = true,
  children,
  className,
}: DialogProps) {
  return (
    <BaseDialog.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange ? (next) => onOpenChange(next) : undefined}
    >
      {trigger ? <BaseDialog.Trigger render={trigger} /> : null}
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className="fixed inset-0 z-50 bg-(--dx-dialog-overlay) transition-opacity duration-(--dx-primitive-motion-duration-md) data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <BaseDialog.Popup
          className={cn(
            popup,
            WIDTH[size],
            fullHeight && 'h-[calc(100dvh-2*var(--dx-dialog-overlay-padding))]',
            className,
          )}
        >
          <div className={header}>
            {icon ? (
              <span
                aria-hidden
                className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-(--dx-dialog-header-icon-ring)"
              >
                <span className="inline-flex size-10 items-center justify-center rounded-full bg-(--dx-dialog-header-icon-background) text-(color:--dx-dialog-header-icon-foreground) [&_svg]:size-4">
                  {icon}
                </span>
              </span>
            ) : null}
            <BaseDialog.Title className="min-w-0 flex-1 typo-body-lg-bold text-(color:--dx-dialog-header-title-color)">
              {title}
            </BaseDialog.Title>
            {showCloseButton ? (
              <BaseDialog.Close
                render={
                  <IconButton aria-label={closeLabel} variant="text" color="primary">
                    <CloseIcon />
                  </IconButton>
                }
              />
            ) : null}
          </div>
          <div
            className={cn(
              'min-h-0 flex-1 overflow-y-auto',
              padded &&
                'px-(--dx-dialog-header-padding-horizontal) py-(--dx-dialog-actions-padding-vertical)',
            )}
          >
            {children}
          </div>
          {actions || secondaryActions ? (
            <div className={actionsBar}>
              <div className="flex items-center gap-(--dx-dialog-actions-gap)">
                {secondaryActions}
              </div>
              <div className="flex items-center gap-(--dx-dialog-actions-gap)">{actions}</div>
            </div>
          ) : null}
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}

/** Schließt den umgebenden Dialog — z.B. `<DialogClose render={<Button variant="text">Abbrechen</Button>} />`. */
export const DialogClose = BaseDialog.Close;
