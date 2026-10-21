import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Base-UI-Subpfade vorab optimieren, sonst lädt Vite beim ersten Testlauf neu (flaky Tests).
  // Neue Base-UI-Komponente verwendet? Hier ergänzen.
  optimizeDeps: {
    include: [
      '@base-ui/react/button',
      '@base-ui/react/field',
      '@base-ui/react/input',
      '@base-ui/react/tooltip',
    ],
  },
});
