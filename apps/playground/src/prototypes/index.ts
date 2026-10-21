import type { ComponentType } from 'react';

/**
 * Prototypen registrieren sich selbst: jede Datei `src/prototypes/<Name>.tsx` ist ein Prototyp.
 * - exportiert eine Komponente (default oder benannt)
 * - optional: `export const title = 'Anzeigename'` (sonst wird der Dateiname verwendet)
 */
export interface Prototype {
  id: string;
  title: string;
  Component: ComponentType;
}

const modules = import.meta.glob<Record<string, unknown>>('./*.tsx', { eager: true });

const toTitle = (name: string) => name.replace(/([a-z])([A-Z])/g, '$1 $2');
const toId = (name: string) => name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

export const prototypes: Prototype[] = Object.entries(modules)
  .map(([path, mod]) => {
    const name = path.replace(/^\.\/|\.tsx$/g, '');
    const Component = (mod.default ?? Object.values(mod).find((v) => typeof v === 'function')) as
      ComponentType | undefined;
    if (!Component) return null;
    const title = typeof mod.title === 'string' ? mod.title : toTitle(name);
    return { id: toId(name), title, Component };
  })
  .filter((p): p is Prototype => p !== null)
  .sort((a, b) => a.title.localeCompare(b.title, 'de'));
