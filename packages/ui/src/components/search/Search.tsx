import { Input as BaseInput } from '@base-ui/react/input';
import { ClearIcon, SearchIcon } from '@dextinity/icons';
import { useRef, useState, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { FieldShell, useFieldLayout, type FieldLayout } from '../../lib/field-shell';
import { FormHelperText } from '../form-helper-text';
import { FormLabel } from '../form-label';
import { Spinner } from '../spinner';

export interface SearchProps extends Omit<
  BaseInput.Props,
  'className' | 'size' | 'children' | 'value' | 'defaultValue' | 'type'
> {
  /** Suchbegriff (kontrolliert). */
  value?: string;
  /** Anfangs-Suchbegriff. */
  defaultValue?: string;
  /** Wird bei jeder Eingabe und beim Leeren mit dem neuen Begriff aufgerufen. */
  onValueChange?: (value: string) => void;
  /** Figma: Children (Platzhalter). @default 'Suchen' */
  placeholder?: string;
  /** Optionales sichtbares Label. Sonst `aria-label` (Standard: Platzhalter). */
  label?: ReactNode;
  /** Figma: Helper Text. */
  helperText?: ReactNode;
  /** Figma: Disabled. */
  disabled?: boolean;
  /** Figma: Loading — Spinner, `aria-busy` (z.B. während Ergebnisse laden). */
  loading?: boolean;
  /** Zugänglicher Name des Leeren-Buttons. @default 'Suche leeren' */
  clearLabel?: string;
  /** Figma: Form Layout 1 Col (`stacked`) / 2 Cols (`inline`). */
  layout?: FieldLayout;
  className?: string;
  wrapperClassName?: string;
}

const container = [
  'flex w-full items-center font-sans transition-colors duration-(--dx-primitive-motion-duration-sm) ease-standard',
  'h-(--dx-search-height) px-(--dx-search-padding-horizontal) gap-(--dx-search-gap)',
  'rounded-(--dx-search-radius) border-solid border-(length:--dx-search-border-width)',
  'bg-(--dx-search-state-default-background) text-(color:--dx-search-state-default-foreground) border-(color:--dx-search-state-default-border)',
  'not-data-disabled:hover:border-(color:--dx-search-state-hover-border)',
  'focus-within:border-(color:--dx-search-state-focus-border)',
  'focus-within:outline-solid focus-within:outline-(length:--dx-focus-ring-width) focus-within:outline-offset-(--dx-focus-ring-offset) focus-within:outline-border-focus',
  'data-disabled:cursor-not-allowed data-disabled:bg-(--dx-search-state-disabled-background) data-disabled:border-(color:--dx-search-state-disabled-border) data-disabled:text-(color:--dx-search-state-disabled-foreground)',
].join(' ');

const field = [
  'min-w-0 flex-1 bg-transparent text-inherit focus-visible:outline-none [&::-webkit-search-cancel-button]:appearance-none',
  '[font-size:var(--dx-search-font-size)] [line-height:var(--dx-search-font-line-height)] [font-weight:var(--dx-search-font-weight)]',
  'placeholder:text-(color:--dx-search-state-default-foreground-placeholder)',
  'disabled:cursor-not-allowed disabled:placeholder:text-(color:--dx-search-state-disabled-foreground-placeholder)',
].join(' ');

const icon = 'inline-flex shrink-0 [&_svg]:size-(--dx-search-icon-size)';

/**
 * Search — Figma: `03 Components / Form – Search`. Suchfeld mit Lupe, Leeren-Button (sobald Text da ist)
 * und Loading. Escape leert das Feld.
 *
 * ```tsx
 * <Search placeholder="Benutzer suchen" value={query} onValueChange={setQuery} />
 * <Search loading={isFetching} onValueChange={search} helperText="Name oder E-Mail" />
 * ```
 */
export function Search({
  value,
  defaultValue = '',
  onValueChange,
  placeholder = 'Suchen',
  label,
  helperText,
  disabled = false,
  loading = false,
  clearLabel = 'Suche leeren',
  layout,
  className,
  wrapperClassName,
  onKeyDown,
  'aria-label': ariaLabel,
  ...props
}: SearchProps) {
  const isControlled = value !== undefined;
  const [inner, setInner] = useState(defaultValue);
  const current = isControlled ? value : inner;
  const inputRef = useRef<HTMLInputElement>(null);

  const update = (next: string) => {
    if (!isControlled) setInner(next);
    onValueChange?.(next);
  };

  return (
    <FieldShell
      layout={useFieldLayout(layout)}
      disabled={disabled}
      className={wrapperClassName}
      label={label ? <FormLabel>{label}</FormLabel> : undefined}
      control={
        <div
          className={cn(container, className)}
          data-disabled={disabled ? '' : undefined}
          data-loading={loading ? '' : undefined}
        >
          <span aria-hidden className={cn(icon, 'text-(color:--dx-search-search-icon-color)')}>
            <SearchIcon />
          </span>
          <BaseInput
            {...props}
            ref={inputRef}
            type="search"
            value={current}
            placeholder={placeholder}
            aria-label={label ? ariaLabel : (ariaLabel ?? placeholder)}
            aria-busy={loading || undefined}
            onChange={(event) => update(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape' && current) {
                event.preventDefault();
                update('');
              }
              onKeyDown?.(event);
            }}
            className={field}
          />
          {current && !disabled ? (
            <button
              type="button"
              aria-label={clearLabel}
              onClick={() => {
                update('');
                inputRef.current?.focus();
              }}
              className={cn(
                icon,
                'size-(--dx-search-clear-hit-area) cursor-pointer items-center justify-center rounded-full text-(color:--dx-search-clear-color)',
              )}
            >
              <ClearIcon />
            </button>
          ) : null}
          {loading ? (
            <span className={cn(icon, 'text-(color:--dx-search-state-loading-spinner)')}>
              <Spinner />
            </span>
          ) : null}
        </div>
      }
      helper={helperText ? <FormHelperText>{helperText}</FormHelperText> : undefined}
    />
  );
}
