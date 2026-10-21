import { playwright } from '@vitest/browser-playwright';
import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.ts';

/**
 * Screenshot-Tests (Visual Regression). Getrennt von `pnpm test`, weil Referenzbilder
 * betriebssystemabhängig sind — maßgeblich sind die Bilder vom Mac (…-chromium-darwin.png).
 */
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      name: 'visual',
      include: ['visual/**/*.test.tsx'],
      browser: {
        enabled: true,
        headless: true,
        provider: playwright(),
        instances: [{ browser: 'chromium', viewport: { width: 1280, height: 900 } }],
        expect: {
          toMatchScreenshot: {
            comparatorName: 'pixelmatch',
            // threshold 0.02: auch kleine Farbänderungen (z.B. #403af2 → #4a44f2) schlagen an;
            // Kantenglättung ignoriert pixelmatch separat. 0.1 war zu großzügig (getestet).
            comparatorOptions: { threshold: 0.02, allowedMismatchedPixelRatio: 0.002 },
          },
        },
      },
    },
  }),
);
