import type { ReactNode } from 'react';
import { View } from 'react-native';

import { cn } from '@/lib/utils';

const tones = {
  neutral: 'bg-surface-muted',
  primary: 'bg-primary-soft',
  danger: 'bg-danger-soft',
  info: 'bg-info-soft',
  nutrient: 'bg-nutrient-soft',
  warning: 'bg-warning-soft',
} as const;

export type IconCircleTone = keyof typeof tones;

const sizes = { sm: 'h-6 w-6', md: 'h-[34px] w-[34px]', lg: 'h-9 w-9' } as const;

/** Tinted circle (or rounded square) holding an icon — list rows, card headers, metric tiles. */
export function IconCircle({
  children,
  tone = 'neutral',
  size = 'md',
  square,
}: {
  children: ReactNode;
  tone?: IconCircleTone;
  size?: keyof typeof sizes;
  /** Rounded square instead of a circle (metric tiles). */
  square?: boolean;
}) {
  return (
    <View
      className={cn(
        'items-center justify-center',
        sizes[size],
        square ? 'rounded-lg' : 'rounded-full',
        tones[tone]
      )}>
      {children}
    </View>
  );
}
