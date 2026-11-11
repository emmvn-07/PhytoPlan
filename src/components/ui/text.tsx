import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { cn } from '@/lib/utils';

const variants = {
  default: 'text-base font-medium',
  small: 'text-sm font-medium',
  smallBold: 'text-sm font-bold',
  subtitle: 'text-[32px] leading-[44px] font-semibold',
  title: 'text-5xl font-semibold',
} as const;

const tones = {
  default: 'text-text',
  muted: 'text-text-secondary',
  primary: 'text-primary',
  danger: 'text-danger',
  onPrimary: 'text-on-primary',
} as const;

export type TextProps = RNTextProps & {
  variant?: keyof typeof variants;
  tone?: keyof typeof tones;
};

/** App typography. Colors follow light/dark mode automatically. */
export function Text({ variant = 'default', tone = 'default', className, ...rest }: TextProps) {
  return <RNText className={cn(variants[variant], tones[tone], className)} {...rest} />;
}
