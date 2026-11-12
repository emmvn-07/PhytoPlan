import { View } from 'react-native';

import { cn } from '@/lib/utils';

import { Text } from './text';

type ValueUnitProps = {
  value: string;
  unit?: string;
  variant?: 'display' | 'metricLg' | 'metric' | 'stat';
  /** Value color; units are always muted. */
  tone?: 'default' | 'primary' | 'danger';
  className?: string;
};

/** A number followed by a small muted unit on the same baseline: "30.4 °C", "50 %". */
export function ValueUnit({ value, unit, variant = 'metric', tone = 'default', className }: ValueUnitProps) {
  return (
    <View
      accessible
      accessibilityLabel={unit ? `${value} ${unit}` : value}
      className={cn('flex-row items-baseline', variant === 'display' ? 'gap-2' : 'gap-1', className)}>
      <Text variant={variant} tone={tone}>
        {value}
      </Text>
      {unit ? (
        <Text variant="unit" tone="tertiary">
          {unit}
        </Text>
      ) : null}
    </View>
  );
}
