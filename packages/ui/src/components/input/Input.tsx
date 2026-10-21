import { Field } from '@base-ui/react/field';
import { Input as BaseInput } from '@base-ui/react/input';
import { useState, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { FormHelperText } from '../form-helper-text';
import { FormLabel } from '../form-label';
import { Spinner } from '../spinner';

export type InputStatus = 'error' | 'success' | 'warning';

export interface InputProps extends Omit<BaseInput.Props, 'className' | 'size' | 'children'> {
  /** Sichtbares Label (Figma: Form Label). Ohne Label → `aria-label` setzen. */
  label?: ReactNode;
  /** Pflichtfeld: „*“ am Label + `required` am Input. */
  required?: boolean;
  /** Hinweistext unter dem Feld (Figma: Helper Text). Bei `status="error"` als Fehlertext. */
  helperText?: ReactNode;
  /** Validierungsstatus (Figma: `_State` Error/Success/Warning). */
  status?: InputStatus;
  /** Figma: Disabled. */
  disabled?: boolean;
  /** Figma: `_State` Read-only. Fokussierbar, aber nicht änderbar. */
  readOnly?: boolean;
  /** Figma: Loading — Spinner ersetzt das End-Adornment, `aria-busy`. */
  loading?: boolean;
  /** Figma: Start Adornment — Icon, Währung, fixer Text. */
  startAdornment?: ReactNode;
  /** Figma: End Adornment — Einheit, Icon, IconButton. */
  endAdornment?: ReactNode;
  /** Zeichenzähler unter dem Feld (braucht `maxLength`). Figma: Helper Text › Count. */
  showCount?: boolean;
  /** Klassen für den Feld-Container (Rahmen). */
  className?: string;
  /** Klassen für den äußeren Wrapper (Label + Feld + Helper). */
  wrapperClassName?: string;
}

const container = [
  'flex w-full items-center font-sans transition-colors duration-(--dx-primitive-motion-duration-sm) ease-standard',
  'h-(--dx-input-height) px-(--dx-input-padding-horizontal) py-(--dx-input-padding-vertical) gap-(--dx-input-gap)',
  'rounded-(--dx-input-radius) border-solid border-(length:--dx-input-border-width)',
  'bg-(--dx-input-state-default-background) text-(color:--dx-input-state-default-foreground) border-(color:--dx-input-state-default-border)',
  // Hover / Fokus (nur interaktiv, ohne Status)
  'not-data-disabled:not-data-readonly:not-data-status:hover:border-(color:--dx-input-state-hover-border)',
  'not-data-status:focus-within:border-(color:--dx-input-state-focus-border)',
  'focus-within:outline-solid focus-within:outline-(length:--dx-focus-ring-width) focus-within:outline-offset-(--dx-focus-ring-offset) focus-within:outline-border-focus',
  // Status
  'data-[status=error]:border-(color:--dx-input-state-error-border)',
  'data-[status=success]:border-(color:--dx-input-state-success-border)',
  'data-[status=warning]:border-(color:--dx-input-state-warning-border)',
  'data-loading:border-(color:--dx-input-state-loading-border)',
  // Read-only / Disabled
  'data-readonly:bg-(--dx-input-state-read-only-background) data-readonly:border-(color:--dx-input-state-read-only-border)',
  'data-disabled:cursor-not-allowed data-disabled:bg-(--dx-input-state-disabled-background) data-disabled:border-(color:--dx-input-state-disabled-border) data-disabled:text-(color:--dx-input-state-disabled-foreground)',
].join(' ');

const field = [
  'min-w-0 flex-1 bg-transparent text-inherit focus-visible:outline-none',
  '[font-size:var(--dx-input-font-size)] [line-height:var(--dx-input-font-line-height)] [font-weight:var(--dx-input-font-weight)]',
  'placeholder:text-(color:--dx-input-state-default-foreground-placeholder)',
  'disabled:cursor-not-allowed disabled:placeholder:text-(color:--dx-input-state-disabled-foreground-placeholder)',
].join(' ');

const adornment =
  'inline-flex shrink-0 items-center text-(color:--dx-input-adornment-foreground) [&_svg]:size-(--dx-input-icon-size)';

/**
 * Input — Figma: `03 Components / Form – Input` (+ Form Label, Form Helper Text).
 *
 * ```tsx
 * <Input label="E-Mail" type="email" required helperText="Wir schicken dir einen Link." />
 * <Input label="Betrag" startAdornment="€" endAdornment="netto" />
 * <Input label="Name" status="error" helperText="Bitte ausfüllen." />
 * <Input aria-label="Suche" startAdornment={<SearchIcon />} />
 * ```
 */
export function Input({
  label,
  required,
  helperText,
  status,
  disabled = false,
  readOnly = false,
  loading = false,
  startAdornment,
  endAdornment,
  showCount = false,
  maxLength,
  className,
  wrapperClassName,
  value,
  defaultValue,
  onChange,
  ...props
}: InputProps) {
  const isControlled = value !== undefined;
  const [innerLength, setInnerLength] = useState(String(defaultValue ?? '').length);
  const length = isControlled ? String(value ?? '').length : innerLength;
  const count = showCount && maxLength ? { current: length, max: maxLength } : undefined;
  const isError = status === 'error';

  return (
    <Field.Root
      invalid={isError}
      disabled={disabled}
      className={cn('flex w-full flex-col gap-1', wrapperClassName)}
    >
      {label ? (
        <FormLabel mandatory={required} error={isError}>
          {label}
        </FormLabel>
      ) : null}
      <div
        className={cn(container, className)}
        data-status={status}
        data-disabled={disabled ? '' : undefined}
        data-readonly={readOnly ? '' : undefined}
        data-loading={loading ? '' : undefined}
      >
        {startAdornment ? <span className={adornment}>{startAdornment}</span> : null}
        <BaseInput
          {...props}
          value={value}
          defaultValue={defaultValue}
          maxLength={maxLength}
          required={required}
          readOnly={readOnly}
          aria-busy={loading || undefined}
          onChange={(event) => {
            if (!isControlled) setInnerLength(event.target.value.length);
            onChange?.(event);
          }}
          className={field}
        />
        {loading ? (
          <span className={cn(adornment, 'text-(color:--dx-input-state-loading-spinner)')}>
            <Spinner />
          </span>
        ) : endAdornment ? (
          <span className={adornment}>{endAdornment}</span>
        ) : null}
      </div>
      {helperText || count ? (
        <FormHelperText type={isError ? 'error' : 'hint'} count={count}>
          {helperText}
        </FormHelperText>
      ) : null}
    </Field.Root>
  );
}
