import type { ReactNode, Ref, SVGProps } from 'react';

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  /** Kantenlänge in px oder CSS-Wert. Default 16 (= Figma-Token `…/icon-size`). */
  size?: number | string;
  /**
   * Zugänglicher Name. Ohne `title` ist das Icon dekorativ (aria-hidden) —
   * dann braucht das umgebende Element (z.B. IconButton) ein `aria-label`.
   */
  title?: string;
  ref?: Ref<SVGSVGElement>;
}

/** Basis aller Icons: 16×16-Viewbox, Farbe über `currentColor` (Textfarbe). */
export function Icon({
  size = 16,
  title,
  children,
  ...props
}: IconProps & { children?: ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      width={size}
      height={size}
      fill="none"
      focusable="false"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}
