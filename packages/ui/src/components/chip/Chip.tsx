import { ClearIcon } from '@dextinity/icons';
import type { CSSProperties, MouseEvent, ReactNode } from 'react';
import { cn } from '../../lib/cn';

export type ChipVariant = 'contained' | 'outlined';
export type ChipColor = 'primary' | 'secondary' | 'info' | 'warning' | 'error' | 'success';
export type ChipSize = 'default' | 'small';

export interface ChipProps {
  /** Figma: Children — das Label. */
  children: ReactNode;
  /** Figma: Variant. @default 'contained' */
  variant?: ChipVariant;
  /** Figma: Color. @default 'secondary' */
  color?: ChipColor;
  /** Figma: Size. @default 'default' */
  size?: ChipSize;
  /** Figma: `_State` Disabled. */
  disabled?: boolean;
  /** Figma: Start Icon. */
  startIcon?: ReactNode;
  /** Figma: End Icon. */
  endIcon?: ReactNode;
  /** Macht den Chip klickbar (z.B. Filter). Rendert einen echten `<button>`. */
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** Figma: Clear — zeigt den Entfernen-Button. */
  onDelete?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** Zugänglicher Name des Entfernen-Buttons. @default 'Entfernen' */
  deleteLabel?: string;
  className?: string;
}

const STATES = ['default', 'hover', 'focus', 'disabled'] as const;
const PARTS = ['background', 'foreground', 'border'] as const;

/** Figma-Component-Tokens `chip/variant/{variant}/{color}/{state}/{part}` → lokale `--chip-*`-Variablen. */
function chipColorVars(variant: ChipVariant, color: ChipColor): CSSProperties {
  const vars: Record<string, string> = {};
  for (const s of STATES)
    for (const p of PARTS)
      vars[`--chip-${s}-${p}`] = `var(--dx-chip-variant-${variant}-${color}-${s}-${p})`;
  return vars as CSSProperties;
}

const SIZE = {
  default: [
    'h-(--dx-chip-size-default-height) rounded-(--dx-chip-size-default-radius) px-(--dx-chip-size-default-padding-horizontal) gap-(--dx-chip-size-default-gap)',
    '[font-size:var(--dx-chip-size-default-font-size)] [line-height:var(--dx-chip-size-default-font-line-height)] [font-weight:var(--dx-chip-size-default-font-weight)]',
    '[&_svg]:size-(--dx-chip-size-default-icon-size)',
  ],
  small: [
    'h-(--dx-chip-size-small-height) rounded-(--dx-chip-size-small-radius) px-(--dx-chip-size-small-padding-horizontal) gap-(--dx-chip-size-small-gap)',
    '[font-size:var(--dx-chip-size-small-font-size)] [line-height:var(--dx-chip-size-small-font-line-height)] [font-weight:var(--dx-chip-size-small-font-weight)]',
    '[&_svg]:size-(--dx-chip-size-small-icon-size)',
  ],
} as const;

/**
 * Chip — Figma: `03 Components / Chip`.
 *
 * ```tsx
 * <Chip>Entwurf</Chip>
 * <Chip color="success" variant="outlined">Veröffentlicht</Chip>
 * <Chip onClick={toggle} color={active ? 'primary' : 'secondary'}>Nur meine</Chip>
 * <Chip onDelete={() => remove(tag)}>{tag}</Chip>
 * ```
 */
export function Chip({
  children,
  variant = 'contained',
  color = 'secondary',
  size = 'default',
  disabled = false,
  startIcon,
  endIcon,
  onClick,
  onDelete,
  deleteLabel = 'Entfernen',
  className,
}: ChipProps) {
  const interactive = Boolean(onClick || onDelete) && !disabled;
  const content = (
    <>
      {startIcon ? <span className="inline-flex shrink-0">{startIcon}</span> : null}
      <span className="truncate">{children}</span>
      {endIcon ? <span className="inline-flex shrink-0">{endIcon}</span> : null}
    </>
  );

  return (
    <span
      data-variant={variant}
      data-color={color}
      data-disabled={disabled ? '' : undefined}
      data-interactive={interactive ? '' : undefined}
      style={chipColorVars(variant, color)}
      className={cn(
        'relative inline-flex max-w-full shrink-0 items-center font-sans whitespace-nowrap select-none',
        'border-(length:--dx-chip-border-width) border-solid transition-colors duration-(--dx-primitive-motion-duration-sm) ease-standard',
        'border-(color:--chip-default-border) bg-(--chip-default-background) text-(color:--chip-default-foreground)',
        'data-interactive:hover:border-(color:--chip-hover-border) data-interactive:hover:bg-(--chip-hover-background) data-interactive:hover:text-(color:--chip-hover-foreground)',
        'has-[[data-chip-main]:focus-visible]:border-(color:--chip-focus-border) has-[[data-chip-main]:focus-visible]:bg-(--chip-focus-background)',
        'has-[[data-chip-main]:focus-visible]:outline-(length:--dx-focus-ring-width) has-[[data-chip-main]:focus-visible]:outline-offset-(--dx-focus-ring-offset) has-[[data-chip-main]:focus-visible]:outline-border-focus has-[[data-chip-main]:focus-visible]:outline-solid',
        'data-disabled:cursor-not-allowed data-disabled:border-(color:--chip-disabled-border) data-disabled:bg-(--chip-disabled-background) data-disabled:text-(color:--chip-disabled-foreground)',
        SIZE[size],
        className,
      )}
    >
      {onClick ? (
        <button
          type="button"
          data-chip-main=""
          disabled={disabled}
          onClick={onClick}
          // Klickfläche über den ganzen Chip (Stretched-Button), Fokus-Ring sitzt am Chip
          className="inline-flex min-w-0 cursor-pointer items-center gap-[inherit] after:absolute after:inset-0 after:rounded-[inherit] focus-visible:outline-none disabled:cursor-not-allowed"
        >
          {content}
        </button>
      ) : (
        content
      )}
      {onDelete ? (
        <button
          type="button"
          aria-label={deleteLabel}
          disabled={disabled}
          onClick={onDelete}
          className="relative z-10 -mr-1 inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full p-0.5 disabled:cursor-not-allowed"
        >
          <ClearIcon />
        </button>
      ) : null}
    </span>
  );
}
