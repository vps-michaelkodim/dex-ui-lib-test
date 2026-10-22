/**
 * Visual Regression: ausgewählte Stories × Themes/Brands als Screenshot gegen Referenzbilder.
 *
 *   pnpm test:visual          vergleichen
 *   pnpm test:visual:update   Referenzbilder neu erzeugen (nach gewollten Design-Änderungen)
 *
 * Referenzbilder liegen in visual/__screenshots__/ und sind pro Betriebssystem getrennt
 * (Dateiname endet auf -chromium-darwin.png). Maßgeblich sind die Mac-Bilder.
 */
import { composeStories } from '@storybook/react-vite';
import type { ComponentType } from 'react';
import { beforeAll, describe, expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import '../src/storybook.css';
import * as AppShellStories from '../../../packages/ui/src/components/app-shell/AppShell.stories';
import * as ButtonStories from '../../../packages/ui/src/components/button/Button.stories';
import * as CheckboxStories from '../../../packages/ui/src/components/checkbox/Checkbox.stories';
import * as ChipStories from '../../../packages/ui/src/components/chip/Chip.stories';
import * as DialogStories from '../../../packages/ui/src/components/dialog/Dialog.stories';
import * as FormStories from '../../../packages/ui/src/components/form/Form.stories';
import * as IconButtonStories from '../../../packages/ui/src/components/icon-button/IconButton.stories';
import * as InputStories from '../../../packages/ui/src/components/input/Input.stories';
import * as MainNavigationStories from '../../../packages/ui/src/components/main-navigation/MainNavigation.stories';
import * as RadioStories from '../../../packages/ui/src/components/radio/Radio.stories';
import * as SearchStories from '../../../packages/ui/src/components/search/Search.stories';
import * as SelectStories from '../../../packages/ui/src/components/select/Select.stories';
import * as SnackbarStories from '../../../packages/ui/src/components/snackbar/Snackbar.stories';
import * as SwitchStories from '../../../packages/ui/src/components/switch/Switch.stories';
import * as TextStories from '../../../packages/ui/src/components/text/Text.stories';
import * as ToolbarStories from '../../../packages/ui/src/components/toolbar/Toolbar.stories';
import * as TooltipStories from '../../../packages/ui/src/components/tooltip/Tooltip.stories';

const button = composeStories(ButtonStories);
const iconButton = composeStories(IconButtonStories);
const input = composeStories(InputStories);
const chip = composeStories(ChipStories);
const tooltip = composeStories(TooltipStories);
const checkbox = composeStories(CheckboxStories);
const radio = composeStories(RadioStories);
const switchStories = composeStories(SwitchStories);
const select = composeStories(SelectStories);
const search = composeStories(SearchStories);
const form = composeStories(FormStories);
const text = composeStories(TextStories);
const mainNavigation = composeStories(MainNavigationStories);
const dialog = composeStories(DialogStories);
const snackbar = composeStories(SnackbarStories);
const toolbar = composeStories(ToolbarStories);
const appShell = composeStories(AppShellStories);

/** Welche Stories fotografiert werden. `page: true` = ganze Seite (z.B. Tooltips im Portal). */
const CASES: { name: string; Story: ComponentType; page?: boolean }[] = [
  { name: 'button-matrix', Story: button.Matrix },
  { name: 'button-with-icons', Story: button.WithIcons },
  {
    name: 'button-states',
    Story: () => (
      <>
        <button.Disabled />
        <button.Loading />
      </>
    ),
  },
  { name: 'icon-button-matrix', Story: iconButton.Matrix },
  { name: 'input-states', Story: input.States },
  { name: 'input-adornments', Story: input.Adornments },
  { name: 'chip-matrix', Story: chip.Matrix },
  { name: 'chip-sizes', Story: chip.Sizes },
  { name: 'tooltip-colors', Story: tooltip.Colors, page: true },
  { name: 'checkbox-states', Story: checkbox.States },
  { name: 'checkbox-group', Story: checkbox.GroupWithError },
  { name: 'radio-states', Story: radio.States },
  { name: 'switch-states', Story: switchStories.States },
  { name: 'select-states', Story: select.States },
  { name: 'search-states', Story: search.States },
  { name: 'form-inline', Story: form.Inline },
  { name: 'text-variants', Story: text.Variants },
  { name: 'main-navigation', Story: mainNavigation.Default },
  { name: 'dialog-open', Story: dialog.Open, page: true },
  { name: 'snackbar-colors', Story: snackbar.Colors },
  { name: 'toolbar-matrix', Story: toolbar.Matrix },
  {
    name: 'app-shell',
    Story: () => (
      <div className="w-[1240px]">
        <appShell.Playground />
      </div>
    ),
    page: true,
  },
  {
    name: 'app-shell-collapsed',
    Story: () => (
      <div className="w-[1240px]">
        <appShell.Collapsed />
      </div>
    ),
    page: true,
  },
  { name: 'app-shell-sidebar', Story: appShell.SidebarStates },
];

const MODES = [
  { theme: 'light', brand: 'dextinity' },
  { theme: 'dark', brand: 'dextinity' },
  { theme: 'high-contrast', brand: 'dextinity' },
  { theme: 'light', brand: 'crimson' },
] as const;

beforeAll(async () => {
  // Stabile Bilder: keine Animationen/Transitions, kein blinkender Cursor
  const style = document.createElement('style');
  style.textContent =
    '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}';
  document.head.append(style);
  await Promise.all(
    [
      '400 16px Inter',
      '500 16px Inter',
      '600 16px Inter',
      '700 16px Inter',
      '400 16px "Source Sans Pro"',
      '600 16px "Source Sans Pro"',
    ].map((f) => document.fonts.load(f)),
  );
});

for (const mode of MODES) {
  describe(`${mode.theme} · ${mode.brand}`, () => {
    for (const { name, Story, page: fullPage } of CASES) {
      test(name, async () => {
        document.documentElement.dataset.theme = mode.theme;
        document.documentElement.dataset.brand = mode.brand;
        await render(
          <div data-testid="shot" className="inline-block p-4">
            <Story />
          </div>,
        );
        await document.fonts.ready;
        const file = `${name}--${mode.theme}-${mode.brand}`;
        if (fullPage) await expect(page).toMatchScreenshot(file);
        else await expect.element(page.getByTestId('shot')).toMatchScreenshot(file);
      });
    }
  });
}
