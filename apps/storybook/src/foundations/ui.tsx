import type { ReactNode } from 'react';

export function Page({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-5xl space-y-10 p-8">
      <header className="space-y-2">
        <h1 className="typo-heading-h2-bold">{title}</h1>
        {intro ? (
          <p className="max-w-prose typo-body-md-normal text-foreground-muted">{intro}</p>
        ) : null}
      </header>
      {children}
    </div>
  );
}

export function Section({
  title,
  children,
  note,
}: {
  title: string;
  children: ReactNode;
  note?: ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="typo-heading-h4-bold">{title}</h2>
        {note ? <p className="typo-body-sm-normal text-foreground-muted">{note}</p> : null}
      </div>
      {children}
    </section>
  );
}

export function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-sm bg-background-muted px-1 py-0.5 font-mono text-body-xs break-all">
      {children}
    </code>
  );
}
