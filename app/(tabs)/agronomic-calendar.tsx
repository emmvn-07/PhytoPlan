import { router } from 'expo-router';
import { Sprout } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { ScreenHeader } from '@/components/ui/screen-header';
import { SectionHeader } from '@/components/ui/section-header';
import { Text } from '@/components/ui/text';
import { ConditionsHero } from '@/features/calendar/components/conditions-hero';
import { MonthCalendar } from '@/features/calendar/components/month-calendar';
import { RecordTimeline } from '@/features/calendar/components/record-timeline';
import { useAsync } from '@/hooks/use-async';
import { useTheme } from '@/hooks/use-theme';
import { formatDayHeading, parseLocalDate, toIsoDate } from '@/lib/utils';
import { calendarService } from '@/services/calendar.service';

export default function AgronomicCalendarScreen() {
  const theme = useTheme();
  const { data, isLoading, error } = useAsync(calendarService.getCalendar);
  const today = toIsoDate(new Date());

  // Until the user picks a day, show the most recent day that has records.
  const latest = data?.records.reduce((max, r) => (r.date > max ? r.date : max), '') || today;
  const [pickedDay, setPickedDay] = useState<string | null>(null);
  const [pickedMonth, setPickedMonth] = useState<Date | null>(null);
  const selected = pickedDay ?? latest;
  const month = pickedMonth ?? new Date(parseLocalDate(selected).getFullYear(), parseLocalDate(selected).getMonth(), 1);

  const marked = new Set(data?.records.map((r) => r.date));
  const dayRecords = (data?.records ?? []).filter((r) => r.date === selected).sort((a, b) => a.time.localeCompare(b.time));

  return (
    <Screen withTabBar contentClassName="px-4 pt-4">
      <ScreenHeader title="Agronomic Calendar" subtitle="Historical farm records" />

      {isLoading ? (
        <View className="mt-10">
          <ActivityIndicator color={theme.primary} accessibilityLabel="Loading calendar" />
        </View>
      ) : error || !data ? (
        <Text tone="danger" className="mt-6 px-2">
          {error ?? 'Could not load the calendar.'}
        </Text>
      ) : (
        <>
          <View className="mt-4">
            <ConditionsHero weather={data.weather} />
          </View>

          <View className="mt-4">
            <MonthCalendar
              month={month}
              onMonthChange={setPickedMonth}
              selected={selected}
              onSelect={setPickedDay}
              marked={marked}
              today={today}
            />
          </View>

          <Button
            className="mt-3"
            size="lg"
            variant="muted"
            icon={Sprout}
            title="Suggested plants"
            onPress={() => router.navigate('/suggested-crops')}
          />

          <SectionHeader
            title={formatDayHeading(selected)}
            right={
              <Text variant="caption" tone="slate">
                {`${dayRecords.length} record${dayRecords.length === 1 ? '' : 's'}`}
              </Text>
            }
            className="mt-6"
          />
          <View className="mt-3">
            <RecordTimeline records={dayRecords} />
          </View>
        </>
      )}
    </Screen>
  );
}
