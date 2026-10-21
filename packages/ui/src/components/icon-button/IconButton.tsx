import { Button as BaseButton } from '@base-ui/react/button';
import { cva } from 'class-variance-authority';
import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import {
  buttonColorVars,
  buttonStateClasses,
  type ButtonColor,
  type ButtonSize,
  type ButtonVariant,
} from '../button/button-tokens';
import { Spinner } from '../spinner';

export interface IconButtonProps extends Omit<
  BaseButton.Props,
  'className' | 'color' | 'children' | 'disabled'
> {
  /** Pflicht: zugänglicher Name, weil kein sichtbares Label existiert. */
  'aria-label': string;
  /** Figma: Variant. @default 'contained' */
  variant?: ButtonVariant;
  /** Figma: Color. @default 'primary' */
  color?: ButtonColor;
  /** Figma: Size. @default 'default' */
  size?: ButtonSize;
  /** Figma: Disabled. */
  disabled?: boolean;
  /** Figma: Loading. Ersetzt das Icon durch einen Spinner. */
  loading?: boolean;
  /** Figma: Children — das Icon, z.B. `<EditIcon />`. */
  children: ReactNode;
  className?: string;
}

const iconButtonVariants = cva(
  [
    'inline-flex shrink-0 cursor-pointer items-center justify-center select-none',
    'transition-colors duration-(--dx-primitive-motion-duration-sm) ease-standard',
    buttonStateClasses,
  ],
  {
    variants: {
      size: {
        default: [
          'size-(--dx-button-type-icon-button-default-height) rounded-(--dx-button-type-icon-button-default-radius)',
          'px-(--dx-button-type-icon-button-default-padding-horizontal) py-(--dx-button-type-icon-button-default-padding-vertical)',
          '[&_svg]:size-(--dx-button-type-icon-button-default-icon-size)',
        ],
        small: [
          'size-(--dx-button-type-icon-button-small-height) rounded-(--dx-button-type-icon-button-small-radius)',
          'px-(--dx-button-type-icon-button-small-padding-horizontal) py-(--dx-button-type-icon-button-small-padding-vertical)',
          '[&_svg]:size-(--dx-button-type-icon-button-small-icon-size)',
        ],
      },
    },
    defaultVariants: { size: 'default' },
  },
);

/**
 * IconButton — Figma: `03 Components / Icon Button`. Gleiche Farb-Tokens wie Button.
 *
 * ```tsx
 * <IconButton aria-label="Bearbeiten" variant="text" color="secondary"><EditIcon /></IconButton>
 * ```
 */
export function IconButton({
  variant = 'contained',
  color = 'primary',
  size = 'default',
  disabled = false,
  loading = false,
  children,
  className,
  style,
  onClick,
  ...props
}: IconButtonProps) {
  return (
    <BaseButton
      {...props}
      disabled={disabled}
      aria-busy={loading || undefined}
      data-loading={loading ? '' : undefined}
      data-variant={variant}
      data-color={color}
      onClick={(event) => {
        if (loading) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
      }}
      className={cn(iconButtonVariants({ size }), className)}
      style={{ ...buttonColorVars(variant, color), ...style }}
    >
      {loading ? <Spinner /> : children}
    </BaseButton>
  );
}
