# Changesets

Jede Änderung an `packages/*` oder `apps/*`, die Nutzer:innen der Library betrifft, bekommt hier eine kleine Datei.
Daraus entstehen beim Release die neue Versionsnummer und die `CHANGELOG.md`-Einträge.

Alle `@dextinity/*`-Packages laufen im Lockstep (gleiche Nummer, siehe `config.json` → `fixed`).
Regeln für Stufe und Text: `AGENTS.md` → „Versionen & Changesets“.

```md
---
'@dextinity/ui': minor
---

Button: `loading` als eigene Property (zeigt Spinner, blockiert Klicks).
```

Release: `pnpm release:version` → prüfen → committen → Tag `vX.Y.Z`.
