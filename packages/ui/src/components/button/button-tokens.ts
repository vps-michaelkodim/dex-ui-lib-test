import type { CSSProperties } from 'react';

export type ButtonVariant = 'contained' | 'outlined' | 'text';
export type ButtonColor = 'primary' | 'secondary' | 'error' | 'success';
export type ButtonSize = 'default' | 'small';

const STATES = ['default', 'hover', 'active', 'focus', 'disabled', 'loading'] as const;
const PARTS = ['background', 'foreground', 'border'] as const;

/**
 * Wählt die Figma-Component-Tokens `button/color/{color}/{variant}/{state}/{part}` aus und legt
 * sie als lokale Variablen `--btn-{state}-{part}` ab. Die Tailwind-Klassen im Button bleiben
 * dadurch statisch; Theme/Brand-Wechsel laufen über die var()-Kette der Tokens.
 * Wird von Button und IconButton geteilt (Figma: Icon Button nutzt dieselben Farb-Tokens).
 */
export function buttonColorVars(variant: ButtonVariant, color: ButtonColor): CSSProperties {
  const vars: Record<string, string> = {};
  for (const state of STATES) {
    for (const part of PARTS) {
      vars[`--btn-${state}-${part}`] =
        `var(--dx-button-color-${color}-${variant}-${state}-${part})`;
    }
  }
  return vars as CSSProperties;
}

/** Statische Zustands-Klassen, die auf die Variablen aus `buttonColorVars` zeigen. */
export const buttonStateClasses = [
  'border-solid border-(length:--dx-button-border-width)',
  'bg-(--btn-default-background) text-(color:--btn-default-foreground) border-(color:--btn-default-border)',
  // Hover/Active nur, wenn interaktiv
  'not-data-disabled:not-data-loading:hover:bg-(--btn-hover-background)',
  'not-data-disabled:not-data-loading:hover:text-(color:--btn-hover-foreground)',
  'not-data-disabled:not-data-loading:hover:border-(color:--btn-hover-border)',
  'not-data-disabled:not-data-loading:active:bg-(--btn-active-background)',
  'not-data-disabled:not-data-loading:active:text-(color:--btn-active-foreground)',
  'not-data-disabled:not-data-loading:active:border-(color:--btn-active-border)',
  // Fokus-Ring kommt global aus styles.css (:focus-visible → focus-ring Tokens)
  'focus-visible:bg-(--btn-focus-background) focus-visible:text-(color:--btn-focus-foreground) focus-visible:border-(color:--btn-focus-border)',
  'data-loading:cursor-wait data-loading:bg-(--btn-loading-background) data-loading:text-(color:--btn-loading-foreground) data-loading:border-(color:--btn-loading-border)',
  'data-disabled:cursor-not-allowed data-disabled:bg-(--btn-disabled-background) data-disabled:text-(color:--btn-disabled-foreground) data-disabled:border-(color:--btn-disabled-border)',
].join(' ');
