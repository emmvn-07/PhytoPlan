import { config } from '@/constants/config';
import { delay } from '@/lib/utils';
import { createMockAnalytics, mockGrowingConditions, mockSuggestedCrops } from '@/mocks/insights';
import type { AnalyticsPeriod, FarmAnalytics, GrowingConditions, SuggestedCrop } from '@/types/models';

/** Insights (crop recommendations + analytics). PLACEHOLDER: mock data, no AI call yet. */
export const insightsService = {
  async getRecommendations(): Promise<{ conditions: GrowingConditions; crops: SuggestedCrop[] }> {
    await delay(config.mockDelayMs);
    return { conditions: mockGrowingConditions, crops: mockSuggestedCrops };
  },

  async getAnalytics(period: AnalyticsPeriod): Promise<FarmAnalytics> {
    await delay(config.mockDelayMs);
    return createMockAnalytics(period);
  },
};
