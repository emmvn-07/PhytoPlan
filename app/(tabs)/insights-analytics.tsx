import { Activity, Download, Droplets, Leaf } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, Alert, Share, View } from 'react-native';

import { TrendChartCard } from '@/components/trend-chart-card';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { IconCircle } from '@/components/ui/icon-circle';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Screen } from '@/components/ui/screen';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { StatRow } from '@/components/ui/stat-row';
import { Text } from '@/components/ui/text';
import { InsightsHeader } from '@/features/insights/components/insights-header';
import { useAsync } from '@/hooks/use-async';
import { useTheme } from '@/hooks/use-theme';
import { formatNumber, getErrorMessage } from '@/lib/utils';
import { insightsService } from '@/services/insights.service';
import type { AnalyticsPeriod, FarmAnalytics, FarmTrendMetric } from '@/types/models';

const PERIODS: { label: string; value: `${AnalyticsPeriod}` }[] = [
  { label: '7D', value: '7' },
  { label: '14D', value: '14' },
  { label: '30D', value: '30' },
];

const METRICS: { label: string; value: FarmTrendMetric; caption: string }[] = [
  { label: 'Soil moisture', value: 'soilMoisture', caption: 'Soil moisture (%)' },
  { label: 'Temperature', value: 'temperature', caption: 'Temperature (°C)' },
  { label: 'Humidity', value: 'humidity', caption: 'Humidity (%)' },
  { label: 'VPD', value: 'vpd', caption: 'VPD (kPa)' },
];

function toCsv(analytics: FarmAnalytics, period: AnalyticsPeriod) {
  const header = 'date,soil_moisture_pct,temperature_c,humidity_pct,vpd_kpa';
  const rows = analytics.trends.soilMoisture.map((p, i) =>
    [p.date, p.value, analytics.trends.temperature[i]?.value, analytics.trends.humidity[i]?.value, analytics.trends.vpd[i]?.value].join(',')
  );
  return [`# PhytoPlan analytics — last ${period} days (demo data)`, header, ...rows].join('\n');
}

export default function InsightsAnalyticsScreen() {
  const theme = useTheme();
  const [period, setPeriod] = useState<AnalyticsPeriod>(7);
  const [metric, setMetric] = useState<FarmTrendMetric>('soilMoisture');
  const { data, isLoading, error } = useAsync(insightsService.getAnalytics, period);

  async function exportData() {
    if (!data) return;
    try {
      await Share.share({ title: 'PhytoPlan analytics', message: toCsv(data, period) });
    } catch (e) {
      Alert.alert('Export failed', getErrorMessage(e));
    }
  }

  const rate = data ? data.water.savedLiters / (data.water.savedLiters + data.water.consumedLiters) : 0;
  const s = data?.survivability;
  const survivability = s && s.monitored ? Math.round((s.healthy / s.monitored) * 100) : 0;
  const metricInfo = METRICS.find((m) => m.value === metric)!;

  return (
    <Screen withTabBar contentClassName="px-4 pt-4">
      <InsightsHeader view="analytics" />

      <View className="mt-3 flex-row items-center gap-2.5">
        <SegmentedControl
          className="flex-1"
          size="sm"
          options={PERIODS}
          value={`${period}`}
          onChange={(v) => setPeriod(Number(v) as AnalyticsPeriod)}
        />
        <Button variant="outline" size="sm" icon={Download} title="Export" onPress={exportData} disabled={!data} />
      </View>

      {isLoading && !data ? (
        <View className="mt-10">
          <ActivityIndicator color={theme.primary} accessibilityLabel="Loading analytics" />
        </View>
      ) : error || !data || !s ? (
        <Text tone="danger" className="mt-6 px-2">
          {error ?? 'Could not load analytics.'}
        </Text>
      ) : (
        <View className="mt-4 gap-3">
          <Card className="p-4">
            <View className="flex-row items-center gap-2.5">
              <IconCircle tone="neutral">
                <Droplets size={16} color={theme.primary} />
              </IconCircle>
              <Text variant="section" weight="medium">
                Water conservation
              </Text>
            </View>
            <StatRow
              className="mt-4"
              size="value"
              items={[
                { value: `${formatNumber(data.water.consumedLiters)} L`, label: 'Consumed' },
                { value: `${formatNumber(data.water.savedLiters)} L`, label: 'Saved' },
                { value: `${Math.round(rate * 100)}%`, label: 'Rate' },
              ]}
            />
            <View className="mt-4">
              <ProgressBar value={rate} label="Water conservation rate" gradient />
            </View>
          </Card>

          <Card className="p-4">
            <View className="flex-row items-center gap-2.5">
              <IconCircle tone="neutral">
                <Leaf size={16} color={theme.primary} />
              </IconCircle>
              <Text variant="section" weight="medium">
                Crop survivability
              </Text>
            </View>
            <View className="mt-4 flex-row items-end">
              <StatRow
                className="flex-[3]"
                items={[
                  { value: String(s.monitored), label: 'Monitored' },
                  { value: String(s.healthy), label: 'Healthy' },
                  { value: String(s.stressed), label: 'Stressed' },
                ]}
              />
              <View accessible accessibilityLabel={`${survivability}% survivability`} className="items-end gap-1">
                <Text variant="metricLg" weight="bold" tone="success">
                  {`${survivability}%`}
                </Text>
                <Text variant="overline" tone="tertiary">
                  Survivability
                </Text>
              </View>
            </View>
          </Card>

          <TrendChartCard
            header={
              <View className="flex-row items-center gap-2.5">
                <IconCircle tone="warning">
                  <Activity size={16} color={theme.warning} />
                </IconCircle>
                <Text variant="section" weight="medium">
                  Environmental trends
                </Text>
              </View>
            }
            metrics={METRICS}
            metric={metric}
            onMetricChange={setMetric}
            data={data.trends[metric]}
            caption={`Daily farm average · ${metricInfo.caption}`}
          />
        </View>
      )}
    </Screen>
  );
}
