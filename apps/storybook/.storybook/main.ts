import type { StorybookConfig } from '@storybook/react-vite';
import remarkGfm from 'remark-gfm';

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(ts|tsx)',
    '../../../packages/*/src/**/*.stories.@(ts|tsx)',
  ],
  addons: [
    {
      name: '@storybook/addon-docs',
      // Markdown-Tabellen in MDX-Seiten (Introduction)
      options: { mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: [remarkGfm] } } },
    },
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
    // „Design“-Tab: zeigt den Figma-Frame zur Story (parameters.design)
    '@storybook/addon-designs',
  ],
  typescript: {
    // Prop-Tabellen + JSDoc („Figma: …“) auch für Komponenten aus packages/*
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      tsconfigPath: './tsconfig.json',
      include: ['src/**/*.tsx', '../../packages/*/src/**/*.tsx'],
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      propFilter: (prop, component) =>
        !prop.parent ||
        !/node_modules/.test(prop.parent.fileName) ||
        ['render', 'nativeButton', 'focusableWhenDisabled'].includes(prop.name) ||
        // Checkbox, Radio, Switch: Wert/Zustand kommen aus Base UI
        (['Checkbox', 'Radio', 'Switch'].includes(component.name) &&
          [
            'checked',
            'defaultChecked',
            'onCheckedChange',
            'value',
            'name',
            'required',
            'parent',
          ].includes(prop.name)),
    },
  },
  core: {
    disableTelemetry: true,
  },
};

export default config;
