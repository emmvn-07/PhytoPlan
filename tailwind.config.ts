import type { Config } from 'tailwindcss';

import { palette, toKebab } from './src/constants/colors';

const colors = Object.fromEntries(
  Object.entries(palette).map(([name, value]) => [toKebab(name), value])
);

export default {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  presets: [require('nativewind/preset')],
  // Light only. 'class' (never toggled) also avoids NativeWind v4's web-only
  // "Cannot manually set color scheme, as dark mode is type 'media'" crash.
  darkMode: 'class',
  theme: {
    extend: {
      colors,
      // Inter ships one file per weight; on Android `fontWeight` can't pick a weight from a
      // custom family, so weight is chosen by family. Use these instead of font-medium/bold.
      fontFamily: {
        inter: ['Inter_400Regular'],
        'inter-medium': ['Inter_500Medium'],
        'inter-semibold': ['Inter_600SemiBold'],
        'inter-bold': ['Inter_700Bold'],
      },
    },
  },
} satisfies Config;
