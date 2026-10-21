import { Field } from '@base-ui/react/field';
import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

export interface FormHelperTextProps extends Omit<
  Field.Description.Props,
  'className' | 'children'
> {
  /** Figma: Children — Hinweis- oder Fehlertext. */
  children?: ReactNode;
  /** Figma: Type. @default 'hint' */
  type?: 'hint' | 'error';
  /** Figma: Count Current / Count Max — zeigt „current / max“ rechts. */
  count?: { current: number; max: number };
  className?: string;
}

/**
 * FormHelperText — Figma: `03 Components / Form / Form Helper Text`.
 * Wird per `aria-describedby` mit dem Feld verknüpft (innerhalb von `Field.Root`).
 */
export function FormHelperText({
  children,
  type = 'hint',
  count,
  className,
  ...props
}: FormHelperTextProps) {
  return (
    <Field.Description
      {...props}
      data-type={type}
      className={cn(
        'flex items-start justify-between gap-(--dx-form-helper-text-gap-internal) font-sans',
        '[font-size:var(--dx-form-helper-text-font-size)] [line-height:var(--dx-form-helper-text-font-line-height)] [font-weight:var(--dx-form-helper-text-font-weight)]',
        'text-(color:--dx-form-helper-text-type-hint-foreground) data-[type=error]:text-(color:--dx-form-helper-text-type-error-foreground)',
        className,
      )}
    >
      <span>{children}</span>
      {count ? (
        <span className="shrink-0 text-(color:--dx-form-helper-text-count-foreground) tabular-nums">
          {count.current} / {count.max}
        </span>
      ) : null}
    </Field.Description>
  );
}
