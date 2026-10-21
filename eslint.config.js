import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import storybook from 'eslint-plugin-storybook';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      '**/dist',
      '**/storybook-static',
      '**/node_modules',
      '**/build',
      // Figma-Plugin-Scripts: top-level return/await, laufen in Figma, nicht in Node
      '**/*.figma.js',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: { globals: { ...globals.browser } },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
  {
    files: ['**/scripts/**', '**/*.mjs', '**/*.config.{js,ts,mjs}', '**/.storybook/**'],
    languageOptions: { globals: { ...globals.node } },
  },
  {
    // Figma-Plugin: läuft in der Figma-Sandbox
    files: ['tools/figma-plugin/**/*.js'],
    languageOptions: { globals: { figma: 'readonly', __html__: 'readonly' } },
  },
  ...storybook.configs['flat/recommended'],
);
