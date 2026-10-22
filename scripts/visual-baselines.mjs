#!/usr/bin/env node
/**
 * Fehlende Mac-Referenzbilder für die Screenshot-Tests erzeugen.
 *
 *   pnpm test:visual:new            fehlende Bilder erzeugen (nur auf macOS)
 *   node scripts/visual-baselines.mjs --commit   dasselbe + committen (läuft im pre-push-Hook)
 *
 * Liest die Fälle (`CASES`) und Modi (`MODES`) aus apps/storybook/visual/visual.test.tsx und erzeugt nur
 * Bilder für Fälle, bei denen mindestens ein `-chromium-darwin.png` fehlt. Bestehende Bilder anderer
 * Fälle werden nicht angefasst (gewollte Änderungen weiter mit `pnpm test:visual:update`).
 *
 * Ausnahme Figma-Sync: Ändert der Branch (gegenüber origin/main) den Roh-Export aus Figma
 * (Tokens, Styles, Icons, Logos) und noch kein Referenzbild, werden im Hook ALLE Bilder neu erzeugt —
 * ein Sync ist per Definition eine gewollte optische Änderung.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// fileURLToPath statt .pathname: sonst bleiben Leerzeichen im Pfad als %20 stehen.
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const TEST = join(ROOT, 'apps/storybook/visual/visual.test.tsx');
const SHOTS = join(ROOT, 'apps/storybook/visual/__screenshots__/visual.test.tsx');
const commit = process.argv.includes('--commit');

if (process.platform !== 'darwin') {
  // Maßgeblich sind die Mac-Bilder; auf Linux/Windows nichts tun.
  process.exit(0);
}

const src = readFileSync(TEST, 'utf8');
const casesBlock = src.slice(src.indexOf('const CASES'), src.indexOf('const MODES'));
const modesBlock = src.slice(src.indexOf('const MODES'), src.indexOf('] as const'));
const names = [...casesBlock.matchAll(/name:\s*'([^']+)'/g)].map((m) => m[1]);
const modes = [...modesBlock.matchAll(/theme:\s*'([^']+)',\s*brand:\s*'([^']+)'/g)].map(
  (m) => `${m[1]}-${m[2]}`,
);

const git = (...args) => execFileSync('git', args, { cwd: ROOT }).toString().trim();
const FIGMA_SOURCES = /^packages\/(tokens\/figma\/raw|icons\/svg|icons\/logos)\//;
let figmaSync = false;
if (commit) {
  try {
    const files = git('diff', '--name-only', 'origin/main...HEAD').split('\n');
    figmaSync =
      files.some((f) => FIGMA_SOURCES.test(f)) &&
      !files.some((f) => f.startsWith('apps/storybook/visual/__screenshots__/'));
  } catch {
    // kein origin/main (z.B. frischer Clone ohne fetch) → nur fehlende Bilder
  }
}

const missing = names.filter((name) =>
  modes.some((mode) => !existsSync(join(SHOTS, `${name}-${mode}-chromium-darwin.png`))),
);
if (figmaSync) {
  console.log('\n📸 Figma-Sync im Branch, Referenzbilder noch alt — alle werden neu erzeugt …\n');
  execFileSync(
    'pnpm',
    [
      '--filter',
      '@dextinity/storybook',
      'exec',
      'vitest',
      'run',
      '-c',
      'vitest.visual.config.ts',
      '--update',
    ],
    { cwd: ROOT, stdio: 'inherit' },
  );
  missing.splice(0, missing.length, 'alle (Figma-Sync)');
} else if (!missing.length) process.exit(0);
else {
  console.log(`\n📸 Fehlende Mac-Referenzbilder: ${missing.join(', ')} — werden jetzt erzeugt …\n`);
  const pattern = `(^|\\s)(${missing.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})$`;
  execFileSync(
    'pnpm',
    [
      '--filter',
      '@dextinity/storybook',
      'exec',
      'vitest',
      'run',
      '-c',
      'vitest.visual.config.ts',
      '--update',
      '-t',
      pattern,
    ],
    { cwd: ROOT, stdio: 'inherit' },
  );
}

if (!commit) process.exit(0);

execFileSync('git', ['add', SHOTS], { cwd: ROOT, stdio: 'inherit' });
const staged = execFileSync('git', ['diff', '--cached', '--name-only', '--', SHOTS], { cwd: ROOT })
  .toString()
  .trim();
if (!staged) process.exit(0);
execFileSync(
  'git',
  [
    'commit',
    '--no-verify',
    '-m',
    `test(visual): Mac-Referenzbilder für ${missing.join(', ')}`,
    '--',
    SHOTS,
  ],
  { cwd: ROOT, stdio: 'inherit' },
);
console.log('\n✅ Referenzbilder erzeugt und committet. Bitte einfach nochmal pushen.\n');
process.exit(1);
