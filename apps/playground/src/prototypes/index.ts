import type { ComponentType } from 'react';
import { HelloDextinity } from './HelloDextinity';
import { ReleaseNotes } from './ReleaseNotes';
import { Settings } from './Settings';

export interface Prototype {
  id: string;
  title: string;
  Component: ComponentType;
}

export const prototypes: Prototype[] = [
  { id: 'hello', title: 'Hello Dextinity', Component: HelloDextinity },
  { id: 'settings', title: 'Einstellungen', Component: Settings },
  { id: 'release-notes', title: 'Release Notes', Component: ReleaseNotes },
];
