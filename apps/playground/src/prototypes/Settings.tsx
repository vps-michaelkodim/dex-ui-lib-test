import { useState, type FormEvent, type ReactNode } from 'react';
import { Button, Input, Switch } from '@dextinity/ui';
import { LetterIcon, ResetIcon, SaveIcon, StatusSuccessSolidIcon } from '@dextinity/icons';

/**
 * Prototyp: Einstellungsseite mit Formular + Speichern.
 * Nur @dextinity/ui + Token-Klassen.
 */

interface SettingsValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  workspace: string;
  website: string;
  notifyComments: boolean;
  weeklyDigest: boolean;
}

type Errors = Partial<Record<keyof SettingsValues, string>>;

const initialValues: SettingsValues = {
  firstName: 'Mitch',
  lastName: '',
  email: 'mitch@example.com',
  phone: '',
  workspace: 'Vivid Planet',
  website: 'vivid-planet.com',
  notifyComments: true,
  weeklyDigest: false,
};

const fieldOrder: (keyof SettingsValues)[] = ['firstName', 'lastName', 'email', 'workspace'];

function validate(v: SettingsValues): Errors {
  const errors: Errors = {};
  if (!v.firstName.trim()) errors.firstName = 'Bitte gib deinen Vornamen ein.';
  if (!v.lastName.trim()) errors.lastName = 'Bitte gib deinen Nachnamen ein.';
  if (!v.email.trim()) errors.email = 'Bitte gib deine E-Mail-Adresse ein.';
  else if (!/^\S+@\S+\.\S+$/.test(v.email))
    errors.email = 'Das sieht nicht nach einer E-Mail-Adresse aus.';
  if (!v.workspace.trim()) errors.workspace = 'Dein Workspace braucht einen Namen.';
  return errors;
}

export const title = 'Einstellungen';

export function Settings() {
  const [saved, setSaved] = useState(initialValues);
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const dirty = JSON.stringify(values) !== JSON.stringify(saved);

  const set = <K extends keyof SettingsValues>(key: K, value: SettingsValues[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    setJustSaved(false);
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const nextErrors = validate(values);
    setErrors(nextErrors);

    const firstInvalid = fieldOrder.find((key) => nextErrors[key]);
    if (firstInvalid) {
      form.querySelector<HTMLInputElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1200)); // simulierter API-Call
    setSaving(false);
    setSaved(values);
    setJustSaved(true);
  };

  const handleReset = () => {
    setValues(saved);
    setErrors({});
    setJustSaved(false);
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="flex min-h-screen flex-col bg-background-subtle"
    >
      <div className="mx-auto w-full max-w-3xl flex-1 p-8">
        <header className="mb-6">
          <h2 className="typo-heading-h2-bold text-foreground">Einstellungen</h2>
          <p className="mt-1 typo-body-md-normal text-foreground-muted">
            Verwalte dein Profil, deinen Workspace und deine Benachrichtigungen.
          </p>
        </header>

        <div role="status" aria-live="polite">
          {justSaved ? (
            <div className="mb-6 flex items-center gap-2 rounded-surface border border-feedback-success-border bg-feedback-success-subtle p-3 typo-body-sm-normal text-feedback-success-foreground">
              <StatusSuccessSolidIcon />
              Deine Einstellungen sind gespeichert.
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-layout-md">
          <Section title="Profil" description="So sehen dich andere in Dextinity.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                name="firstName"
                label="Vorname"
                required
                autoComplete="given-name"
                value={values.firstName}
                onChange={(e) => set('firstName', e.target.value)}
                status={errors.firstName ? 'error' : undefined}
                helperText={errors.firstName}
              />
              <Input
                name="lastName"
                label="Nachname"
                required
                autoComplete="family-name"
                value={values.lastName}
                onChange={(e) => set('lastName', e.target.value)}
                status={errors.lastName ? 'error' : undefined}
                helperText={errors.lastName}
              />
              <Input
                name="email"
                type="email"
                label="E-Mail"
                required
                autoComplete="email"
                startAdornment={<LetterIcon />}
                value={values.email}
                onChange={(e) => set('email', e.target.value)}
                status={errors.email ? 'error' : undefined}
                helperText={errors.email ?? 'Hierhin schicken wir Benachrichtigungen.'}
              />
              <Input
                name="phone"
                type="tel"
                label="Telefon"
                autoComplete="tel"
                placeholder="optional"
                value={values.phone}
                onChange={(e) => set('phone', e.target.value)}
              />
            </div>
          </Section>

          <Section title="Workspace" description="Gilt für alle Mitglieder deines Workspaces.">
            <div className="grid gap-4">
              <Input
                name="workspace"
                label="Name des Workspaces"
                required
                maxLength={40}
                showCount
                value={values.workspace}
                onChange={(e) => set('workspace', e.target.value)}
                status={errors.workspace ? 'error' : undefined}
                helperText={errors.workspace}
              />
              <Input
                name="website"
                label="Website"
                inputMode="url"
                startAdornment="https://"
                value={values.website}
                onChange={(e) => set('website', e.target.value)}
              />
            </div>
          </Section>

          <Section
            title="Benachrichtigungen"
            description="Wähle, worüber wir dich per E-Mail informieren."
          >
            <div className="flex flex-col gap-4">
              <Switch
                helperText="Wenn jemand auf deine Inhalte antwortet."
                checked={values.notifyComments}
                onCheckedChange={(checked) => set('notifyComments', checked)}
              >
                Neue Kommentare
              </Switch>
              <Switch
                helperText="Jeden Montag ein Überblick über deinen Workspace."
                checked={values.weeklyDigest}
                onCheckedChange={(checked) => set('weeklyDigest', checked)}
              >
                Wöchentliche Zusammenfassung
              </Switch>
            </div>
          </Section>
        </div>
      </div>

      <footer className="sticky bottom-0 border-t border-border bg-background">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-8 py-4">
          <p className="typo-body-sm-normal text-foreground-muted">
            {dirty ? 'Du hast ungespeicherte Änderungen.' : 'Alles gespeichert.'}
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outlined"
              color="secondary"
              startIcon={<ResetIcon />}
              onClick={handleReset}
              disabled={!dirty || saving}
            >
              Verwerfen
            </Button>
            <Button type="submit" startIcon={<SaveIcon />} loading={saving}>
              Speichern
            </Button>
          </div>
        </div>
      </footer>
    </form>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-card border border-border bg-background p-6 shadow-xs">
      <h3 className="typo-heading-h4-bold text-foreground">{title}</h3>
      <p className="mt-1 mb-5 typo-body-sm-normal text-foreground-muted">{description}</p>
      {children}
    </section>
  );
}
