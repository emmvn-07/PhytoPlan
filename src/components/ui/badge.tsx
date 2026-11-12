import { View } from 'react-native';

import { cn } from '@/lib/utils';

import { Text, type TextTone } from './text';

const tones = {
  /** Green tint: "DEMO DATA", "Healthy", "completed", "Smart". */
  primary: { container: 'bg-primary-soft', text: 'primary', dot: 'bg-primary' },
  /** White chip over images: "B-01", "100% match". */
  light: { container: 'bg-highlight', text: 'default', dot: 'bg-text' },
  /** Dark glass chip over photos: "• Connected". */
  glass: { container: 'bg-black/40', text: 'onPrimary', dot: 'bg-progress' },
  /** Grey: "Idle". */
  idle: { container: 'bg-idle', text: 'offline', dot: 'bg-idle-text' },
  info: { container: 'bg-info-soft', text: 'info', dot: 'bg-info' },
  nutrient: { container: 'bg-nutrient-soft', text: 'nutrient', dot: 'bg-nutrient' },
} satisfies Record<string, { container: string; text: TextTone; dot: string }>;

export type BadgeTone = keyof typeof tones;

type BadgeProps = {
  label: string;
  tone?: BadgeTone;
  /** Leading status dot. */
  dot?: boolean;
  /** Uppercase, tracked label ("DEMO DATA"). */
  caps?: boolean;
  /** Padding/height; defaults to a compact pill. */
  className?: string;
};

export function Badge({ label, tone = 'primary', dot, caps, className = 'px-2 py-0.5' }: BadgeProps) {
  const t = tones[tone];
  return (
    <View className={cn('flex-row items-center gap-1.5 self-start rounded-full', t.container, className)}>
      {dot && <View className={cn('h-1.5 w-1.5 rounded-full', t.dot)} />}
      <Text
        variant={caps ? 'overline' : 'caption'}
        weight="medium"
        tone={t.text}
        className={caps ? 'tracking-[0.4px]' : undefined}>
        {label}
      </Text>
    </View>
  );
}
