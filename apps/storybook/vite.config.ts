import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

/**
 * Alle Base-UI-Subpfade, die packages/ui importiert — automatisch ermittelt.
 * Vite optimiert sie vorab; sonst entdeckt es neue erst beim ersten Testlauf, lädt neu
 * und der Lauf schlägt fehl (erst der 2. Lauf ist sauber).
 */
function baseUiEntries(): string[] {
  const root = join(dirname(fileURLToPath(import.meta.url)), '../../packages/ui/src');
  const found = new Set<string>();
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) walk(path);
      else if (/\.tsx?$/.test(entry.name))
        for (const m of readFileSync(path, 'utf8').matchAll(/['"](@base-ui\/react\/[\w-]+)['"]/g))
          found.add(m[1]!);
    }
  };
  walk(root);
  return [...found].sort();
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: baseUiEntries(),
  },
});
