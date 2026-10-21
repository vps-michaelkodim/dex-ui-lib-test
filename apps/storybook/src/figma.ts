import primitives from '../../../packages/tokens/figma/raw/primitives.json';

// Gleicher Helper wie packages/ui/src/lib/figma.ts (dort nicht öffentlich exportiert).
export const FIGMA_FILE =
  'https://www.figma.com/design/xAe7acdpccDSRCrfeOdAg3/DDS---Dextinity-Admin-UI---V-0.1';

export function figmaDesign(nodeId: string) {
  return { type: 'figma' as const, url: `${FIGMA_FILE}?node-id=${nodeId.replace(':', '-')}` };
}

/** Stand des Figma-Files — Variable `version` (Collection Primitives), kommt mit jedem Token-Sync. */

const versionRow = (primitives.variables as unknown[][]).find((r) => r[0] === 'version');
export const DDS_VERSION = versionRow ? String((versionRow[2] as unknown[])[0]) : 'unbekannt';
