/** Figma-Quelle: DDS – Dextinity Admin UI. Für `parameters.design` in Stories (Storybook „Design“-Tab). */
export const FIGMA_FILE =
  'https://www.figma.com/design/xAe7acdpccDSRCrfeOdAg3/DDS---Dextinity-Admin-UI---V-0.1';

/** `figmaDesign('25:2')` → Storybook-Parameter, der den Figma-Node im Design-Tab einbettet. */
export function figmaDesign(nodeId: string) {
  return { type: 'figma' as const, url: `${FIGMA_FILE}?node-id=${nodeId.replace(':', '-')}` };
}
