import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import type { ReactElement, ReactNode } from 'react';
import { cn } from '../../lib/cn';

export type TooltipColor = 'light' | 'dark' | 'success' | 'error' | 'warning';
export type TooltipSide = 'top' | 'bottom' | 'left' | 'right';
export type TooltipAlign = 'start' | 'center' | 'end';

export interface TooltipProps {
  /** Das auslösende Element (muss Fokus/Hover annehmen, z.B. Button, IconButton). */
  children: ReactElement;
  /** Figma: Notification text. */
  content: ReactNode;
  /** Figma: Title (Show Title). */
  title?: ReactNode;
  /** Figma: Color. @default 'light' (Figma-Standardvariante) */
  color?: TooltipColor;
  /** Figma: Position (erster Teil). @default 'top' */
  side?: TooltipSide;
  /** Figma: Position (zweiter Teil: Left/Top = start, Middle = center, Right/Bottom = end). @default 'center' */
  align?: TooltipAlign;
  /** Verzögerung bis zum Öffnen in ms. @default 600 */
  delay?: number;
  /** Kontrolliert öffnen/schließen. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

const COLOR: Record<TooltipColor, { popup: string; arrow: string }> = {
  light: { popup: 'bg-background text-foreground', arrow: 'fill-background' },
  dark: {
    popup: 'bg-background-inverse text-foreground-inverse',
    arrow: 'fill-background-inverse',
  },
  success: {
    popup: 'bg-feedback-success-subtle text-feedback-success-foreground',
    arrow: 'fill-feedback-success-subtle',
  },
  error: {
    popup: 'bg-action-error-subtle text-feedback-danger-foreground',
    arrow: 'fill-action-error-subtle',
  },
  warning: {
    popup: 'bg-feedback-warning-subtle text-feedback-warning-foreground',
    arrow: 'fill-feedback-warning-subtle',
  },
};

/**
 * Tooltip — Figma: `03 Components / Tooltip`. Auf Base UI Tooltip (Hover + Tastaturfokus, Escape schließt).
 * Nur ergänzende Infos — nichts, was man zum Bedienen zwingend braucht.
 *
 * ```tsx
 * <Tooltip content="Bearbeiten"><IconButton aria-label="Bearbeiten"><EditIcon /></IconButton></Tooltip>
 * <Tooltip title="Hinweis" content="Wird nachts synchronisiert." color="light" side="right"><InfoIcon tabIndex={0} /></Tooltip>
 * ```
 */
export function Tooltip({
  children,
  content,
  title,
  color = 'light',
  side = 'top',
  align = 'center',
  delay = 600,
  open,
  defaultOpen,
  onOpenChange,
  className,
}: TooltipProps) {
  const c = COLOR[color];
  return (
    <BaseTooltip.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange ? (o) => onOpenChange(o) : undefined}
    >
      <BaseTooltip.Trigger delay={delay} render={children} />
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner side={side} align={align} sideOffset={8} className="z-50">
          <BaseTooltip.Popup
            data-color={color}
            className={cn(
              'flex max-w-50 flex-col rounded-tooltip px-3 py-2 typo-body-sm-normal font-sans shadow-md',
              'origin-(--transform-origin) transition-[opacity,scale] duration-(--dx-primitive-motion-duration-sm) ease-standard',
              'data-ending-style:scale-95 data-ending-style:opacity-0 data-instant:duration-0 data-starting-style:scale-95 data-starting-style:opacity-0',
              c.popup,
              className,
            )}
          >
            {title ? <span className="typo-body-sm-bold">{title}</span> : null}
            <span>{content}</span>
            <BaseTooltip.Arrow
              className={cn(
                'flex',
                'data-[side=top]:-bottom-1.5 data-[side=top]:rotate-180',
                'data-[side=bottom]:-top-1.5',
                'data-[side=left]:-right-[9px] data-[side=left]:rotate-90',
                'data-[side=right]:-left-[9px] data-[side=right]:-rotate-90',
              )}
            >
              <svg width="12" height="6" viewBox="0 0 12 6" aria-hidden className={c.arrow}>
                <path d="M6 0L12 6H0L6 0Z" />
              </svg>
            </BaseTooltip.Arrow>
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  );
}

/** Teilt Öffnungs-Verzögerung zwischen benachbarten Tooltips (z.B. in Toolbars). */
export const TooltipProvider = BaseTooltip.Provider;
