import { Select as BaseSelect } from '@base-ui/react/select';
import { CheckIcon, ChevronDownIcon } from '@dextinity/icons';
import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { FieldShell, useFieldLayout, type FieldLayout } from '../../lib/field-shell';
import { FormHelperText } from '../form-helper-text';
import { formLabelClasses } from '../form-label/FormLabel';
import { Spinner } from '../spinner';

export type SelectStatus = 'error' | 'success' | 'warning';

export interface SelectOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface SelectProps {
  /** Die Optionen (Figma: Select Option). */
  options: SelectOption[];
  /** Ausgewählter Wert (kontrolliert). `null` = nichts ausgewählt. */
  value?: string | null;
  /** Anfangs ausgewählter Wert. */
  defaultValue?: string | null;
  /** Wird bei Auswahl mit dem neuen Wert aufgerufen. */
  onValueChange?: (value: string | null) => void;
  /** Text, solange nichts ausgewählt ist. @default 'Auswählen …' */
  placeholder?: ReactNode;
  /** Sichtbares Label (Figma: Form Label). Ohne Label → `aria-label` setzen. */
  label?: ReactNode;
  'aria-label'?: string;
  /** Pflichtfeld: „*“ am Label. */
  required?: boolean;
  /** Hinweistext unter dem Feld (Figma: Helper Text). Bei `status="error"` als Fehlertext. */
  helperText?: ReactNode;
  /** Validierungsstatus (Figma: `_State` Error/Success/Warning). */
  status?: SelectStatus;
  /** Figma: Disabled. */
  disabled?: boolean;
  /** Figma: `_State` Read-only — Wert sichtbar, Menü öffnet nicht. */
  readOnly?: boolean;
  /** Figma: Loading — Spinner neben dem Pfeil, `aria-busy`. */
  loading?: boolean;
  /** Figma: Form Layout 1 Col (`stacked`) / 2 Cols (`inline`). Standard: vom `<Form>`, sonst `stacked`. */
  layout?: FieldLayout;
  /** Name fürs Formular. */
  name?: string;
  /** Klassen für das Feld (Trigger). */
  className?: string;
  /** Klassen für den äußeren Wrapper (Label + Feld + Helper). */
  wrapperClassName?: string;
}

const trigger = [
  'flex w-full items-center font-sans text-left select-none transition-colors duration-(--dx-primitive-motion-duration-sm) ease-standard',
  'h-(--dx-select-height) px-(--dx-select-padding-horizontal) gap-(--dx-select-gap)',
  'rounded-(--dx-select-radius) border-solid border-(length:--dx-select-border-width)',
  '[font-size:var(--dx-select-font-size)] [line-height:var(--dx-select-font-line-height)] [font-weight:var(--dx-select-font-weight)]',
  'bg-(--dx-select-state-default-background) text-(color:--dx-select-state-default-foreground) border-(color:--dx-select-state-default-border)',
  'not-data-disabled:not-data-readonly:not-data-status:hover:border-(color:--dx-select-state-hover-border)',
  'not-data-status:focus-visible:border-(color:--dx-select-state-focus-border) not-data-status:data-popup-open:border-(color:--dx-select-state-focus-border)',
  'data-[status=error]:border-(color:--dx-select-state-error-border)',
  'data-[status=success]:border-(color:--dx-select-state-success-border)',
  'data-[status=warning]:border-(color:--dx-select-state-warning-border)',
  'data-readonly:bg-(--dx-select-state-read-only-background) data-readonly:border-(color:--dx-select-state-read-only-border)',
  'data-disabled:cursor-not-allowed data-disabled:bg-(--dx-select-state-disabled-background) data-disabled:border-(color:--dx-select-state-disabled-border) data-disabled:text-(color:--dx-select-state-disabled-foreground)',
  'cursor-pointer data-readonly:cursor-default',
].join(' ');

const icon = 'inline-flex shrink-0 [&_svg]:size-(--dx-select-icon-size)';

const popup = [
  'min-w-(--anchor-width) max-h-(--available-height) overflow-y-auto font-sans outline-none',
  'rounded-(--dx-select-menu-radius) border border-solid border-(color:--dx-select-menu-border) bg-(--dx-select-menu-background) shadow-md',
  'p-(--dx-select-menu-padding) flex flex-col gap-(--dx-select-menu-gap)',
  'origin-(--transform-origin) transition-[opacity,scale] duration-(--dx-primitive-motion-duration-sm) ease-standard data-starting-style:scale-98 data-starting-style:opacity-0 data-ending-style:scale-98 data-ending-style:opacity-0',
].join(' ');

const item = [
  'flex items-center justify-between cursor-pointer select-none outline-none',
  'min-h-(--dx-select-option-height) px-(--dx-select-option-padding-horizontal) gap-(--dx-select-option-gap) rounded-(--dx-select-option-radius)',
  '[font-size:var(--dx-select-font-size)] [line-height:var(--dx-select-font-line-height)]',
  'bg-(--dx-select-option-state-default-background) text-(color:--dx-select-option-state-default-foreground)',
  'data-highlighted:bg-(--dx-select-option-state-hover-background) data-highlighted:text-(color:--dx-select-option-state-hover-foreground)',
  'data-selected:bg-(--dx-select-option-state-selected-background) data-selected:text-(color:--dx-select-option-state-selected-foreground)',
  'data-disabled:cursor-not-allowed data-disabled:bg-(--dx-select-option-state-disabled-background) data-disabled:text-(color:--dx-select-option-state-disabled-foreground)',
].join(' ');

/**
 * Select — Figma: `03 Components / Form – Select` (+ Select Menu, Select Option).
 * Auswahl aus einer Liste; Tastatur: Pfeiltasten, Enter, Tippen springt zum Eintrag.
 *
 * ```tsx
 * <Select
 *   label="Rolle"
 *   placeholder="Rolle wählen"
 *   options={[
 *     { value: 'admin', label: 'Admin' },
 *     { value: 'editor', label: 'Redakteur:in' },
 *   ]}
 *   onValueChange={setRole}
 * />
 * ```
 */
export function Select({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = 'Auswählen …',
  label,
  'aria-label': ariaLabel,
  required,
  helperText,
  status,
  disabled = false,
  readOnly = false,
  loading = false,
  layout,
  name,
  className,
  wrapperClassName,
}: SelectProps) {
  const isError = status === 'error';
  return (
    <BaseSelect.Root
      items={options.map((o) => ({ value: o.value, label: o.label }))}
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange ? (next) => onValueChange(next as string | null) : undefined}
      disabled={disabled}
      readOnly={readOnly}
      // Read-only: Wert sichtbar, Menü bleibt zu
      open={readOnly ? false : undefined}
      required={required}
      name={name}
    >
      <FieldShell
        layout={useFieldLayout(layout)}
        invalid={isError}
        disabled={disabled}
        className={wrapperClassName}
        label={
          label ? (
            <BaseSelect.Label
              data-error={isError ? '' : undefined}
              className={cn(formLabelClasses, 'cursor-default')}
            >
              {label}
              {required ? (
                <span aria-hidden className="text-(color:--dx-form-label-mandatory-color)">
                  *
                </span>
              ) : null}
            </BaseSelect.Label>
          ) : undefined
        }
        control={
          <BaseSelect.Trigger
            aria-label={ariaLabel}
            aria-busy={loading || undefined}
            data-status={status}
            data-readonly={readOnly ? '' : undefined}
            className={cn(trigger, className)}
          >
            <BaseSelect.Value
              placeholder={placeholder}
              className="min-w-0 flex-1 truncate data-placeholder:text-(color:--dx-select-state-default-foreground-placeholder)"
            />
            {loading ? (
              <span className={cn(icon, 'text-(color:--dx-select-state-loading-spinner)')}>
                <Spinner />
              </span>
            ) : null}
            <BaseSelect.Icon
              className={cn(
                icon,
                disabled
                  ? 'text-(color:--dx-select-chevron-color-disabled)'
                  : 'text-(color:--dx-select-chevron-color)',
              )}
            >
              <ChevronDownIcon />
            </BaseSelect.Icon>
          </BaseSelect.Trigger>
        }
        helper={
          helperText ? (
            <FormHelperText type={isError ? 'error' : 'hint'}>{helperText}</FormHelperText>
          ) : undefined
        }
      />
      <BaseSelect.Portal>
        <BaseSelect.Positioner
          sideOffset={4}
          alignItemWithTrigger={false}
          className="z-50 outline-none"
        >
          <BaseSelect.Popup className={popup}>
            <BaseSelect.List className="flex flex-col gap-(--dx-select-menu-gap)">
              {options.map((o) => (
                <BaseSelect.Item
                  key={o.value}
                  value={o.value}
                  disabled={o.disabled}
                  className={item}
                >
                  <BaseSelect.ItemText className="min-w-0 truncate">{o.label}</BaseSelect.ItemText>
                  <BaseSelect.ItemIndicator className="inline-flex shrink-0 text-(color:--dx-select-option-state-selected-check) [&_svg]:size-(--dx-select-icon-size)">
                    <CheckIcon />
                  </BaseSelect.ItemIndicator>
                </BaseSelect.Item>
              ))}
            </BaseSelect.List>
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  );
}
