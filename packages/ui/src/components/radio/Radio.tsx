import { Radio as BaseRadio } from '@base-ui/react/radio';
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import type { CSSProperties, ReactNode } from 'react';
import {
  ChoiceField,
  ChoiceGroupShell,
  useChoiceGroup,
  type ChoiceGroupProps,
} from '../../lib/choice';

export interface RadioProps extends Omit<
  BaseRadio.Root.Props,
  'className' | 'style' | 'children' | 'render'
> {
  /** Wert dieser Option in der `RadioGroup`. */
  value: string;
  /** Figma: Children — das Label. Ohne Label → `aria-label` setzen. */
  children?: ReactNode;
  /** Figma: Disabled (einzelne Option). */
  disabled?: boolean;
  className?: string;
}

type Part = 'background' | 'border' | 'dot';
const v = (checked: boolean, state: string, part: Part) =>
  `var(--dx-radio-button-${checked ? 'checked' : 'unchecked'}-${state}-${part})`;

/** Component-Tokens `radio-button/{checked|unchecked}/{state}/{part}` → lokale Variablen. */
function radioVars(s: BaseRadio.Root.State, invalid: boolean): CSSProperties {
  const state = s.disabled
    ? 'disabled'
    : s.readOnly
      ? 'read-only'
      : invalid || s.valid === false
        ? 'error'
        : 'default';
  const hover = state === 'default' ? 'hover' : state;
  return {
    '--rb-bg': v(s.checked, state, 'background'),
    '--rb-border': v(s.checked, state, 'border'),
    '--rb-bg-hover': v(s.checked, hover, 'background'),
    '--rb-border-hover': v(s.checked, hover, 'border'),
    '--rb-dot': s.checked ? v(true, state, 'dot') : 'transparent',
    '--rb-dot-hover': s.checked ? v(true, hover, 'dot') : 'transparent',
  } as CSSProperties;
}

const circle = [
  'group/radio inline-flex shrink-0 items-center justify-center rounded-full',
  'size-(--dx-radio-button-size) border-solid border-(length:--dx-radio-button-border-width)',
  'bg-(--rb-bg) border-(color:--rb-border) text-(color:--rb-dot)',
  'hover:bg-(--rb-bg-hover) hover:border-(color:--rb-border-hover) hover:text-(color:--rb-dot-hover)',
  'group-hover/choice:bg-(--rb-bg-hover) group-hover/choice:border-(color:--rb-border-hover) group-hover/choice:text-(color:--rb-dot-hover)',
  'transition-colors duration-(--dx-primitive-motion-duration-sm) ease-standard',
  'cursor-pointer data-disabled:cursor-not-allowed data-readonly:cursor-default',
].join(' ');

/**
 * Radio Button — Figma: `03 Components / Form – Radiobutton`. Immer in einer `RadioGroup`.
 *
 * ```tsx
 * <RadioGroup label="Sichtbarkeit" defaultValue="team">
 *   <Radio value="private">Nur ich</Radio>
 *   <Radio value="team">Mein Team</Radio>
 *   <Radio value="all">Alle</Radio>
 * </RadioGroup>
 * ```
 */
export function Radio({ children, disabled = false, className, ...props }: RadioProps) {
  const group = useChoiceGroup();
  const invalid = Boolean(group?.invalid);
  return (
    <ChoiceField
      kind="radio-button"
      label={children}
      disabled={disabled}
      invalid={invalid}
      className={className}
      control={
        <BaseRadio.Root
          {...props}
          disabled={disabled}
          style={(s) => radioVars(s, invalid)}
          className={circle}
        >
          <BaseRadio.Indicator className="size-(--dx-radio-button-dot-size) rounded-full bg-current" />
        </BaseRadio.Root>
      }
    />
  );
}

export interface RadioGroupProps extends ChoiceGroupProps {
  /** Ausgewählter Wert (kontrolliert). */
  value?: string;
  /** Anfangs ausgewählter Wert. */
  defaultValue?: string;
  /** Wird bei Auswahl mit dem neuen Wert aufgerufen. */
  onValueChange?: (value: string) => void;
  /** Figma: `_State` Read-only — Auswahl sichtbar, aber nicht änderbar. */
  readOnly?: boolean;
}

/** Radio Buttons mit gemeinsamer Überschrift (`<fieldset>` + `<legend>`) und Hinweis. */
export function RadioGroup({
  value,
  defaultValue,
  onValueChange,
  readOnly,
  disabled,
  required,
  name,
  ...shell
}: RadioGroupProps) {
  return (
    <ChoiceGroupShell
      {...shell}
      required={required}
      disabled={disabled}
      group={
        <BaseRadioGroup
          value={value}
          defaultValue={defaultValue}
          onValueChange={onValueChange ? (next) => onValueChange(next as string) : undefined}
          readOnly={readOnly}
          disabled={disabled}
          required={required}
          name={name}
        />
      }
    />
  );
}
