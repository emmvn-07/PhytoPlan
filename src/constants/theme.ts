import { vars } from 'nativewind';
import { Platform } from 'react-native';

import { palette, toKebab } from './colors';

/** Raw color values, for props that can't take a className (icons, tab bar, placeholders). */
export const Colors = palette;
export type ThemeColor = keyof typeof palette.light;

/** CSS variables consumed by the Tailwind colors in tailwind.config.ts. Applied once at the app root. */
export const themeVars = {
  light: vars(cssVarsFor('light')),
  dark: vars(cssVarsFor('dark')),
};

function cssVarsFor(scheme: keyof typeof palette) {
  return Object.fromEntries(
    Object.entries(palette[scheme]).map(([name, value]) => [`--color-${toKebab(name)}`, value])
  );
}

/** Space reserved at the bottom of tab screens so content clears the native tab bar. */
export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
