import { useEffect, useState } from 'react';
import { prototypes } from './prototypes';

/**
 * Playground-Shell: listet automatisch alle Dateien aus src/prototypes/.
 * Auswahl steht in der URL (#settings), Theme + Brand bleiben beim Neuladen erhalten.
 */
const THEMES = ['light', 'dark', 'high-contrast'] as const;
const BRANDS = ['dextinity', 'crimson'] as const;

const fromHash = () => window.location.hash.slice(1);
const stored = (key: string, fallback: string) => {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
};

export function App() {
  const [activeId, setActiveId] = useState(() => fromHash() || prototypes[0]?.id);
  const [theme, setTheme] = useState(() => stored('playground-theme', 'light'));
  const [brand, setBrand] = useState(() => stored('playground-brand', 'dextinity'));
  const active = prototypes.find((p) => p.id === activeId) ?? prototypes[0];

  useEffect(() => {
    const onHash = () => setActiveId(fromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.brand = brand;
    try {
      localStorage.setItem('playground-theme', theme);
      localStorage.setItem('playground-brand', brand);
    } catch {
      /* egal */
    }
  }, [theme, brand]);

  const selectClass =
    'mt-1 block w-full rounded-forms border border-border-field bg-background p-1';

  return (
    <div className="flex min-h-screen">
      <nav className="w-60 shrink-0 border-r border-border bg-background-subtle p-4">
        <h1 className="mb-4 typo-label-sm">Prototypes</h1>
        <ul className="space-y-1">
          {prototypes.map((p) => (
            <li key={p.id}>
              <a
                href={`#${p.id}`}
                aria-current={p.id === active?.id ? 'page' : undefined}
                className={`block w-full rounded-sm px-2 py-1 typo-body-sm-normal ${
                  p.id === active?.id
                    ? 'bg-action-primary-subtle text-action-primary'
                    : 'hover:bg-background-muted'
                }`}
              >
                {p.title}
              </a>
            </li>
          ))}
        </ul>
        <label className="mt-6 block typo-label-xs">
          Theme
          <select className={selectClass} value={theme} onChange={(e) => setTheme(e.target.value)}>
            {THEMES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className="mt-3 block typo-label-xs">
          Brand
          <select className={selectClass} value={brand} onChange={(e) => setBrand(e.target.value)}>
            {BRANDS.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </label>
      </nav>
      <main className="flex-1">{active ? <active.Component /> : null}</main>
    </div>
  );
}
