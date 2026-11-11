import { CalendarClock, Droplets, Leaf } from 'lucide-react-native';
import { View } from 'react-native';

import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/use-theme';
import { daysSince, formatDaysAgo } from '@/lib/utils';
import type { Plant } from '@/types/models';

export function PlantCard({ plant }: { plant: Plant }) {
  const theme = useTheme();
  const needsWater = daysSince(plant.lastWateredAt) >= plant.wateringIntervalDays;

  return (
    <Card accessible accessibilityLabel={`${plant.name}, ${plant.location}`}>
      <View className="flex-row items-center gap-2">
        <Leaf size={18} color={theme.primary} />
        <Text variant="smallBold" className="flex-1">
          {plant.name}
        </Text>
        {needsWater && (
          <Text variant="small" tone="danger">
            Needs water
          </Text>
        )}
      </View>

      <Text variant="small" tone="muted">
        {plant.species} · {plant.location}
      </Text>

      <View className="flex-row gap-4">
        <View className="flex-row items-center gap-1">
          <Droplets size={14} color={theme.textSecondary} />
          <Text variant="small" tone="muted">
            {plant.moisture === null ? 'No sensor' : `${plant.moisture}%`}
          </Text>
        </View>
        <View className="flex-row items-center gap-1">
          <CalendarClock size={14} color={theme.textSecondary} />
          <Text variant="small" tone="muted">
            Watered {formatDaysAgo(plant.lastWateredAt)}
          </Text>
        </View>
      </View>
    </Card>
  );
}
