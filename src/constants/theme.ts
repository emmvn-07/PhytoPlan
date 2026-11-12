import { palette } from './colors';

/** Raw color values, for props that can't take a className (icons, gradients, charts). */
export const Colors = palette;
export type ThemeColor = keyof typeof palette;

/** RN `boxShadow` values (measured from design-references). Pass via `style`, not className. */
export const Shadows = {
  /** Soft lift for cards, tiles and the tab bar. */
  card: '0px 4px 16px rgba(36, 48, 28, 0.07)',
  /** Stronger green glow for filled elements (active tab, avatar). */
  raised: '0px 4px 12px rgba(22, 110, 73, 0.3)',
  /** Selected segment in a segmented control. */
  segment: '0px 2px 6px rgba(36, 48, 28, 0.1)',
} as const;

/** Floating tab bar geometry — screens use it to keep content scrollable above the bar. */
export const TabBar = {
  height: 52,
  /** Gap between the bar and the bottom safe-area edge. */
  bottomGap: 12,
  sideInset: 16,
  /** Inset of the active pill inside the bar. */
  padding: 3,
} as const;

export const MaxContentWidth = 800;
