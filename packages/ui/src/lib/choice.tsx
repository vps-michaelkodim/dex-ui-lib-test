import { Field } from '@base-ui/react/field';
import { Fieldset } from '@base-ui/react/fieldset';
import { createContext, useContext, type ReactElement, type ReactNode } from 'react';
import { FormHelperText } from '../components/form-helper-text';
import { formLabelClasses } from '../components/form-label/FormLabel';
import { cn } from './cn';

/** Gemeinsame Bausteine für Checkbox, Radio und Switch (Label-Zeile, Gruppe mit Legende + Hinweis). */

export interface ChoiceGroupState {
  invalid: boolean;
}
const ChoiceGroupContext = createContext<ChoiceGroupState | null>(null);
export const useChoiceGroup = () => useContext(ChoiceGroupContext);

export type ChoiceKind = 'checkbox' | 'radio-button' | 'switch';

/** Label-Zeile: Steuerelement + Text, Hover auf der ganzen Zeile (`group/choice`). Statische Klassen für Tailwind. */
const LABEL = {
  checkbox: {
    base: 'gap-(--dx-checkbox-gap) min-h-(--dx-checkbox-touch-target) [font-size:var(--dx-checkbox-label-font-size)] [line-height:var(--dx-checkbox-label-font-line-height)] [font-weight:var(--dx-checkbox-label-font-weight)]',
    enabled: 'cursor-pointer text-(color:--dx-checkbox-label-foreground-default)',
    disabled: 'cursor-not-allowed text-(color:--dx-checkbox-label-foreground-disabled)',
  },
  'radio-button': {
    base: 'gap-(--dx-radio-button-gap) min-h-(--dx-radio-button-touch-target) [font-size:var(--dx-radio-button-label-font-size)] [line-height:var(--dx-radio-button-label-font-line-height)] [font-weight:var(--dx-radio-button-label-font-weight)]',
    enabled: 'cursor-pointer text-(color:--dx-radio-button-label-foreground-default)',
    disabled: 'cursor-not-allowed text-(color:--dx-radio-button-label-foreground-disabled)',
  },
  switch: {
    base: 'gap-(--dx-switch-gap) min-h-(--dx-switch-touch-target) [font-size:var(--dx-switch-label-font-size)] [line-height:var(--dx-switch-label-font-line-height)] [font-weight:var(--dx-switch-label-font-weight)]',
    enabled: 'cursor-pointer text-(color:--dx-switch-label-foreground-default)',
    disabled: 'cursor-not-allowed text-(color:--dx-switch-label-foreground-disabled)',
  },
} as const;

export function choiceLabelClasses(kind: ChoiceKind, disabled: boolean) {
  const l = LABEL[kind];
  return cn(
    'group/choice inline-flex w-fit items-center font-sans select-none',
    l.base,
    disabled ? l.disabled : l.enabled,
  );
}

/**
 * Einzelnes Steuerelement mit Label. Innerhalb einer Gruppe → `Field.Item`, sonst eigenes `Field.Root`
 * (dann mit optionalem Hinweistext).
 */
export function ChoiceField({
  kind,
  label,
  control,
  disabled,
  invalid,
  helperText,
  className,
}: {
  kind: ChoiceKind;
  label?: ReactNode;
  control: ReactElement;
  disabled: boolean;
  invalid: boolean;
  helperText?: ReactNode;
  className?: string;
}) {
  const group = useChoiceGroup();
  const row = label ? (
    <Field.Label className={cn(choiceLabelClasses(kind, disabled), className)}>
      {control}
      <span>{label}</span>
    </Field.Label>
  ) : (
    control
  );
  if (group) return <Field.Item>{row}</Field.Item>;
  return (
    <Field.Root invalid={invalid} disabled={disabled} className="flex flex-col gap-1">
      {row}
      {helperText ? (
        <FormHelperText type={invalid ? 'error' : 'hint'}>{helperText}</FormHelperText>
      ) : null}
    </Field.Root>
  );
}

export interface ChoiceGroupProps {
  /** Überschrift der Gruppe (`<legend>`, Figma: Form Label). */
  label?: ReactNode;
  /** Pflichtfeld: „*“ an der Überschrift. */
  required?: boolean;
  /** Hinweistext unter der Gruppe. Bei `status="error"` als Fehlertext. */
  helperText?: ReactNode;
  /** Validierungsstatus (Figma: `_State` Error). */
  status?: 'error';
  /** Ganze Gruppe deaktiviert. */
  disabled?: boolean;
  /** Anordnung der Optionen. @default 'vertical' */
  orientation?: 'vertical' | 'horizontal';
  /** Name fürs Formular. */
  name?: string;
  children: ReactNode;
  className?: string;
}

/** Hülle für CheckboxGroup / RadioGroup: Field + Fieldset + Legende + Hinweis. */
export function ChoiceGroupShell({
  label,
  required,
  helperText,
  status,
  disabled,
  orientation = 'vertical',
  name,
  children,
  className,
  group,
}: ChoiceGroupProps & { group: ReactElement }) {
  const invalid = status === 'error';
  return (
    <ChoiceGroupContext.Provider value={{ invalid }}>
      <Field.Root name={name} invalid={invalid} disabled={disabled} className="flex flex-col gap-1">
        <Fieldset.Root render={group} className={cn('flex flex-col gap-1', className)}>
          {label ? (
            <Fieldset.Legend data-error={invalid ? '' : undefined} className={formLabelClasses}>
              {label}
              {required ? (
                <span aria-hidden className="text-(color:--dx-form-label-mandatory-color)">
                  *
                </span>
              ) : null}
            </Fieldset.Legend>
          ) : null}
          <div
            className={cn(
              'flex',
              orientation === 'horizontal' ? 'flex-row flex-wrap gap-x-4' : 'flex-col',
            )}
          >
            {children}
          </div>
        </Fieldset.Root>
        {helperText ? (
          <FormHelperText type={invalid ? 'error' : 'hint'}>{helperText}</FormHelperText>
        ) : null}
      </Field.Root>
    </ChoiceGroupContext.Provider>
  );
}
