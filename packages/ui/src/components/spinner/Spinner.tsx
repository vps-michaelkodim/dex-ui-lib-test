import type { ComponentProps } from 'react';
import { cn } from '../../lib/cn';

export interface SpinnerProps extends Omit<ComponentProps<'svg'>, 'children'> {
  /** Kantenlänge in px. Default 16. */
  size?: number;
  /** Zugänglicher Name. Ohne `label` ist der Spinner dekorativ (z.B. im Button mit aria-busy). */
  label?: string;
}

/**
 * Lade-Indikator, Farbe = Textfarbe. Figma: „Spinner“ (vorerst vereinfachte Umsetzung).
 * Respektiert prefers-reduced-motion (langsamer statt aus).
 */
export function Spinner({ size = 16, label, className, ...props }: SpinnerProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      fill="none"
      role={label ? 'status' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn(
        'shrink-0 animate-spin motion-reduce:animate-[spin_3s_linear_infinite]',
        className,
      )}
      {...props}
    >
      <path
        d="M8 1.5A6.5 6.5 0 1 1 1.5 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
