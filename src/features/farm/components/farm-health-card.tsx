import { View } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { StatRow } from '@/components/ui/stat-row';
import { Text } from '@/components/ui/text';
import { ValueUnit } from '@/components/ui/value-unit';
import { formatNumber } from '@/lib/utils';
import type { GardenBed } from '@/types/models';

import { summarizeBeds } from '../hooks/use-farm-overview';

type FarmHealthCardProps = {
  facilityName: string;
  beds: GardenBed[];
  isDemoData: boolean;
};

export function FarmHealthCard({ facilityName, beds, isDemoData }: FarmHealthCardProps) {
  const summary = summarizeBeds(beds);
  const stats = [
    { label: 'Garden beds', value: summary.total },
    { label: 'Healthy', value: summary.healthy },
    { label: 'Attention', value: summary.attention },
  ];

  return (
    <Card className="p-5">
      {isDemoData && <Badge label="Demo data" caps dot className="h-[22px] px-3" />}

      <Text variant="overline" tone="tertiary" className="mt-3">
        Farm overview
      </Text>
      <Text variant="subhead" tone="muted" className="mt-1.5">
        {facilityName}
      </Text>

      <ValueUnit value={String(summary.healthPercent)} unit="%" variant="display" className="mt-1" />
      <Text variant="caption" tone="muted" className="mt-0.5">
        Overall farm health
      </Text>

      <View className="my-4 h-px bg-border" />

      <StatRow items={stats.map((s) => ({ label: s.label, value: formatNumber(s.value) }))} />
    </Card>
  );
}
