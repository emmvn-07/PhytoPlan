import type { ReactNode } from 'react';
import { View } from 'react-native';

import { cn } from '@/lib/utils';

import { Text } from './text';

/** "Environmental monitoring ………… • Live" — title with an optional right-hand slot. */
export function SectionHeader({
  title,
  right,
  className,
}: {
  title: string;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <View className={cn('flex-row items-center justify-between px-3', className)}>
      <Text variant="section" accessibilityRole="header">
        {title}
      </Text>
      {right}
    </View>
  );
}
