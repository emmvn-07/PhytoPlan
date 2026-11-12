/**
 * Single source of truth for app colors — sampled from design-references/*.png.
 * Light only: the app does not support dark mode (app.json `userInterfaceStyle: "light"`).
 * Kept dependency-free so tailwind.config.ts can import it (runs in Node).
 *
 * Tailwind class names are the kebab-case keys: `bg-surface`, `text-text-secondary`, `bg-info-soft`…
 */
export const palette = {
  text: '#071B19',
  textSecondary: '#6F7769',
  textTertiary: '#848A74',
  /** Blue-grey secondary text on lists, chips and stats ("6 connected beds", "62%"). */
  slate: '#59677B',
  /** Navy titles on timeline cards. */
  ink: '#00365D',
  iconMuted: '#B4BBA6',

  background: '#F7F6EF',
  surface: '#FCFBF6',
  surfaceMuted: '#ECF1E4',
  /** 1px top-light edge on cards, white chips. */
  highlight: '#FFFFFF',
  border: '#EBEDE6',
  inputBorder: '#DFE7D8',
  /** Outlines of tinted buttons (Stop irrigation, Dispense water/nutrients, Harvest). */
  primaryBorder: '#C6DCCB',
  infoBorder: '#BCD5E5',
  nutrientBorder: '#D8CAEE',
  dangerBorder: '#F4C7C3',
  /** "Idle" chip */
  idle: '#E9ECEA',
  idleText: '#A0ACA9',

  primary: '#194D37',
  primarySoft: '#E9F2E9',
  primaryMuted: '#2E7054',
  accent: '#166E49',
  /** Darker green for "healthy" counts and survivability. */
  success: '#005A30',
  progress: '#6BA67C',
  onPrimary: '#FFFFFF',

  danger: '#DC252A',
  dangerSoft: '#FCE9E2',
  attention: '#D14C32',
  offline: '#929DAD',

  /** Temperature icons, advisories. */
  warning: '#BD751C',
  warningSoft: '#FFF0D9',
  /** Water / irrigation. */
  info: '#005584',
  infoSoft: '#E5F0F7',
  /** Nutrients. */
  nutrient: '#6436B3',
  nutrientSoft: '#F0EAF8',

  /** Calendar */
  todayRing: '#9BC2A1',
  recordDot: '#2D8A53',

  /** Gradients (start → end), used through <Gradient> */
  heroFrom: '#133B2B',
  heroTo: '#2C6950',
  tankFrom: '#8BCEAC',
  tankTo: '#2E6E51',
  tankBorder: '#D4E4D9',
  barFrom: '#90D4AE',
  barTo: '#266649',
  chartLine: '#00502D',
  chartArea: '#DCE6DA',
  toggle: '#2D7B46',
} as const;

export type ColorName = keyof typeof palette;

export const toKebab = (s: string) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
