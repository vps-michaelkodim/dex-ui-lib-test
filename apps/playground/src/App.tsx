import { useState } from 'react';
import { prototypes } from './prototypes';

/**
 * Playground-Shell: listet alle Prototypen aus src/prototypes/.
 * Neuer Prototyp = neue Datei in src/prototypes/ + Eintrag in prototypes/index.ts.
 */
export function App() {
  const [activeId, setActiveId] = useState(prototypes[0]?.id);
  const [theme, setTheme] = useState('light');
  const active = prototypes.find((p) => p.id === activeId);

  const switchTheme = (next: string) => {
    setTheme(next);
    document.documentElement.dataset.theme = next;
  };

  return (
    <div className="flex min-h-screen">
      <nav className="w-60 shrink-0 border-r border-border bg-background-subtle p-4">
        <h1 className="mb-4 typo-label-sm">Prototypes</h1>
        <ul className="space-y-1">
          {prototypes.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => setActiveId(p.id)}
                className={`w-full rounded-sm px-2 py-1 text-left typo-body-sm-normal ${
                  p.id === activeId
                    ? 'bg-action-primary-subtle text-action-primary'
                    : 'hover:bg-background-muted'
                }`}
              >
                {p.title}
              </button>
            </li>
          ))}
        </ul>
        <label className="mt-6 block typo-label-xs">
          Theme
          <select
            className="mt-1 block w-full rounded-forms border border-border-field bg-background p-1"
            value={theme}
            onChange={(e) => switchTheme(e.target.value)}
          >
            <option value="light">light</option>
            <option value="dark">dark</option>
            <option value="high-contrast">high-contrast</option>
          </select>
        </label>
      </nav>
      <main className="flex-1">{active ? <active.Component /> : null}</main>
    </div>
  );
}
