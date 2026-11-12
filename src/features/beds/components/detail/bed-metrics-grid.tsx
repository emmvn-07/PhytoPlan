import { Droplets, FlaskConical, Leaf, SlidersHorizontal, Thermometer, Waves } from 'lucide-react-native';
import { View } from 'react-native';

import { MetricTile } from '@/components/ui/metric-tile';
import { formatNumber } from '@/lib/utils';
import type { BedDetail } from '@/types/models';

/** "Environmental metrics" — 8 sensor tiles, two per row. */
export function BedMetricsGrid({ metrics }: { metrics: BedDetail['metrics'] }) {
  const tiles = [
    { label: 'Soil moisture', value: formatNumber(metrics.soilMoisture), unit: '%', icon: Droplets, tone: 'primary' as const },
    { label: 'Soil temp', value: formatNumber(metrics.soilTemp, 1), unit: '°C', icon: Thermometer, tone: 'warning' as const },
    { label: 'Air temp', value: formatNumber(metrics.airTemp, 1), unit: '°C', icon: Thermometer, tone: 'warning' as const },
    { label: 'Humidity', value: formatNumber(metrics.humidity), unit: '%', icon: Droplets, tone: 'info' as const },
    { label: 'VPD', value: formatNumber(metrics.vpd, 2), unit: 'kPa', icon: SlidersHorizontal, tone: 'primary' as const },
    { label: 'CTD', value: formatNumber(metrics.ctd, 1), unit: '°C', icon: Waves, tone: 'primary' as const },
    { label: 'EC', value: formatNumber(metrics.ec, 2), unit: 'dS/m', icon: FlaskConical, tone: 'info' as const },
    { label: 'NPK (N-P-K)', value: metrics.npk, unit: 'ppm', icon: Leaf, tone: 'primary' as const },
  ];
  const rows = [0, 2, 4, 6].map((i) => tiles.slice(i, i + 2));

  return (
    <View className="gap-2.5">
      {rows.map((row) => (
        <View key={row[0].label} className="flex-row gap-2.5">
          {row.map((t) => (
            <MetricTile key={t.label} label={t.label} value={t.value} unit={t.unit} icon={t.icon} iconTone={t.tone} compact />
          ))}
        </View>
      ))}
    </View>
  );
}
