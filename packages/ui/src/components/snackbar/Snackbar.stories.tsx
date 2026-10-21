import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { figmaDesign } from '../../lib/figma';
import { Button } from '../button';
import { Snackbar, SnackbarProvider, useSnackbar } from './Snackbar';

const meta = {
  title: 'Components/Snackbar',
  component: Snackbar,
  args: { children: 'Deine Änderungen wurden gespeichert.', onClose: fn() },
  argTypes: {
    color: { control: 'inline-radio', options: ['default', 'info', 'success', 'warning', 'error'] },
  },
  parameters: {
    design: figmaDesign('1428:163'),
    docs: {
      description: {
        component:
          'Figma: `03 Components / Snackbar`. Kurze Rückmeldung nach einer Aktion, unten mittig, verschwindet nach ein paar Sekunden. In der App einmal `SnackbarProvider` um alles legen und mit `useSnackbar().show({...})` anzeigen. Für Entscheidungen oder Pflichtinfos `Dialog` verwenden.',
      },
    },
  },
} satisfies Meta<typeof Snackbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { action: { label: 'Rückgängig', onClick: fn() } } };

export const Colors: Story = {
  parameters: { layout: 'padded' },
  // Bekannter Befund #38: Text-Button auf farbigen Flächen (Dark) — bis zur Prüfung nur Warnung.
  render: () => (
    <div className="flex w-120 flex-col gap-3">
      <Snackbar onClose={() => {}} action={{ label: 'Rückgängig', onClick: () => {} }}>
        Deine Änderungen wurden gespeichert.
      </Snackbar>
      <Snackbar color="info" onClose={() => {}}>
        Neue Version verfügbar.
      </Snackbar>
      <Snackbar
        color="success"
        title="Gespeichert"
        onClose={() => {}}
        action={{ label: 'Rückgängig', onClick: () => {} }}
      >
        Deine Änderungen wurden gespeichert.
      </Snackbar>
      <Snackbar color="warning" onClose={() => {}}>
        Verbindung instabil. Wir versuchen es weiter.
      </Snackbar>
      <Snackbar
        color="error"
        title="Speichern fehlgeschlagen"
        onClose={() => {}}
        action={{ label: 'Erneut versuchen', onClick: () => {} }}
      >
        Bitte prüfe deine Verbindung und versuch es noch einmal.
      </Snackbar>
    </div>
  ),
};

function Demo({ onUndo }: { onUndo: () => void }) {
  const snackbar = useSnackbar();
  return (
    <Button
      onClick={() =>
        snackbar.show({
          color: 'success',
          message: 'Benutzer entfernt.',
          action: { label: 'Rückgängig', onClick: onUndo },
        })
      }
    >
      Benutzer entfernen
    </Button>
  );
}

export const WithProvider: Story = {
  name: 'Mit useSnackbar',
  args: { onUndo: fn() } as never,
  render: (args) => (
    <SnackbarProvider>
      <Demo onUndo={(args as unknown as { onUndo: () => void }).onUndo} />
    </SnackbarProvider>
  ),
  play: async ({ canvasElement, args }) => {
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Benutzer entfernen' }),
    );
    const message = await body.findByText('Benutzer entfernt.');
    await waitFor(() => expect(message).toBeVisible());
    await userEvent.click(body.getByRole('button', { name: 'Rückgängig' }));
    await expect((args as unknown as { onUndo: () => void }).onUndo).toHaveBeenCalled();
    await waitFor(() => expect(body.queryByText('Benutzer entfernt.')).toBeNull());
  },
};
