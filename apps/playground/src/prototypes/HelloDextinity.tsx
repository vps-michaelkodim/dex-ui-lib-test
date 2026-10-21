/**
 * Beispiel-Prototyp. Vorlage für neue Screens:
 * nur Komponenten aus @dextinity/ui + Token-basierte Tailwind-Klassen verwenden.
 */
export function HelloDextinity() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold">Hello Dextinity</h2>
      <p className="mt-2 max-w-prose">
        Hier entstehen Prototypen. Sobald die ersten Komponenten da sind, werden sie aus{' '}
        <code>@dextinity/ui</code> importiert.
      </p>
    </div>
  );
}
