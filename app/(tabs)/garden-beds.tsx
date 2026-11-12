import { Search } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { ChipGroup } from '@/components/ui/chip-group';
import { Screen } from '@/components/ui/screen';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Select } from '@/components/ui/select';
import { StatRow } from '@/components/ui/stat-row';
import { Text } from '@/components/ui/text';
import { TextField } from '@/components/ui/text-field';
import { BedCard } from '@/features/beds/components/bed-card';
import { countBeds, filterBeds, useBeds, type BedStatusFilter } from '@/features/beds/hooks/use-beds';
import { useTheme } from '@/hooks/use-theme';

const STATUS_FILTERS: { label: string; value: BedStatusFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Healthy', value: 'healthy' },
  { label: 'Distressed', value: 'attention' },
  { label: 'Offline', value: 'offline' },
];

export default function GardenBedsScreen() {
  const theme = useTheme();
  const { data: beds, isLoading, error } = useBeds();
  const [query, setQuery] = useState('');
  const [crop, setCrop] = useState('all');
  const [status, setStatus] = useState<BedStatusFilter>('all');

  const counts = countBeds(beds ?? []);
  const crops = [
    { label: 'All crops', value: 'all' },
    ...[...new Set((beds ?? []).map((bed) => bed.cropName))].map((name) => ({ label: name, value: name })),
  ];
  const visible = filterBeds(beds ?? [], { query, crop, status });
  // Two-column grid; an odd last card keeps half width.
  const rows = Array.from({ length: Math.ceil(visible.length / 2) }, (_, i) => visible.slice(i * 2, i * 2 + 2));

  return (
    <Screen withTabBar contentClassName="px-4 pt-4">
      <ScreenHeader title="Garden Beds" subtitle={`${counts.total} connected beds · CUIA rooftop`} />

      {isLoading ? (
        <View className="mt-10">
          <ActivityIndicator color={theme.primary} accessibilityLabel="Loading beds" />
        </View>
      ) : error ? (
        <Text tone="danger" className="mt-6 px-2">
          {error}
        </Text>
      ) : (
        <>
          <Card className="mt-3.5 px-2 py-3.5">
            <StatRow
              align="center"
              items={[
                { value: String(counts.total), label: 'Total', tone: 'slate' },
                { value: String(counts.healthy), label: 'Healthy', tone: 'success' },
                { value: String(counts.stressed), label: 'Stressed', tone: 'danger' },
                { value: String(counts.offline), label: 'Offline', tone: 'slate' },
              ]}
            />
          </Card>

          <View className="mt-3 flex-row gap-2.5">
            <TextField
              containerClassName="flex-[1.45]"
              value={query}
              onChangeText={setQuery}
              placeholder="Search beds or crops"
              accessibilityLabel="Search beds or crops"
              returnKeyType="search"
              autoCorrect={false}
              leading={<Search size={15} color={theme.slate} />}
            />
            <Select
              className="flex-1"
              value={crop}
              options={crops}
              onChange={setCrop}
              accessibilityLabel="Filter by crop"
            />
          </View>

          <ChipGroup
            className="mt-3"
            options={STATUS_FILTERS}
            value={status}
            onChange={setStatus}
            accessibilityLabel="Filter by status"
          />

          <View className="mt-4 gap-3">
            {rows.length === 0 ? (
              <Text variant="caption" tone="slate" className="px-2">
                No beds match your filters.
              </Text>
            ) : (
              rows.map((row) => (
                <View key={row[0].id} className="flex-row gap-3">
                  {row.map((bed) => (
                    <BedCard key={bed.id} bed={bed} variant="grid" />
                  ))}
                  {row.length === 1 && <View className="flex-1" />}
                </View>
              ))
            )}
          </View>
        </>
      )}
    </Screen>
  );
}
