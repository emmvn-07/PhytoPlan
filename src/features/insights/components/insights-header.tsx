import { router } from 'expo-router';
import { View } from 'react-native';

import { ScreenHeader } from '@/components/ui/screen-header';
import { SegmentedControl } from '@/components/ui/segmented-control';

type InsightsView = 'crops' | 'analytics';

/** Title + Crops/Analytics switch. Each view is its own route under the Insights tab. */
export function InsightsHeader({ view }: { view: InsightsView }) {
  return (
    <View>
      <ScreenHeader title="Insights" subtitle="Agronomic decision support · AI advisory" />
      <SegmentedControl
        className="mt-4"
        options={[
          { label: 'Crops', value: 'crops' },
          { label: 'Analytics', value: 'analytics' },
        ]}
        value={view}
        onChange={(next) => {
          if (next !== view) router.navigate(next === 'crops' ? '/suggested-crops' : '/insights-analytics');
        }}
      />
    </View>
  );
}
