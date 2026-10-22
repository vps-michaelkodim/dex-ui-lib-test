import { createContext, useContext, useSyncExternalStore } from 'react';

export interface AppShellContextValue {
  /** Mobile (< 1024px, gleiche Grenze wie die Responsive-Tokens). */
  mobile: boolean;
  /** Desktop: Sidebar ausgeklappt · Mobile: Drawer offen. */
  navigationOpen: boolean;
  /** Desktop: ein-/ausklappen · Mobile: Drawer öffnen/schließen. */
  toggleNavigation: () => void;
}

export const AppShellContext = createContext<AppShellContextValue | null>(null);

/** Zustand der umgebenden `AppShell` (oder `null` außerhalb). */
export function useAppShell() {
  return useContext(AppShellContext);
}

/** Gleiche Grenze wie `@media (max-width: 1023.98px)` in den Tokens. */
const MOBILE_QUERY = '(max-width: 1023.98px)';

export function useIsMobile() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(MOBILE_QUERY);
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    },
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => false,
  );
}
