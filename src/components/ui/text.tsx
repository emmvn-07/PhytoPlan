import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { cn } from '@/lib/utils';

/** Inter weight → font family class (see tailwind.config.ts). */
const weights = {
  regular: 'font-inter',
  medium: 'font-inter-medium',
  semibold: 'font-inter-semibold',
  bold: 'font-inter-bold',
} as const;

export type TextWeight = keyof typeof weights;

/** Type scale measured from design-references at 393pt width: [size classes, default weight]. */
const variants = {
  /** "50" — hero number */
  display: ['text-[44px] leading-[48px] tracking-[-1.2px]', 'bold'],
  /** "Good evening, Angel" — greeting */
  heading: ['text-[25px] leading-[27px] tracking-[-0.6px]', 'bold'],
  /** "Garden Beds" — screen title */
  title: ['text-[22px] leading-[27px] tracking-[-0.5px]', 'bold'],
  /** "30.4" on the calendar hero */
  hero: ['text-[34px] leading-[38px] tracking-[-0.8px]', 'bold'],
  /** "1,240" — large card value */
  metricLg: ['text-[26px] leading-[30px] tracking-[-0.5px]', 'semibold'],
  /** "30.4" — metric tile value */
  metric: ['text-[23px] leading-[28px] tracking-[-0.4px]', 'semibold'],
  /** "6" — stat number */
  stat: ['text-[19px] leading-[24px]', 'semibold'],
  /** "3,860 L", "Connected" — small value */
  value: ['text-[16px] leading-[21px]', 'semibold'],
  /** "Environmental monitoring" — section title */
  section: ['text-[14px] leading-[20px]', 'semibold'],
  /** "Monday, November 9", button labels */
  subhead: ['text-[13px] leading-[18px]', 'regular'],
  /** "Butterhead Lettuce" — card/list title */
  body: ['text-[12px] leading-[16px]', 'medium'],
  /** "about 21 hours ago" — secondary line */
  caption: ['text-[11px] leading-[15px]', 'regular'],
  /** "AIR TEMP" — uppercase label */
  overline: ['text-[10px] leading-[14px] uppercase tracking-[1px]', 'medium'],
  /** "°C", "%", "L" next to a value */
  unit: ['text-[10.5px] leading-[14px]', 'regular'],
  /** Tiny labels (chart axes, camera overlays) */
  micro: ['text-[9px] leading-[12px]', 'regular'],
} as const;

const tones = {
  default: 'text-text',
  muted: 'text-text-secondary',
  tertiary: 'text-text-tertiary',
  slate: 'text-slate',
  ink: 'text-ink',
  offline: 'text-offline',
  primary: 'text-primary',
  success: 'text-success',
  danger: 'text-danger',
  info: 'text-info',
  nutrient: 'text-nutrient',
  warning: 'text-warning',
  onPrimary: 'text-on-primary',
} as const;

export type TextVariant = keyof typeof variants;
export type TextTone = keyof typeof tones;

export type TextProps = RNTextProps & {
  variant?: TextVariant;
  tone?: TextTone;
  /** Overrides the variant's default weight. */
  weight?: TextWeight;
};

/** App typography in Inter. Don't use font-medium/font-bold classes — pass `weight`. */
export function Text({ variant = 'body', tone = 'default', weight, className, ...rest }: TextProps) {
  const [size, defaultWeight] = variants[variant];
  return (
    <RNText className={cn(size, weights[weight ?? defaultWeight], tones[tone], className)} {...rest} />
  );
}
