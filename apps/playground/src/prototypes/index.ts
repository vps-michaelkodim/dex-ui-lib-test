import type { ComponentType } from 'react';
import { HelloDextinity } from './HelloDextinity';

export interface Prototype {
  id: string;
  title: string;
  Component: ComponentType;
}

export const prototypes: Prototype[] = [
  { id: 'hello', title: 'Hello Dextinity', Component: HelloDextinity },
];
