import { ChevronRight } from 'lucide-react-native';
import { View } from 'react-native';

import { Card } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Text } from '@/components/ui/text';
import { ValueUnit } from '@/components/ui/value-unit';
import { useTheme } from '@/hooks/use-theme';
import { formatNumber } from '@/lib/utils';
import type { WaterUsage } from '@/types/models';

export function WaterConservationCard({ water }: { water: WaterUsage }) {
  const theme = useTheme();
  const total = water.savedLiters + water.consumedLiters;
  const conservedRatio = total ? water.savedLiters / total : 0;

  return (
    <Card className="p-4">
      <View className="flex-row items-start justify-between">
        <Text variant="overline" tone="tertiary">
          Saved this month
        </Text>
        <ChevronRight size={16} color={theme.textSecondary} />
      </View>

      <ValueUnit value={formatNumber(water.savedLiters)} unit="L" variant="metricLg" className="mt-2.5" />
      <Text variant="caption" tone="muted" className="mt-1">
        {`${formatNumber(water.consumedLiters)} L consumed · ${Math.round(conservedRatio * 100)}% conserved`}
      </Text>

      <View className="mt-3.5">
        <ProgressBar value={conservedRatio} label="Water conserved this month" />
      </View>
    </Card>
  );
}
