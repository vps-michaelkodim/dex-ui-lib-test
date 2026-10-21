import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';

/**
 * Pipeline-Check (Phase 0): Tailwind kompiliert, Theme-Decorator läuft,
 * play()-Tests + a11y-Check laufen. Fliegt raus, sobald echte Komponenten da sind.
 */
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button
      type="button"
      className="rounded-md bg-black px-4 py-2 text-white dark:bg-white dark:text-black"
      onClick={() => setCount((c) => c + 1)}
    >
      Clicked {count}×
    </button>
  );
}

const meta = {
  title: 'Internal/Smoke',
  component: Counter,
  tags: ['!autodocs'],
} satisfies Meta<typeof Counter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await userEvent.click(button);
    await expect(button).toHaveTextContent('Clicked 1×');
  },
};
