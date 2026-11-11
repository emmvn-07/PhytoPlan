import type { Config } from 'tailwindcss';

import { palette, toKebab } from './src/constants/colors';

// Each color resolves to a CSS variable set at the app root (see `themeVars` in src/constants/theme.ts),
// so light/dark mode switches without `dark:` variants.
const colors = Object.fromEntries(
  Object.keys(palette.light).map((name) => [toKebab(name), `var(--color-${toKebab(name)})`])
);

export default {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  presets: [require('nativewind/preset')],
  theme: {
    extend: { colors },
  },
} satisfies Config;
