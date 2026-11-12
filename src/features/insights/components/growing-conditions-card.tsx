import { CloudSun, Droplets, RefreshCw, Sprout, Sun, Thermometer, Waves, type LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { IconCircle } from '@/components/ui/icon-circle';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/use-theme';
import type { GrowingConditions } from '@/types/models';

type GrowingConditionsCardProps = {
  conditions: GrowingConditions;
  generating: boolean;
  onGenerate: () => void;
};

export function GrowingConditionsCard({ conditions, generating, onGenerate }: GrowingConditionsCardProps) {
  const theme = useTheme();
  const items: { label: string; value: string; icon: LucideIcon }[] = [
    { label: 'Season', value: conditions.season, icon: Sun },
    { label: 'Water available', value: conditions.waterAvailable, icon: Droplets },
    { label: 'Temperature', value: conditions.temperature, icon: Thermometer },
    { label: 'Humidity', value: conditions.humidity, icon: Waves },
    { label: 'Soil moisture', value: conditions.soilMoisture, icon: Sprout },
    { label: 'Sunlight', value: conditions.sunlight, icon: Sun },
  ];
  const rows = [0, 2, 4].map((i) => items.slice(i, i + 2));

  return (
    <Card className="p-4">
      <View className="flex-row items-center gap-2.5">
        <IconCircle tone="neutral">
          <CloudSun size={16} color={theme.primary} />
        </IconCircle>
        <Text variant="section" weight="medium">
          Current growing conditions
        </Text>
      </View>

      <View className="mt-4 gap-3.5">
        {rows.map((row) => (
          <View key={row[0].label} className="flex-row gap-3">
            {row.map(({ label, value, icon: Icon }) => (
              <View key={label} accessible accessibilityLabel={`${label}: ${value}`} className="flex-1 flex-row gap-2">
                <View className="pt-0.5">
                  <Icon size={13} color={theme.textTertiary} />
                </View>
                <View className="flex-1 gap-0.5">
                  <Text variant="overline" tone="tertiary">
                    {label}
                  </Text>
                  <Text variant="body" weight="regular">
                    {value}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ))}
      </View>

      <Button
        className="mt-4"
        size="lg"
        icon={RefreshCw}
        title={generating ? 'Generating…' : 'Generate recommendation'}
        loading={generating}
        onPress={onGenerate}
      />
    </Card>
  );
}
