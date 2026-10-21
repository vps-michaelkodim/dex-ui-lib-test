// Gleicher Helper wie packages/ui/src/lib/figma.ts (dort nicht öffentlich exportiert).
export const FIGMA_FILE =
  'https://www.figma.com/design/xAe7acdpccDSRCrfeOdAg3/DDS---Dextinity-Admin-UI---V-0.1';

export function figmaDesign(nodeId: string) {
  return { type: 'figma' as const, url: `${FIGMA_FILE}?node-id=${nodeId.replace(':', '-')}` };
}
