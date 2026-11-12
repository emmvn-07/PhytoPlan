import { CloudSun, Sun, TriangleAlert } from 'lucide-react-native';
import { View } from 'react-native';

import { Gradient } from '@/components/ui/gradient';
import { Text } from '@/components/ui/text';
import { Colors, Shadows } from '@/constants/theme';
import { formatNumber } from '@/lib/utils';
import type { WeatherConditions } from '@/types/models';

/** Dark green gradient "Current conditions" card with advisories. */
export function ConditionsHero({ weather }: { weather: WeatherConditions }) {
  return (
    <View className="rounded-3xl" style={{ boxShadow: Shadows.card }}>
      <View className="overflow-hidden rounded-3xl p-[18px]">
        <Gradient from={Colors.heroFrom} to={Colors.heroTo} />
        <View className="flex-row items-start justify-between">
          <View>
            <Text variant="overline" tone="onPrimary" className="opacity-80">
              Current conditions
            </Text>
            <View
              accessible
              accessibilityLabel={`${formatNumber(weather.temperature, 1)} degrees Celsius`}
              className="mt-1.5 flex-row items-baseline gap-1.5">
              <Text variant="hero" tone="onPrimary">
                {formatNumber(weather.temperature, 1)}
              </Text>
              <Text variant="subhead" tone="onPrimary">
                °C
              </Text>
            </View>
            <Text variant="body" weight="regular" tone="onPrimary" className="mt-1 opacity-90">
              {`${weather.summary} · ${weather.humidity}% RH`}
            </Text>
          </View>
          <CloudSun size={34} color="rgba(255,255,255,0.85)" strokeWidth={1.5} />
        </View>

        <View className="my-3.5 h-px bg-white/20" />

        <View className="gap-3">
          {weather.advisories.map((a) => (
            <View key={a.text} className="flex-row items-start gap-2">
              {a.kind === 'warning' ? (
                <TriangleAlert size={15} color="#F2B544" />
              ) : (
                <Sun size={15} color="rgba(255,255,255,0.9)" />
              )}
              <Text variant="body" weight="regular" tone="onPrimary" className="flex-1">
                {a.text}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
