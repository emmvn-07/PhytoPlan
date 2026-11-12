import { View } from 'react-native';

import { cn } from '@/lib/utils';

import { Text, type TextTone } from './text';

const dotClass = {
  primary: 'bg-primary',
  danger: 'bg-danger',
  tertiary: 'bg-text-tertiary',
  muted: 'bg-text-secondary',
  offline: 'bg-offline',
} as const;

type StatusDotProps = {
  label: string;
  tone: keyof typeof dotClass & TextTone;
  /** Dot color only, label stays muted ("• Live"). */
  dotOnly?: boolean;
  className?: string;
};

/** Small dot + label: "• Healthy", "• Needs attention", "• Live". */
export function StatusDot({ label, tone, dotOnly, className }: StatusDotProps) {
  return (
    <View className={cn('flex-row items-center gap-1.5', className)}>
      <View className={cn('h-[5px] w-[5px] rounded-full', dotClass[tone])} />
      <Text variant="caption" tone={dotOnly ? 'muted' : tone}>
        {label}
      </Text>
    </View>
  );
}
