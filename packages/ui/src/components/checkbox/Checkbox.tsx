import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { CheckboxGroup as BaseCheckboxGroup } from '@base-ui/react/checkbox-group';
import { CheckIcon, MinusIcon } from '@dextinity/icons';
import type { CSSProperties, ReactNode } from 'react';
import {
  ChoiceField,
  ChoiceGroupShell,
  useChoiceGroup,
  type ChoiceGroupProps,
} from '../../lib/choice';

export interface CheckboxProps extends Omit<
  BaseCheckbox.Root.Props,
  'className' | 'style' | 'children' | 'render'
> {
  /** Figma: Children — das Label. Ohne Label → `aria-label` setzen. */
  children?: ReactNode;
  /** Figma: Checked = Indeterminate (z.B. „alle auswählen“, teilweise ausgewählt). */
  indeterminate?: boolean;
  /** Figma: Disabled. */
  disabled?: boolean;
  /** Figma: `_State` Read-only. */
  readOnly?: boolean;
  /** Figma: `_State` Error. In einer `CheckboxGroup` über die Gruppe setzen. */
  status?: 'error';
  /** Hinweistext unter der Checkbox (nur ohne Gruppe). */
  helperText?: ReactNode;
  className?: string;
}

type Part = 'background' | 'border' | 'check';
const v = (checked: boolean, state: string, part: Part) =>
  `var(--dx-checkbox-${checked ? 'checked' : 'unchecked'}-${state}-${part})`;

/** Component-Tokens `checkbox/{checked|unchecked}/{state}/{part}` → lokale Variablen. */
function boxVars(s: BaseCheckbox.Root.State, invalid: boolean): CSSProperties {
  const on = s.checked || s.indeterminate;
  const state = s.disabled
    ? 'disabled'
    : s.readOnly
      ? 'read-only'
      : invalid || s.valid === false
        ? 'error'
        : 'default';
  const hover = state === 'default' ? 'hover' : state;
  return {
    '--cb-bg': v(on, state, 'background'),
    '--cb-border': v(on, state, 'border'),
    '--cb-bg-hover': v(on, hover, 'background'),
    '--cb-border-hover': v(on, hover, 'border'),
    '--cb-check': on ? v(on, state, 'check') : 'transparent',
  } as CSSProperties;
}

const box = [
  'inline-flex shrink-0 items-center justify-center',
  'size-(--dx-checkbox-size) rounded-(--dx-checkbox-radius) border-solid border-(length:--dx-checkbox-border-width)',
  'bg-(--cb-bg) border-(color:--cb-border) text-(color:--cb-check)',
  'hover:bg-(--cb-bg-hover) hover:border-(color:--cb-border-hover) group-hover/choice:bg-(--cb-bg-hover) group-hover/choice:border-(color:--cb-border-hover)',
  'transition-colors duration-(--dx-primitive-motion-duration-sm) ease-standard',
  'cursor-pointer data-disabled:cursor-not-allowed data-readonly:cursor-default',
  '[&_svg]:size-(--dx-checkbox-icon-size)',
].join(' ');

/**
 * Checkbox — Figma: `03 Components / Form – Checkbox`.
 *
 * ```tsx
 * <Checkbox defaultChecked>Newsletter abonnieren</Checkbox>
 * <Checkbox status="error" helperText="Bitte bestätigen." required>AGB akzeptieren</Checkbox>
 * <CheckboxGroup label="Benachrichtigungen" defaultValue={['mail']}>
 *   <Checkbox value="mail">E-Mail</Checkbox>
 *   <Checkbox value="push">Push</Checkbox>
 * </CheckboxGroup>
 * ```
 */
export function Checkbox({
  children,
  indeterminate = false,
  disabled = false,
  readOnly = false,
  status,
  helperText,
  className,
  ...props
}: CheckboxProps) {
  const group = useChoiceGroup();
  const invalid = status === 'error' || Boolean(group?.invalid);
  return (
    <ChoiceField
      kind="checkbox"
      label={children}
      disabled={disabled}
      invalid={invalid}
      helperText={helperText}
      className={className}
      control={
        <BaseCheckbox.Root
          {...props}
          indeterminate={indeterminate}
          disabled={disabled}
          readOnly={readOnly}
          style={(s) => boxVars(s, invalid)}
          className={box}
        >
          <BaseCheckbox.Indicator
            render={(indicatorProps, s) => (
              <span {...indicatorProps} className="inline-flex">
                {s.indeterminate ? <MinusIcon /> : <CheckIcon />}
              </span>
            )}
          />
        </BaseCheckbox.Root>
      }
    />
  );
}

export interface CheckboxGroupProps extends ChoiceGroupProps {
  /** Ausgewählte Werte (kontrolliert). */
  value?: string[];
  /** Anfangs ausgewählte Werte. */
  defaultValue?: string[];
  /** Wird bei jeder Änderung mit allen ausgewählten Werten aufgerufen. */
  onValueChange?: (value: string[]) => void;
  /** Alle möglichen Werte — nötig für eine „Alle auswählen“-Checkbox mit `parent`. */
  allValues?: string[];
}

/** Mehrere Checkboxen mit gemeinsamer Überschrift (`<fieldset>` + `<legend>`) und Hinweis. */
export function CheckboxGroup({
  value,
  defaultValue,
  onValueChange,
  allValues,
  disabled,
  ...shell
}: CheckboxGroupProps) {
  return (
    <ChoiceGroupShell
      {...shell}
      disabled={disabled}
      group={
        <BaseCheckboxGroup
          value={value}
          defaultValue={defaultValue}
          onValueChange={onValueChange ? (next) => onValueChange(next) : undefined}
          allValues={allValues}
          disabled={disabled}
        />
      }
    />
  );
}
