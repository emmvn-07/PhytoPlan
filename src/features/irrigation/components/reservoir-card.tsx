import { Droplets } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { View } from 'react-native';

import { Card } from '@/components/ui/card';
import { Gradient } from '@/components/ui/gradient';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Text } from '@/components/ui/text';
import { Colors } from '@/constants/theme';
import { formatNumber } from '@/lib/utils';
import type { Reservoir } from '@/types/models';

/** Below this share the reservoir needs a refill (El Niño advisory: "keep above 40%"). */
const LOW_LEVEL = 0.4;

/** Vertical tank gauge + capacity text (design-references 3 and 7). `children` = optional footer. */
export function ReservoirCard({ reservoir, children }: { reservoir: Reservoir; children?: ReactNode }) {
  const level = reservoir.capacityLiters ? reservoir.remainingLiters / reservoir.capacityLiters : 0;
  const pct = Math.round(level * 100);
  const low = level < LOW_LEVEL;

  return (
    <Card className="p-4">
      <View className="flex-row gap-4">
        <View
          accessible
          accessibilityRole="progressbar"
          accessibilityLabel="Water reservoir level"
          accessibilityValue={{ min: 0, max: 100, now: pct }}
          className="h-[150px] w-[66px] overflow-hidden rounded-[20px] border-[1.5px] border-tank-border bg-surface-muted">
          <View className="absolute inset-x-0 bottom-0 overflow-hidden" style={{ height: `${pct}%` }}>
            <Gradient from={Colors.tankFrom} to={Colors.tankTo} direction="vertical" />
            {/* Graduation marks */}
            <View className="absolute inset-x-0 top-[6px] h-px bg-white/80" />
            <View className="absolute inset-x-0 top-[30%] h-px bg-white/60" />
          </View>
          <Text variant="caption" weight="semibold" className="absolute inset-x-0 top-3 text-center">
            {`${pct}%`}
          </Text>
        </View>

        <View className="flex-1 pt-1">
          <Text variant="overline" tone="tertiary">
            Water reservoir
          </Text>
          <View className="mt-1 flex-row items-baseline gap-1">
            <Text variant="metricLg" weight="semibold">
              {formatNumber(reservoir.remainingLiters)}
            </Text>
            <Text variant="caption" tone="slate">
              L remaining
            </Text>
          </View>
          <Text variant="caption" tone="slate" className="mt-0.5">
            {`Capacity ${formatNumber(reservoir.capacityLiters)} L · ${formatNumber(reservoir.capacityLiters - reservoir.remainingLiters)} L free`}
          </Text>
          <View className="mt-3">
            <ProgressBar value={level} label="Reservoir level" gradient />
          </View>
          <View className="mt-2.5 flex-row items-start gap-1.5">
            <Droplets size={13} color={low ? Colors.danger : Colors.primary} />
            <Text variant="caption" tone={low ? 'danger' : 'primary'} className="flex-1">
              {low
                ? 'Reservoir is below 40% — refill soon.'
                : 'Reservoir level is within the safe operating range.'}
            </Text>
          </View>
        </View>
      </View>
      {children}
    </Card>
  );
}
