import { useMemo, useState, type ReactNode } from 'react';
import {
  Button,
  Chip,
  Dialog,
  DialogClose,
  IconButton,
  Input,
  Search,
  Select,
  Text,
  Tooltip,
  useSnackbar,
} from '@dextinity/ui';
import { DeleteIcon, EditIcon, LetterIcon, PlusIcon } from '@dextinity/icons';

/**
 * Prototyp: Benutzerliste mit Suche, Rollen-Filter, Status-Chips und Zeilenaktionen.
 * Nur @dextinity/ui + Token-Klassen. Tabelle fehlt noch in der Library → lokaler Platzhalter unten.
 */

type Status = 'aktiv' | 'eingeladen' | 'gesperrt';
type Role = 'Admin' | 'Redakteur:in' | 'Leser:in';

interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  status: Status;
  lastLogin: string;
}

const initialUsers: User[] = [
  {
    id: 1,
    name: 'Mitch Kodim',
    email: 'mitch@vivid-planet.com',
    role: 'Admin',
    status: 'aktiv',
    lastLogin: 'heute, 09:12',
  },
  {
    id: 2,
    name: 'Manuel Huber',
    email: 'manuel@vivid-planet.com',
    role: 'Admin',
    status: 'aktiv',
    lastLogin: 'gestern',
  },
  {
    id: 3,
    name: 'Lena Berger',
    email: 'lena.berger@example.com',
    role: 'Redakteur:in',
    status: 'aktiv',
    lastLogin: 'vor 3 Tagen',
  },
  {
    id: 4,
    name: 'Jonas Wimmer',
    email: 'jonas.wimmer@example.com',
    role: 'Redakteur:in',
    status: 'eingeladen',
    lastLogin: '—',
  },
  {
    id: 5,
    name: 'Sara Novak',
    email: 'sara.novak@example.com',
    role: 'Leser:in',
    status: 'gesperrt',
    lastLogin: 'vor 2 Monaten',
  },
  {
    id: 6,
    name: 'Tobias Leitner',
    email: 'tobias.leitner@example.com',
    role: 'Leser:in',
    status: 'aktiv',
    lastLogin: 'vor 1 Woche',
  },
  {
    id: 7,
    name: 'Eva Gruber',
    email: 'eva.gruber@example.com',
    role: 'Redakteur:in',
    status: 'eingeladen',
    lastLogin: '—',
  },
];

const statusChip: Record<Status, { label: string; color: 'success' | 'warning' | 'error' }> = {
  aktiv: { label: 'Aktiv', color: 'success' },
  eingeladen: { label: 'Eingeladen', color: 'warning' },
  gesperrt: { label: 'Gesperrt', color: 'error' },
};

const statusFilters: { value: Status | 'alle'; label: string }[] = [
  { value: 'alle', label: 'Alle' },
  { value: 'aktiv', label: 'Aktiv' },
  { value: 'eingeladen', label: 'Eingeladen' },
  { value: 'gesperrt', label: 'Gesperrt' },
];

export const title = 'Benutzerliste';

export function UserList() {
  const [users, setUsers] = useState(initialUsers);
  const [query, setQuery] = useState('');
  const [role, setRole] = useState<Role | ''>('');
  const [status, setStatus] = useState<Status | 'alle'>('alle');
  const [inviteOpen, setInviteOpen] = useState(false);
  const snackbar = useSnackbar();

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter(
      (u) =>
        (!q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) &&
        (!role || u.role === role) &&
        (status === 'alle' || u.status === status),
    );
  }, [users, query, role, status]);

  const remove = (user: User) => {
    setUsers((list) => list.filter((u) => u.id !== user.id));
    snackbar.show({
      message: `${user.name} wurde entfernt.`,
      action: {
        label: 'Rückgängig',
        onClick: () => setUsers((list) => [...list, user].sort((a, b) => a.id - b.id)),
      },
    });
  };

  const invite = (email: string) => {
    setInviteOpen(false);
    snackbar.show({ color: 'success', message: `Einladung an ${email} verschickt.` });
  };

  const resetFilters = () => {
    setQuery('');
    setRole('');
    setStatus('alle');
  };

  return (
    <div className="mx-auto max-w-6xl p-8">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="typo-heading-h2-bold">Benutzer</h2>
          <p className="mt-1 typo-body-md-normal text-foreground-muted">
            Verwalte, wer Zugriff auf deinen Workspace hat.
          </p>
        </div>
        <InviteDialog open={inviteOpen} onOpenChange={setInviteOpen} onInvite={invite} />
      </header>

      <div className="mb-4 flex flex-wrap items-end gap-4">
        <Search
          placeholder="Name oder E-Mail suchen"
          value={query}
          onValueChange={setQuery}
          wrapperClassName="w-80 max-w-full"
        />
        <Select
          label="Rolle"
          value={role}
          onValueChange={(v) => setRole((v ?? '') as Role | '')}
          wrapperClassName="w-48"
          options={[
            { value: '', label: 'Alle Rollen' },
            { value: 'Admin', label: 'Admin' },
            { value: 'Redakteur:in', label: 'Redakteur:in' },
            { value: 'Leser:in', label: 'Leser:in' },
          ]}
        />
      </div>

      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Nach Status filtern">
        {statusFilters.map((f) => (
          <Chip
            key={f.value}
            size="small"
            variant={status === f.value ? 'contained' : 'outlined'}
            color={status === f.value ? 'primary' : 'secondary'}
            onClick={() => setStatus(f.value)}
          >
            {f.label}
          </Chip>
        ))}
      </div>

      {/* TODO(@dextinity/ui): Kandidat für die Library — Figma: Table (noch nicht im DDS) */}
      <div className="overflow-x-auto rounded-surface border border-border bg-background">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">Benutzer im Workspace</caption>
          <thead className="bg-background-subtle typo-label-sm text-foreground-muted">
            <tr>
              <Th>Name</Th>
              <Th>Rolle</Th>
              <Th>Status</Th>
              <Th>Letzte Anmeldung</Th>
              <Th>
                <span className="sr-only">Aktionen</span>
              </Th>
            </tr>
          </thead>
          <tbody className="typo-body-sm-normal">
            {visible.map((u) => (
              <tr key={u.id} className="border-t border-border hover:bg-background-subtle">
                <td className="px-4 py-3">
                  <div className="typo-body-sm-bold">{u.name}</div>
                  <div className="text-foreground-muted">{u.email}</div>
                </td>
                <td className="px-4 py-3">{u.role}</td>
                <td className="px-4 py-3">
                  <Chip size="small" variant="outlined" color={statusChip[u.status].color}>
                    {statusChip[u.status].label}
                  </Chip>
                </td>
                <td className="px-4 py-3 text-foreground-muted">{u.lastLogin}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Tooltip content="Bearbeiten">
                      <IconButton
                        aria-label={`${u.name} bearbeiten`}
                        variant="text"
                        color="secondary"
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip content="Entfernen">
                      <IconButton
                        aria-label={`${u.name} entfernen`}
                        variant="text"
                        color="error"
                        size="small"
                        onClick={() => remove(u)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {visible.length === 0 && (
          <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
            <p className="typo-body-md-bold">Keine Benutzer gefunden</p>
            <p className="typo-body-sm-normal text-foreground-muted">
              Passe die Suche oder die Filter an.
            </p>
            <Button variant="outlined" size="small" onClick={resetFilters}>
              Filter zurücksetzen
            </Button>
          </div>
        )}
      </div>

      <p className="mt-3 typo-body-xs-normal text-foreground-muted">
        {visible.length} von {users.length} Benutzern
      </p>
    </div>
  );
}

function Th({ children }: { children: ReactNode }) {
  return (
    <th scope="col" className="px-4 py-3 font-medium">
      {children}
    </th>
  );
}

function InviteDialog({
  open,
  onOpenChange,
  onInvite,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvite: (email: string) => void;
}) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<string | null>('Leser:in');
  const valid = /^\S+@\S+\.\S+$/.test(email);
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      trigger={<Button startIcon={<PlusIcon />}>Benutzer einladen</Button>}
      title="Benutzer einladen"
      icon={<LetterIcon />}
      secondaryActions={<DialogClose render={<Button variant="text">Abbrechen</Button>} />}
      actions={
        <Button disabled={!valid} onClick={() => onInvite(email)}>
          Einladung senden
        </Button>
      }
    >
      <div className="flex flex-col gap-4">
        <Text color="muted">Wir schicken eine E-Mail mit einem Link zum Workspace.</Text>
        <Input
          label="E-Mail"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Select
          label="Rolle"
          value={role}
          onValueChange={setRole}
          options={[
            { value: 'Admin', label: 'Admin' },
            { value: 'Redakteur:in', label: 'Redakteur:in' },
            { value: 'Leser:in', label: 'Leser:in' },
          ]}
        />
      </div>
    </Dialog>
  );
}
