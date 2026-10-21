import type { FormHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import {
  FieldShell,
  FormLayoutProvider,
  useFieldLayout,
  type FieldLayout,
} from '../../lib/field-shell';
import { FormHelperText } from '../form-helper-text';
import { FormLabel } from '../form-label';

export interface FormProps extends Omit<FormHTMLAttributes<HTMLFormElement>, 'className'> {
  /**
   * Figma: Form Layout 1 Col (`stacked`, Label über dem Feld) / 2 Cols (`inline`, Label links).
   * Gilt für alle Felder darin (Input, Select, Search, FormField), die keine eigene `layout`-Prop haben.
   * @default 'stacked'
   */
  layout?: FieldLayout;
  children: ReactNode;
  className?: string;
}

/**
 * Form — `<form>` mit einheitlichem Feld-Layout und Abständen.
 *
 * ```tsx
 * <Form layout="inline" onSubmit={save}>
 *   <Input label="Name" required />
 *   <Select label="Rolle" options={roles} />
 *   <FormDivider />
 *   <FormField label="Benachrichtigungen"><Switch>E-Mail</Switch></FormField>
 *   <Button type="submit">Speichern</Button>
 * </Form>
 * ```
 */
export function Form({ layout = 'stacked', children, className, ...props }: FormProps) {
  return (
    <FormLayoutProvider value={layout}>
      <form {...props} className={cn('flex flex-col gap-layout-md', className)}>
        {children}
      </form>
    </FormLayoutProvider>
  );
}

export interface FormFieldProps {
  /** Figma: Form Label. */
  label?: ReactNode;
  /** Pflichtfeld: „*“ am Label. */
  required?: boolean;
  /** Hinweistext (Figma: Helper Text). Bei `status="error"` als Fehlertext. */
  helperText?: ReactNode;
  /** Figma: `_State` Error. */
  status?: 'error';
  /** Figma: Form Layout 1 Col / 2 Cols. Standard: vom `<Form>`, sonst `stacked`. */
  layout?: FieldLayout;
  /**
   * Woran das Label im `inline`-Layout ausgerichtet wird: `choice` für Checkbox/Radio/Switch (24px),
   * `field` für Eingabefelder (40px). @default 'choice'
   */
  labelAlign?: 'field' | 'choice';
  /** Figma: Slot — beliebiger Inhalt (Switch, eigene Steuerelemente, Text …). */
  children: ReactNode;
  className?: string;
}

/**
 * FormField — Figma: `Form Layout 1 Col` / `Form Layout 2 Cols` mit Slot. Für Inhalte ohne eigenes Label
 * (z.B. Switch-Liste, eigene Steuerelemente). `Input`, `Select` und `Search` haben `label` + `layout` selbst.
 */
export function FormField({
  label,
  required,
  helperText,
  status,
  layout,
  labelAlign = 'choice',
  children,
  className,
}: FormFieldProps) {
  const isError = status === 'error';
  return (
    <FieldShell
      layout={useFieldLayout(layout)}
      invalid={isError}
      labelAlign={labelAlign}
      className={className}
      label={
        label ? (
          <FormLabel mandatory={required} error={isError}>
            {label}
          </FormLabel>
        ) : undefined
      }
      control={<div className="flex min-w-0 flex-col gap-(--dx-primitive-unit-2)">{children}</div>}
      helper={
        helperText ? (
          <FormHelperText type={isError ? 'error' : 'hint'}>{helperText}</FormHelperText>
        ) : undefined
      }
    />
  );
}

/** FormDivider — Figma: `Form divider`. Trennt Abschnitte eines Formulars. */
export function FormDivider({ className }: { className?: string }) {
  return (
    <div className={cn('py-(--dx-primitive-unit-3)', className)}>
      <hr className="h-px border-0 bg-background-muted" />
    </div>
  );
}
