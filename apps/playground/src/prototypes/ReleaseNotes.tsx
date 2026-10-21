import { useState, type ComponentType, type ReactNode } from 'react';
import { Button, Chip } from '@dextinity/ui';
import {
  ArrowRightIcon,
  ChevronDownIcon,
  DeviceDesktopIcon,
  SwapIcon,
  TimeIcon,
  WarningIcon,
} from '@dextinity/icons';

/**
 * Prototyp: Release Notes (Vorlage: Screenshot „Neuigkeiten“ im AI Hub).
 * Nur @dextinity/ui + Token-Klassen. Callout und Accordion fehlen noch in der Library → lokale Platzhalter unten.
 */

interface Highlight {
  icon: ComponentType;
  title: string;
  text: string;
  action: string;
}

interface Entry {
  area: string;
  text: string;
}

interface Release {
  version: string;
  date: string;
  dateShort: string;
  changes: number;
  summary: string;
  highlights: Highlight[];
  notice?: string;
  added: Entry[];
  improved: Entry[];
  fixes: string[];
  fixesTeaser: string;
}

// Beispieldaten. 24.09 entspricht dem Screenshot, ältere Releases sind Platzhalter.
const releases: Release[] = [
  {
    version: '24.09',
    date: '24. September 2026',
    dateShort: '24. Sep 2026',
    changes: 23,
    summary:
      'Mit diesem Release wird der Chat flexibler, Automatisierungen laufen auf Wunsch nach Zeitplan und das eingebettete Chat-Widget bekommt ein neues Design.',
    highlights: [
      {
        icon: SwapIcon,
        title: 'Agent im Chat wechseln',
        text: 'Wechsle mitten im Gespräch den Agent – der Verlauf bleibt erhalten.',
        action: 'Zum Chat',
      },
      {
        icon: TimeIcon,
        title: 'Zeitplan für Automatisierungen',
        text: 'Automatisierungen laufen an festen Wochentagen und Uhrzeiten von selbst.',
        action: 'Zeitplan einrichten',
      },
      {
        icon: DeviceDesktopIcon,
        title: 'Neues Chat-Widget-Design',
        text: 'Schrift, Farben, Startbildschirm und Eingabefeld wirken ruhiger und moderner.',
        action: 'Vorschau öffnen',
      },
    ],
    notice:
      'GitHub steht nicht mehr als Wissensquelle zur Verfügung. Bestehende GitHub-Quellen wurden automatisch entfernt.',
    added: [
      {
        area: 'Chat',
        text: 'Dein Chat-Verlauf ist im ganzen Workspace verfügbar. Der Agent zeigt in kurzen Meldungen, woran er gerade arbeitet.',
      },
      {
        area: 'Flows & Agents',
        text: 'Ergebnisse eines Schritts lassen sich im neuen Reiter „Inputs“ an den nächsten weitergeben. Für alle Modelle ist einstellbar, wie gründlich sie nachdenken.',
      },
      {
        area: 'Verwaltung',
        text: 'Pläne lassen sich pro Mandant festlegen. Rechtliche Hinweise können formatiert werden.',
      },
    ],
    improved: [
      {
        area: 'Geschwindigkeit',
        text: 'Antworten beginnen schneller, Suche und Qualitäts-Übersicht laden zügiger.',
      },
      {
        area: 'Wissen',
        text: 'Dokumente werden standardmäßig so aufbereitet, dass der Agent mehr Zusammenhang erkennt.',
      },
      {
        area: 'Bedienung',
        text: 'Feedback-Status per Auswahlliste, klarere Bestätigungsdialoge, Hinweis in der Widget-Vorschau.',
      },
    ],
    fixes: [
      'Verlauf in eingebetteten Widgets wird wieder vollständig angezeigt.',
      'Dauer im Sprachmodus wird korrekt berechnet.',
      'Lange Agent-Namen werden in der Auswahl nicht mehr abgeschnitten.',
      'Hochgeladene PDFs mit Umlauten im Dateinamen werden zuverlässig verarbeitet.',
      'Filter in der Qualitätskontrolle bleiben nach dem Neuladen erhalten.',
      'Zeitzonen in Automatisierungs-Protokollen stimmen wieder.',
      'Tastaturfokus springt nach dem Schließen von Dialogen zurück.',
      'Export der Analyse enthält wieder alle Spalten.',
    ],
    fixesTeaser: 'Verlauf in eingebetteten Widgets, Dauer im Sprachmodus',
  },
  placeholderRelease('24.08', '27. August 2026', '27. Aug 2026', 18),
  placeholderRelease('24.07', '23. Juli 2026', '23. Jul 2026', 15),
  placeholderRelease('24.06', '25. Juni 2026', '25. Jun 2026', 21),
];

function placeholderRelease(
  version: string,
  date: string,
  dateShort: string,
  changes: number,
): Release {
  return {
    version,
    date,
    dateShort,
    changes,
    summary: 'Platzhalter: Hier steht die Zusammenfassung dieses Releases in ein, zwei Sätzen.',
    highlights: [
      {
        icon: SwapIcon,
        title: 'Highlight eins',
        text: 'Kurze Beschreibung, was neu ist und warum es hilft.',
        action: 'Ansehen',
      },
      {
        icon: TimeIcon,
        title: 'Highlight zwei',
        text: 'Kurze Beschreibung, was neu ist und warum es hilft.',
        action: 'Ansehen',
      },
    ],
    added: [{ area: 'Chat', text: 'Platzhalter für eine Neuerung.' }],
    improved: [{ area: 'Bedienung', text: 'Platzhalter für eine Verbesserung.' }],
    fixes: ['Platzhalter für einen behobenen Fehler.', 'Noch ein behobener Fehler.'],
    fixesTeaser: 'Platzhalter',
  };
}

export const title = 'Release Notes';

export function ReleaseNotes() {
  const [activeVersion, setActiveVersion] = useState(releases[0]?.version);
  const release = releases.find((r) => r.version === activeVersion);
  if (!release) return null;

  return (
    <div className="mx-auto w-full max-w-6xl p-8">
      <header className="mb-8">
        <h1 className="typo-heading-h2-bold text-foreground">Release Notes</h1>
        <p className="mt-1 typo-body-sm-normal text-foreground-muted">
          Was sich im AI Hub geändert hat – verständlich zusammengefasst.
        </p>
      </header>

      <div className="flex flex-col gap-8 md:flex-row">
        <nav aria-labelledby="releases-heading" className="shrink-0 md:w-44">
          <h2
            id="releases-heading"
            className="mb-2 px-3 typo-label-xs text-foreground-muted uppercase"
          >
            Releases
          </h2>
          <ul className="flex flex-col gap-1">
            {releases.map((r, index) => {
              const active = r.version === release.version;
              return (
                <li key={r.version}>
                  <button
                    type="button"
                    aria-current={active ? 'page' : undefined}
                    onClick={() => setActiveVersion(r.version)}
                    className={`w-full cursor-pointer rounded-control px-3 py-2 text-left transition-colors focus-visible:outline-(length:--dx-focus-ring-width) focus-visible:outline-offset-(--dx-focus-ring-offset) focus-visible:outline-border-focus focus-visible:outline-solid ${
                      active ? 'bg-action-primary-subtle' : 'hover:bg-background-muted'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={`typo-body-md-bold ${active ? 'text-action-primary' : 'text-foreground'}`}
                      >
                        {r.version}
                      </span>
                      {index === 0 ? (
                        <Chip size="small" color="info">
                          Aktuell
                        </Chip>
                      ) : null}
                    </span>
                    <span className="block typo-body-xs-normal text-foreground-muted">
                      {r.dateShort}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <Button variant="text" size="small" className="mt-2">
            Ältere anzeigen
          </Button>
        </nav>

        <article aria-labelledby="release-title" className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h2 id="release-title" className="typo-heading-h3-bold text-foreground">
              Release {release.version}
            </h2>
            <p className="typo-body-sm-normal text-foreground-muted">
              {release.date} · {release.changes} Änderungen
            </p>
          </div>
          <p className="mt-2 max-w-prose typo-body-md-normal text-foreground">{release.summary}</p>

          <section aria-labelledby="highlights-heading" className="mt-8">
            <h3 id="highlights-heading" className="mb-3 typo-heading-h4-bold text-foreground">
              Highlights
            </h3>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {release.highlights.map((h) => (
                <li
                  key={h.title}
                  className="flex flex-col rounded-card border border-border bg-background p-4 shadow-xs"
                >
                  <span className="mb-3 inline-flex size-8 items-center justify-center rounded-md bg-action-primary-subtle text-action-primary">
                    <h.icon />
                  </span>
                  <h4 className="typo-body-md-bold text-foreground">{h.title}</h4>
                  <p className="mt-1 flex-1 typo-body-sm-normal text-foreground-muted">{h.text}</p>
                  <Button
                    variant="text"
                    size="small"
                    endIcon={<ArrowRightIcon />}
                    render={<a href="#" />}
                    nativeButton={false}
                    className="mt-3 self-start"
                  >
                    {h.action}
                  </Button>
                </li>
              ))}
            </ul>
          </section>

          {release.notice ? (
            <CalloutPlaceholder title="Bitte beachten:" className="mt-6">
              {release.notice}
            </CalloutPlaceholder>
          ) : null}

          <ChangeList title="Weitere Neuerungen" entries={release.added} />
          <ChangeList title="Verbessert" entries={release.improved} />

          <AccordionPlaceholder
            className="mt-8"
            summary={
              <>
                <span className="typo-body-sm-bold text-foreground">
                  {release.fixes.length} Fehler behoben
                </span>
                <span className="typo-body-sm-normal text-foreground-muted">
                  {' '}
                  – u. a. {release.fixesTeaser}
                </span>
              </>
            }
          >
            <ul className="list-disc space-y-1 pl-5 typo-body-sm-normal text-foreground">
              {release.fixes.map((fix) => (
                <li key={fix}>{fix}</li>
              ))}
            </ul>
          </AccordionPlaceholder>
        </article>
      </div>
    </div>
  );
}

function ChangeList({ title, entries }: { title: string; entries: Entry[] }) {
  return (
    <section className="mt-8">
      <h3 className="mb-2 typo-heading-h4-bold text-foreground">{title}</h3>
      <dl className="border-t border-border">
        {entries.map((e) => (
          <div
            key={e.area}
            className="grid gap-1 border-b border-border py-3 sm:grid-cols-[9rem_1fr] sm:gap-4"
          >
            <dt className="typo-body-sm-normal text-foreground-muted">{e.area}</dt>
            <dd className="typo-body-sm-normal text-foreground">{e.text}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

// TODO(@dextinity/ui): Kandidat für die Library — Figma: Alert / Callout (gibt es noch nicht in DDS)
function CalloutPlaceholder({
  title,
  children,
  className = '',
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      role="note"
      className={`flex gap-2 rounded-surface border border-feedback-warning-border bg-feedback-warning-subtle p-4 typo-body-sm-normal text-feedback-warning-foreground ${className}`}
    >
      <span className="mt-0.5 shrink-0">
        <WarningIcon />
      </span>
      <p>
        <strong className="typo-body-sm-bold">{title}</strong> {children}
      </p>
    </div>
  );
}

// TODO(@dextinity/ui): Kandidat für die Library — Figma: Accordion (gibt es noch nicht in DDS)
function AccordionPlaceholder({
  summary,
  children,
  className = '',
}: {
  summary: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <details className={`group rounded-surface border border-border bg-background ${className}`}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-surface px-4 py-3 hover:bg-background-subtle focus-visible:outline-(length:--dx-focus-ring-width) focus-visible:outline-offset-(--dx-focus-ring-offset) focus-visible:outline-border-focus focus-visible:outline-solid [&::-webkit-details-marker]:hidden">
        <span className="min-w-0">{summary}</span>
        <span className="shrink-0 text-foreground-muted transition-transform group-open:rotate-180">
          <ChevronDownIcon />
        </span>
      </summary>
      <div className="border-t border-border px-4 py-3">{children}</div>
    </details>
  );
}
