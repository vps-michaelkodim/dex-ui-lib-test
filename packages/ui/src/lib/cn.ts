import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Klassen zusammenführen; spätere Tailwind-Klassen gewinnen Konflikte. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
