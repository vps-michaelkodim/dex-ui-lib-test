// GENERIERT von packages/icons/scripts/generate.mjs — nicht von Hand ändern.
import { useId, type ReactNode, type SVGProps } from 'react';

export type DextinityLogoBrand = string;

export interface DextinityLogoProps extends Omit<SVGProps<SVGSVGElement>, 'color'> {
  /** Figma: Brand. @default 'main' */
  brand?: DextinityLogoBrand;
  /** Figma: Color — `positive` für helle, `negative` für dunkle Flächen. @default 'positive' */
  color?: 'positive' | 'negative';
  /** Figma: onlySign — nur das Zeichen (z.B. Mobile). */
  signOnly?: boolean;
  /** Zugänglicher Name. @default Markenname, z.B. „Dextinity AI Hub“ */
  title?: string;
}

const LOGOS: Record<string, { label: string; w: number; h: number; render: (uid: string) => ReactNode }> = {

};

/**
 * Dextinity-Logo — Figma: `Dextinity Logos` (Brand × Color × onlySign).
 * Für `signOnly` gibt es nur die Positive-Variante; sie wird dann auch für `negative` verwendet.
 */
export function DextinityLogo({
  brand = 'main',
  color = 'positive',
  signOnly = false,
  title,
  ...props
}: DextinityLogoProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const sign = signOnly ? '--sign' : '';
  const logo = LOGOS[`${brand}--${color}${sign}`] ?? LOGOS[`${brand}--positive${sign}`];
  if (!logo) return null;
  return (
    <svg
      viewBox={`0 0 ${logo.w} ${logo.h}`}
      width={logo.w}
      height={logo.h}
      fill="none"
      role="img"
      aria-label={title ?? logo.label}
      {...props}
    >
      {logo.render(uid)}
    </svg>
  );
}
