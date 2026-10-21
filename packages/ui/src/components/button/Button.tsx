import { Button as BaseButton } from '@base-ui/react/button';
import { cva } from 'class-variance-authority';
import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Spinner } from '../spinner';
import {
  buttonColorVars,
  buttonStateClasses,
  type ButtonColor,
  type ButtonSize,
  type ButtonVariant,
} from './button-tokens';

export interface ButtonProps extends Omit<
  BaseButton.Props,
  'className' | 'color' | 'children' | 'disabled'
> {
  /** Figma: Variant. @default 'contained' */
  variant?: ButtonVariant;
  /** Figma: Color. @default 'primary' */
  color?: ButtonColor;
  /** Figma: Size. @default 'default' */
  size?: ButtonSize;
  /** Figma: Disabled. */
  disabled?: boolean;
  /** Figma: Loading. Zeigt einen Spinner, blockiert Klicks, bleibt fokussierbar (aria-busy). */
  loading?: boolean;
  /** Figma: Start Icon (z.B. `<AddNoCircleIcon />`). */
  startIcon?: ReactNode;
  /** Figma: End Icon. */
  endIcon?: ReactNode;
  /** Figma: Children — das Label. */
  children: ReactNode;
  className?: string;
}

const buttonVariants = cva(
  [
    'inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap select-none',
    'font-sans transition-colors duration-(--dx-primitive-motion-duration-sm) ease-standard',
    buttonStateClasses,
  ],
  {
    variants: {
      size: {
        default: [
          'h-(--dx-button-type-button-default-height) rounded-(--dx-button-type-button-default-radius)',
          'px-(--dx-button-type-button-default-padding-horizontal) py-(--dx-button-type-button-default-padding-vertical)',
          'gap-(--dx-button-type-button-default-gap)',
          '[font-size:var(--dx-button-type-button-default-font-size)] [line-height:var(--dx-button-type-button-default-font-line-height)] [font-weight:var(--dx-button-type-button-default-font-weight)]',
          '[&_svg]:size-(--dx-button-type-button-default-icon-size)',
        ],
        small: [
          'h-(--dx-button-type-button-small-height) rounded-(--dx-button-type-button-small-radius)',
          'px-(--dx-button-type-button-small-padding-horizontal) py-(--dx-button-type-button-small-padding-vertical)',
          'gap-(--dx-button-type-button-small-gap)',
          '[font-size:var(--dx-button-type-button-small-font-size)] [line-height:var(--dx-button-type-button-small-font-line-height)] [font-weight:var(--dx-button-type-button-small-font-weight)]',
          '[&_svg]:size-(--dx-button-type-button-small-icon-size)',
        ],
      },
    },
    defaultVariants: { size: 'default' },
  },
);

/**
 * Button — Figma: `03 Components / Button`.
 *
 * ```tsx
 * <Button>Speichern</Button>
 * <Button variant="outlined" color="secondary" startIcon={<EditIcon />}>Bearbeiten</Button>
 * <Button loading>Speichern</Button>
 * <Button render={<a href="/docs" />} nativeButton={false}>Doku</Button>
 * ```
 */
export function Button({
  variant = 'contained',
  color = 'primary',
  size = 'default',
  disabled = false,
  loading = false,
  startIcon,
  endIcon,
  children,
  className,
  style,
  onClick,
  ...props
}: ButtonProps) {
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
      className={cn(buttonVariants({ size }), className)}
      style={{ ...buttonColorVars(variant, color), ...style }}
    >
      {loading ? <Spinner /> : startIcon}
      {children}
      {endIcon}
    </BaseButton>
  );
}
