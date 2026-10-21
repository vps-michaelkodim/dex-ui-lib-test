import { Switch as BaseSwitch } from '@base-ui/react/switch';
import type { CSSProperties, ReactNode } from 'react';
import { ChoiceField } from '../../lib/choice';

export interface SwitchProps extends Omit<
  BaseSwitch.Root.Props,
  'className' | 'style' | 'children' | 'render'
> {
  /** Figma: Children — das Label. Ohne Label → `aria-label` setzen. */
  children?: ReactNode;
  /** Figma: On (kontrolliert). */
  checked?: boolean;
  /** Figma: On (Startwert). */
  defaultChecked?: boolean;
  /** Figma: Disabled. */
  disabled?: boolean;
  /** Figma: `_State` Read-only. */
  readOnly?: boolean;
  /** Hinweistext unter dem Switch. */
  helperText?: ReactNode;
  className?: string;
}

const v = (on: boolean, state: string, part: 'track' | 'thumb') =>
  `var(--dx-switch-${on ? 'on' : 'off'}-${state}-${part})`;

/** Component-Tokens `switch/{on|off}/{state}/{track|thumb}` → lokale Variablen. */
function switchVars(s: BaseSwitch.Root.State): CSSProperties {
  const state = s.disabled ? 'disabled' : s.readOnly ? 'read-only' : 'default';
  const hover = state === 'default' ? 'hover' : state;
  return {
    '--sw-track': v(s.checked, state, 'track'),
    '--sw-thumb': v(s.checked, state, 'thumb'),
    '--sw-track-hover': v(s.checked, hover, 'track'),
    '--sw-thumb-hover': v(s.checked, hover, 'thumb'),
  } as CSSProperties;
}

const track = [
  'inline-flex shrink-0 items-center',
  'w-(--dx-switch-track-width) h-(--dx-switch-track-height) rounded-(--dx-switch-radius) p-(--dx-switch-thumb-inset)',
  'bg-(--sw-track) hover:bg-(--sw-track-hover) group-hover/choice:bg-(--sw-track-hover)',
  'transition-colors duration-(--dx-primitive-motion-duration-sm) ease-standard',
  'cursor-pointer data-disabled:cursor-not-allowed data-readonly:cursor-default',
].join(' ');

const thumb = [
  'block size-(--dx-switch-thumb-size) rounded-(--dx-switch-radius) shadow-xs',
  'bg-(--sw-thumb) group-hover/choice:bg-(--sw-thumb-hover)',
  'transition-transform duration-(--dx-primitive-motion-duration-sm) ease-standard',
  'data-checked:translate-x-[calc(var(--dx-switch-track-width)_-_var(--dx-switch-thumb-size)_-_2_*_var(--dx-switch-thumb-inset))]',
].join(' ');

/**
 * Switch — Figma: `03 Components / Form – Switch`. Für Einstellungen, die sofort wirken.
 * In Formularen mit „Speichern“ lieber `Checkbox`.
 *
 * ```tsx
 * <Switch defaultChecked>Benachrichtigungen</Switch>
 * <Switch checked={dark} onCheckedChange={setDark}>Dunkles Design</Switch>
 * ```
 */
export function Switch({
  children,
  disabled = false,
  readOnly = false,
  helperText,
  className,
  ...props
}: SwitchProps) {
  return (
    <ChoiceField
      kind="switch"
      label={children}
      disabled={disabled}
      invalid={false}
      helperText={helperText}
      className={className}
      control={
        <BaseSwitch.Root
          {...props}
          disabled={disabled}
          readOnly={readOnly}
          style={switchVars}
          className={track}
        >
          <BaseSwitch.Thumb className={thumb} />
        </BaseSwitch.Root>
      }
    />
  );
}
