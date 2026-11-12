import { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { Screen } from '@/components/ui/screen';
import { SectionHeader } from '@/components/ui/section-header';
import { Text } from '@/components/ui/text';
import { CropCard } from '@/features/insights/components/crop-card';
import { GrowingConditionsCard } from '@/features/insights/components/growing-conditions-card';
import { InsightsHeader } from '@/features/insights/components/insights-header';
import { useAsync } from '@/hooks/use-async';
import { useTheme } from '@/hooks/use-theme';
import { getErrorMessage } from '@/lib/utils';
import { insightsService } from '@/services/insights.service';

export default function SuggestedCropsScreen() {
  const theme = useTheme();
  const { data, isLoading, error } = useAsync(insightsService.getRecommendations);
  const [refreshed, setRefreshed] = useState<typeof data>(null);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const recommendations = refreshed ?? data;

  async function generate() {
    setGenerating(true);
    setGenerateError(null);
    try {
      setRefreshed(await insightsService.getRecommendations());
    } catch (e) {
      setGenerateError(getErrorMessage(e));
    } finally {
      setGenerating(false);
    }
  }

  return (
    <Screen withTabBar contentClassName="px-4 pt-4">
      <InsightsHeader view="crops" />

      {isLoading ? (
        <View className="mt-10">
          <ActivityIndicator color={theme.primary} accessibilityLabel="Loading recommendations" />
        </View>
      ) : error || !recommendations ? (
        <Text tone="danger" className="mt-6 px-2">
          {error ?? 'Could not load recommendations.'}
        </Text>
      ) : (
        <>
          <View className="mt-4">
            <GrowingConditionsCard conditions={recommendations.conditions} generating={generating} onGenerate={generate} />
          </View>
          {generateError && (
            <Text variant="caption" tone="danger" className="mt-2 px-2">
              {generateError}
            </Text>
          )}

          <SectionHeader
            title="Suggested plants"
            right={
              <Text variant="caption" tone="slate">
                {`${recommendations.crops.length} crops`}
              </Text>
            }
            className="mt-6"
          />
          <View className="mt-3 gap-3">
            {recommendations.crops.map((crop) => (
              <CropCard key={crop.id} crop={crop} />
            ))}
          </View>
        </>
      )}
    </Screen>
  );
}
