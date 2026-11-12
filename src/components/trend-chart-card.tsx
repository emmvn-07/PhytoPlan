import type { ReactNode } from 'react';
import { View } from 'react-native';

import { Card } from '@/components/ui/card';
import { ChipGroup } from '@/components/ui/chip-group';
import { LineChart } from '@/components/ui/line-chart';
import { formatShortDate } from '@/lib/utils';
import type { TrendPoint } from '@/types/models';

type TrendChartCardProps<T extends string> = {
  /** Optional title row (icon + title). */
  header?: ReactNode;
  metrics: { label: string; value: T }[];
  metric: T;
  onMetricChange: (metric: T) => void;
  data: TrendPoint[];
  caption: string;
};

/** Metric chips + line chart + caption (bed detail "Temperature & trends", analytics trends). */
export function TrendChartCard<T extends string>({
  header,
  metrics,
  metric,
  onMetricChange,
  data,
  caption,
}: TrendChartCardProps<T>) {
  const label = metrics.find((m) => m.value === metric)?.label ?? '';
  return (
    <Card className="p-4">
      {header}
      <ChipGroup
        className={header ? 'mt-4' : undefined}
        variant="muted"
        scroll
        options={metrics}
        value={metric}
        onChange={onMetricChange}
        accessibilityLabel="Chart metric"
      />
      <View className="mt-4">
        <LineChart
          data={data.map((p) => ({ label: formatShortDate(p.date), value: p.value }))}
          caption={caption}
          accessibilityLabel={`${label} trend: ${data.map((p) => p.value).join(', ')}`}
        />
      </View>
    </Card>
  );
}
