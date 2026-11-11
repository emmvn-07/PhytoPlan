/**
 * Single source of truth for app colors.
 * Kept dependency-free so tailwind.config.ts can import it (runs in Node).
 *
 * Tailwind class names are the kebab-case keys: `bg-background-element`, `text-text-secondary`, `bg-primary`…
 */
export const palette = {
  light: {
    text: '#000000',
    textSecondary: '#60646C',
    background: '#ffffff',
    backgroundElement: '#F1F5EF',
    backgroundSelected: '#DDE8D8',
    primary: '#2E7D32',
    onPrimary: '#ffffff',
    border: '#D9DCD6',
    danger: '#C62828',
  },
  dark: {
    text: '#ffffff',
    textSecondary: '#B0B4BA',
    background: '#000000',
    backgroundElement: '#1C211C',
    backgroundSelected: '#2A332A',
    primary: '#66BB6A',
    onPrimary: '#0B1F0C',
    border: '#3A3D3A',
    danger: '#EF5350',
  },
} as const;

export type ColorName = keyof typeof palette.light;

export const toKebab = (s: string) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
