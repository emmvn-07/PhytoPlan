import { router } from 'expo-router';
import { Droplets, Sparkles, SlidersHorizontal, Thermometer, TriangleAlert } from 'lucide-react-native';
import { ActivityIndicator, Pressable, ScrollView, useWindowDimensions, View } from 'react-native';

import { IconCircle } from '@/components/ui/icon-circle';
import { ListRow } from '@/components/ui/list-row';
import { MetricTile } from '@/components/ui/metric-tile';
import { Screen } from '@/components/ui/screen';
import { SectionHeader } from '@/components/ui/section-header';
import { StatusDot } from '@/components/ui/status-dot';
import { Text } from '@/components/ui/text';
import { TextLink } from '@/components/ui/text-link';
import { BedCard, openBed } from '@/features/beds/components/bed-card';
import { FarmHeader } from '@/features/farm/components/farm-header';
import { FarmHealthCard } from '@/features/farm/components/farm-health-card';
import { WaterConservationCard } from '@/features/farm/components/water-conservation-card';
import { useFarmOverview } from '@/features/farm/hooks/use-farm-overview';
import { useTheme } from '@/hooks/use-theme';
import { formatNumber, formatTimeAgo } from '@/lib/utils';
import { mockCurrentUser } from '@/mocks/user';

export default function FarmOverviewScreen() {
  const { data, isLoading, error } = useFarmOverview();
  const theme = useTheme();
  const { width } = useWindowDimensions();
  // Reference: 138pt bed cards on a 393pt screen (≈2.6 cards visible).
  const bedCardWidth = Math.round(Math.min(width, 600) * 0.352);

  return (
    <Screen withTabBar contentClassName="px-4 pt-4">
      <FarmHeader name={mockCurrentUser.fullName} />

      {isLoading ? (
        <View className="mt-10">
          <ActivityIndicator color={theme.primary} accessibilityLabel="Loading farm overview" />
        </View>
      ) : error || !data ? (
        <Text tone="danger" className="mt-6 px-2">
          {error ?? 'Could not load the farm overview.'}
        </Text>
      ) : (
        <>
          <View className="mt-2">
            <FarmHealthCard facilityName={data.facilityName} beds={data.beds} isDemoData={data.isDemoData} />
          </View>

          <View className="mt-5">
            <ListRow
              leading={
                <IconCircle>
                  <Sparkles size={17} color={theme.primary} />
                </IconCircle>
              }
              title="ADSS engine"
              subtitle="ET0 decisions, water volumes and audit trail"
              onPress={() => router.navigate('/irrigation-control')}
            />
          </View>

          <SectionHeader
            title="Environmental monitoring"
            right={<StatusDot label="Live" tone="primary" dotOnly />}
            className="mt-6"
          />
          <View className="mt-3 gap-2.5">
            <View className="flex-row gap-2.5">
              <MetricTile label="Air temp" value={formatNumber(data.environment.airTemp, 1)} unit="°C" icon={Thermometer} />
              <MetricTile label="Humidity" value={formatNumber(data.environment.humidity)} unit="%" icon={Droplets} />
            </View>
            <View className="flex-row gap-2.5">
              <MetricTile label="VPD" value={formatNumber(data.environment.vpd, 2)} unit="kPa" icon={SlidersHorizontal} />
              <MetricTile label="CTD" value={formatNumber(data.environment.ctd, 1)} unit="°C" icon={SlidersHorizontal} />
            </View>
          </View>

          <SectionHeader title="Water conservation" className="mt-6" />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Water conservation, open analytics"
            onPress={() => router.navigate('/insights-analytics')}
            className="mt-3 active:opacity-80">
            <WaterConservationCard water={data.water} />
          </Pressable>

          <SectionHeader
            title="Garden beds"
            right={<TextLink label="View all" accessibilityLabel="View all garden beds" onPress={() => router.navigate('/garden-beds')} />}
            className="mt-6"
          />
          {/* Full-bleed carousel: cancel the screen padding, re-apply it inside the scroll. */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="-mx-4 mt-3"
            contentContainerClassName="gap-2.5 px-4 pb-2">
            {data.beds.map((bed) => (
              <BedCard key={bed.id} bed={bed} width={bedCardWidth} />
            ))}
          </ScrollView>

          <SectionHeader
            title="Critical alerts"
            right={<TextLink label="View all" accessibilityLabel="View all beds needing attention" onPress={() => router.navigate('/garden-beds')} />}
            className="mt-4"
          />
          <View className="mt-3 gap-2.5">
            {data.alerts.length === 0 ? (
              <Text variant="caption" tone="muted" className="px-3">
                No critical alerts.
              </Text>
            ) : (
              data.alerts.map((alert) => (
                <ListRow
                  key={alert.id}
                  leading={
                    <IconCircle tone="danger">
                      <TriangleAlert size={16} color={theme.attention} />
                    </IconCircle>
                  }
                  title={alert.title}
                  subtitle={`${alert.bedCode} · ${formatTimeAgo(alert.createdAt)}`}
                  onPress={() => {
                    const bed = data.beds.find((b) => b.code === alert.bedCode);
                    if (bed) openBed(bed);
                  }}
                />
              ))
            )}
          </View>
        </>
      )}
    </Screen>
  );
}
