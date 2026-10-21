// Fingerprint der Roh-Exporte (gleicher Algorithmus wie figma/export-fingerprint.figma.js).
// Zweck: prüfen, dass figma/raw/*.json exakt dem Figma-Stand entspricht.
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAW = join(dirname(fileURLToPath(import.meta.url)), '..', 'figma', 'raw');

export function fnv(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16);
}

export function fingerprint() {
  const out = {};
  for (const file of readdirSync(RAW).filter((f) => f.endsWith('.json') && f !== 'styles.json')) {
    const { collection, variables } = JSON.parse(readFileSync(join(RAW, file), 'utf8'));
    const rows = [...variables].sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
    const groups = {};
    for (const r of rows) {
      const p = r[0].split('/').slice(0, 2).join('/');
      (groups[p] ??= []).push(r);
    }
    out[collection] = {
      all: fnv(JSON.stringify(rows)),
      groups: Object.fromEntries(
        Object.entries(groups).map(([k, v]) => [k, fnv(JSON.stringify(v))]),
      ),
    };
  }
  return out;
}

if (fileURLToPath(import.meta.url) === process.argv[1]) {
  const expected = process.argv[2] ? JSON.parse(readFileSync(process.argv[2], 'utf8')) : null;
  const actual = fingerprint();
  if (!expected) {
    console.log(JSON.stringify(actual, null, 2));
  } else {
    let bad = 0;
    for (const [col, e] of Object.entries(expected)) {
      const a = actual[col];
      if (!a) {
        console.log(`✗ ${col}: fehlt`);
        bad++;
        continue;
      }
      if (a.all === e.all) {
        console.log(`✓ ${col}`);
        continue;
      }
      bad++;
      for (const [g, h] of Object.entries(e.groups))
        if (a.groups[g] !== h) console.log(`✗ ${col} › ${g}`);
      for (const g of Object.keys(a.groups))
        if (!(g in e.groups)) console.log(`✗ ${col} › ${g} (nur im Code)`);
    }
    process.exit(bad ? 1 : 0);
  }
}
