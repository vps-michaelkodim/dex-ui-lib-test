import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

// Lockstep-Version aller @dextinity/*-Packages (Changesets, siehe AGENTS.md)
import pkg from '../../../packages/ui/package.json';

const dark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;

addons.setConfig({
  theme: create({
    base: dark ? 'dark' : 'light',
    brandTitle: `Dextinity UI · v${pkg.version}`,
    brandUrl:
      'https://github.com/vps-michaelkodim/dex-ui-lib-test/blob/main/packages/ui/CHANGELOG.md',
    brandTarget: '_blank',
  }),
});
