import { Field } from '@base-ui/react/field';
import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

export interface FormLabelProps extends Omit<Field.Label.Props, 'className' | 'children'> {
  /** Figma: Children — der Label-Text. */
  children: ReactNode;
  /** Figma: Mandatory — zeigt „*“ (das Feld selbst bekommt `required`). */
  mandatory?: boolean;
  /** Figma: Error. Wird innerhalb von `Input` automatisch aus `status="error"` gesetzt. */
  error?: boolean;
  /** Figma: Show Helper Icon — z.B. ein Info-Icon mit Tooltip. */
  helperIcon?: ReactNode;
  className?: string;
}

/** Klassen des Form Labels — auch für `<legend>` von Checkbox-/Radio-Gruppen. */
export const formLabelClasses = [
  'inline-flex items-center gap-(--dx-form-label-gap) font-sans',
  '[font-size:var(--dx-form-label-font-size)] [line-height:var(--dx-form-label-font-line-height)] [font-weight:var(--dx-form-label-font-weight)]',
  'text-(color:--dx-form-label-default-foreground) data-error:text-(color:--dx-form-label-error-foreground)',
].join(' ');

/**
 * FormLabel — Figma: `03 Components / Form / Form Label`.
 * Muss innerhalb eines Base-UI-`Field.Root` stehen (macht `Input` mit `label` automatisch).
 */
export function FormLabel({
  children,
  mandatory,
  error,
  helperIcon,
  className,
  ...props
}: FormLabelProps) {
  return (
    <Field.Label
      {...props}
      data-error={error ? '' : undefined}
      className={cn(formLabelClasses, className)}
    >
      {children}
      {mandatory ? (
        <span aria-hidden className="text-(color:--dx-form-label-mandatory-color)">
          *
        </span>
      ) : null}
      {helperIcon ? (
        <span className="inline-flex text-(color:--dx-form-label-helper-icon-color) [&_svg]:size-(--dx-form-label-helper-icon-size)">
          {helperIcon}
        </span>
      ) : null}
    </Field.Label>
  );
}
