import { Field } from '@base-ui/react/field';
import { createContext, useContext, type ReactNode } from 'react';
import { cn } from './cn';

/**
 * Figma: `Form Layout 1 Col` (= `stacked`, Label über dem Feld) und `Form Layout 2 Cols` (= `inline`,
 * Label links, Feld rechts). Unter 768px wird `inline` automatisch zu `stacked`.
 */
export type FieldLayout = 'stacked' | 'inline';

const FormLayoutContext = createContext<FieldLayout | undefined>(undefined);
export const FormLayoutProvider = FormLayoutContext.Provider;

/** Layout eines Felds: eigene Prop > umgebendes `<Form layout>` > `stacked`. */
export function useFieldLayout(layout?: FieldLayout): FieldLayout {
  const fromForm = useContext(FormLayoutContext);
  return layout ?? fromForm ?? 'stacked';
}

export interface FieldShellProps {
  layout: FieldLayout;
  /** Fertiges Label (FormLabel, Select.Label …). */
  label?: ReactNode;
  control: ReactNode;
  helper?: ReactNode;
  invalid?: boolean;
  disabled?: boolean;
  name?: string;
  /** Höhe der ersten Zeile, an der das Label im `inline`-Layout mittig steht. @default 'field' (40px) */
  labelAlign?: 'field' | 'choice';
  className?: string;
}

/** Field.Root + Anordnung von Label, Feld und Hinweis (Figma: Form Layout). */
export function FieldShell({
  layout,
  label,
  control,
  helper,
  invalid,
  disabled,
  name,
  labelAlign = 'field',
  className,
}: FieldShellProps) {
  const inline = layout === 'inline';
  return (
    <Field.Root
      name={name}
      invalid={invalid}
      disabled={disabled}
      data-layout={layout}
      className={cn(
        'w-full',
        inline
          ? 'grid grid-cols-[var(--dx-form-label-width,200px)_minmax(0,1fr)] items-start gap-x-(--dx-primitive-unit-5) gap-y-(--dx-primitive-unit-1) max-md:grid-cols-1'
          : 'flex flex-col gap-(--dx-primitive-unit-1)',
        className,
      )}
    >
      {inline ? (
        // Label vertikal mittig zur ersten Zeile (Feld 40px bzw. Checkbox/Radio/Switch 24px)
        <div
          className={cn(
            'flex items-center max-md:min-h-0',
            labelAlign === 'choice'
              ? 'min-h-(--dx-switch-touch-target)'
              : 'min-h-(--dx-input-height)',
          )}
        >
          {label ?? null}
        </div>
      ) : (
        label
      )}
      {control}
      {helper ? (
        <div className={inline ? 'col-start-2 max-md:col-start-1' : undefined}>{helper}</div>
      ) : null}
    </Field.Root>
  );
}
