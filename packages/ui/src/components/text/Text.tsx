import { createElement, type ElementType, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';

export type TextVariant = 'display' | 'heading' | 'body' | 'caption' | 'label' | 'data';
export type TextSize = 'h1' | 'h2' | 'h3' | 'h4' | 'large' | 'medium' | 'small' | 'x-small';
export type TextWeight = 'normal' | 'bold';
export type TextColor = 'default' | 'muted' | 'subtle' | 'inherit';

export interface TextProps extends Omit<HTMLAttributes<HTMLElement>, 'color'> {
  /** Figma: Variant. @default 'body' */
  variant?: TextVariant;
  /**
   * Figma: Size. Heading: `h1`–`h4` (Standard `h2`). Body: `large` | `medium` | `small` | `x-small`
   * (Standard `medium`). Label: `medium` | `small` | `x-small`. Data: `medium` | `small`. Display/Caption: ohne.
   */
  size?: TextSize;
  /** Normal oder Bold (Bold-Text-Styles aus Figma). Label hat nur ein Gewicht. @default 'normal' */
  weight?: TextWeight;
  /** Textfarbe. Standard: Caption `muted`, sonst `default`. */
  color?: TextColor;
  /** Anderes HTML-Element (z.B. `h3` mit Optik von H2). Standard: passend zur Variante. */
  as?: ElementType;
  children: ReactNode;
  className?: string;
}

/** Figma-Variante + Size → Text-Style-Klasse (statisch, damit Tailwind sie findet). */
const STYLE: Record<string, { normal: string; bold: string }> = {
  display: { normal: 'typo-heading-display-normal', bold: 'typo-heading-display-bold' },
  'heading-h1': { normal: 'typo-heading-h1-normal', bold: 'typo-heading-h1-bold' },
  'heading-h2': { normal: 'typo-heading-h2-normal', bold: 'typo-heading-h2-bold' },
  'heading-h3': { normal: 'typo-heading-h3-normal', bold: 'typo-heading-h3-bold' },
  'heading-h4': { normal: 'typo-heading-h4-normal', bold: 'typo-heading-h4-bold' },
  'body-large': { normal: 'typo-body-lg-normal', bold: 'typo-body-lg-bold' },
  'body-medium': { normal: 'typo-body-md-normal', bold: 'typo-body-md-bold' },
  'body-small': { normal: 'typo-body-sm-normal', bold: 'typo-body-sm-bold' },
  'body-x-small': { normal: 'typo-body-xs-normal', bold: 'typo-body-xs-bold' },
  caption: { normal: 'typo-body-xs-normal', bold: 'typo-body-xs-bold' },
  'label-medium': { normal: 'typo-label-md', bold: 'typo-label-md' },
  'label-small': { normal: 'typo-label-sm', bold: 'typo-label-sm' },
  'label-x-small': { normal: 'typo-label-xs', bold: 'typo-label-xs' },
  'data-medium': {
    normal: 'typo-body-md-normal tabular-nums',
    bold: 'typo-body-md-bold tabular-nums',
  },
  'data-small': {
    normal: 'typo-body-sm-normal tabular-nums',
    bold: 'typo-body-sm-bold tabular-nums',
  },
};

const DEFAULT_SIZE: Record<TextVariant, TextSize | undefined> = {
  display: undefined,
  heading: 'h2',
  body: 'medium',
  caption: undefined,
  label: 'medium',
  data: 'medium',
};

const COLOR: Record<TextColor, string> = {
  default: 'text-foreground',
  muted: 'text-foreground-muted',
  subtle: 'text-foreground-subtle',
  inherit: '',
};

function defaultElement(variant: TextVariant, size?: TextSize): ElementType {
  if (variant === 'display') return 'h1';
  if (variant === 'heading') return (size ?? 'h2') as ElementType;
  if (variant === 'body') return 'p';
  return 'span';
}

/**
 * Text — Figma: `03 Components / Typography`. Setzt die Figma-Text-Styles (`typo-*`) mit passendem Element.
 *
 * ```tsx
 * <Text variant="heading" size="h2" weight="bold">Benutzer</Text>
 * <Text>Verwalte, wer Zugriff auf deinen Workspace hat.</Text>
 * <Text variant="caption">Zuletzt geändert vor 2 Tagen</Text>
 * <Text variant="data" size="small">1.284,50 €</Text>
 * ```
 */
export function Text({
  variant = 'body',
  size,
  weight = 'normal',
  color,
  as,
  children,
  className,
  ...props
}: TextProps) {
  const s = size ?? DEFAULT_SIZE[variant];
  const key = variant === 'display' || variant === 'caption' ? variant : `${variant}-${s}`;
  const style = STYLE[key] ?? STYLE['body-medium']!;
  return createElement(
    as ?? defaultElement(variant, s),
    {
      ...props,
      className: cn(
        style[weight],
        COLOR[color ?? (variant === 'caption' ? 'muted' : 'default')],
        className,
      ),
    },
    children,
  );
}
