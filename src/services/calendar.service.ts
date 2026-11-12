import { config } from '@/constants/config';
import { delay } from '@/lib/utils';
import { mockRecords, mockWeather } from '@/mocks/calendar';
import type { CalendarRecord, WeatherConditions } from '@/types/models';

/** Agronomic calendar. PLACEHOLDER: mock data. */
export const calendarService = {
  async getCalendar(): Promise<{ weather: WeatherConditions; records: CalendarRecord[] }> {
    await delay(config.mockDelayMs);
    return { weather: mockWeather, records: mockRecords };
  },
};
