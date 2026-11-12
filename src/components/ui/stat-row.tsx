import { Fragment } from 'react';
import { View } from 'react-native';

import { cn } from '@/lib/utils';

import { Text, type TextTone } from './text';

export type StatItem = { value: string; label: string; tone?: TextTone };

type StatRowProps = {
  items: StatItem[];
  /** "start": left-aligned columns (overview); "center": centered with dividers (beds). */
  align?: 'start' | 'center';
  /** Value size: stat (19pt) or value (16pt). */
  size?: 'stat' | 'value';
  className?: string;
};

/** Row of numbers with uppercase labels: "6 GARDEN BEDS · 3 HEALTHY · 3 ATTENTION". */
export function StatRow({ items, align = 'start', size = 'stat', className }: StatRowProps) {
  const centered = align === 'center';
  return (
    <View className={cn('flex-row', className)}>
      {items.map((item, i) => (
        <Fragment key={item.label}>
          {centered && i > 0 && <View className="my-1 w-px bg-border" />}
          <View
            accessible
            accessibilityLabel={`${item.value} ${item.label}`}
            className={cn('flex-1 gap-1', centered && 'items-center')}>
            <Text variant={size} tone={item.tone}>
              {item.value}
            </Text>
            <Text variant="overline" tone="tertiary">
              {item.label}
            </Text>
          </View>
        </Fragment>
      ))}
    </View>
  );
}
