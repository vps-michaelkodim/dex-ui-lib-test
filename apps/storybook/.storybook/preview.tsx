import type { Decorator, Preview } from '@storybook/react-vite';
import { useEffect, type ReactNode } from 'react';
import '../src/storybook.css';

const THEMES = ['light', 'dark', 'high-contrast'] as const;
const BRANDS = ['default'] as const;

/** Setzt data-theme / data-brand am <html>, genau wie in einer echten App. */
function ThemeRoot({
  theme,
  brand,
  children,
}: {
  theme: string;
  brand: string;
  children: ReactNode;
}) {
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.dataset.brand = brand;
  }, [theme, brand]);
  return children;
}

const withTheme: Decorator = (Story, context) => (
  <ThemeRoot
    theme={(context.globals.theme as string) ?? 'light'}
    brand={(context.globals.brand as string) ?? 'default'}
  >
    <Story />
  </ThemeRoot>
);

const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    theme: {
      description: 'Theme',
      toolbar: {
        title: 'Theme',
        icon: 'contrast',
        items: THEMES.map((value) => ({ value, title: value })),
        dynamicTitle: true,
      },
    },
    brand: {
      description: 'Brand',
      toolbar: {
        title: 'Brand',
        icon: 'paintbrush',
        items: BRANDS.map((value) => ({ value, title: value })),
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
    brand: 'default',
  },
  parameters: {
    layout: 'centered',
    controls: { expanded: true },
    a11y: {
      // a11y-Verstöße lassen Tests fehlschlagen (Storybook-UI + Vitest).
      test: 'error',
    },
    options: {
      storySort: {
        order: ['Introduction', 'Foundations', 'Components', 'Patterns', '*'],
      },
    },
  },
  tags: ['autodocs'],
};

export default preview;
