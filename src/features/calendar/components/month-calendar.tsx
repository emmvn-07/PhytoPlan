import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/use-theme';
import { cn, toIsoDate } from '@/lib/utils';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

/** Weeks of the month as ISO dates (null = padding before day 1 / after the last day). */
export function monthMatrix(year: number, month: number): (string | null)[][] {
  const first = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const cells: (string | null)[] = [
    ...Array<null>(first).fill(null),
    ...Array.from({ length: days }, (_, i) => toIsoDate(new Date(year, month, i + 1))),
  ];
  while (cells.length % 7) cells.push(null);
  return Array.from({ length: cells.length / 7 }, (_, w) => cells.slice(w * 7, w * 7 + 7));
}

type MonthCalendarProps = {
  /** First day of the visible month. */
  month: Date;
  onMonthChange: (month: Date) => void;
  selected: string;
  onSelect: (isoDate: string) => void;
  /** ISO dates that have records (green dot). */
  marked: Set<string>;
  today: string;
};

export function MonthCalendar({ month, onMonthChange, selected, onSelect, marked, today }: MonthCalendarProps) {
  const theme = useTheme();
  const weeks = monthMatrix(month.getFullYear(), month.getMonth());
  const title = month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const shift = (delta: number) => onMonthChange(new Date(month.getFullYear(), month.getMonth() + delta, 1));

  return (
    <Card className="px-3 pb-3 pt-4">
      <View className="flex-row items-center justify-between px-1">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Previous month"
          onPress={() => shift(-1)}
          className="h-[30px] w-[30px] items-center justify-center rounded-full bg-surface-muted active:opacity-70">
          <ChevronLeft size={15} color={theme.text} />
        </Pressable>
        <Text variant="section" weight="medium" accessibilityRole="header">
          {title}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Next month"
          onPress={() => shift(1)}
          className="h-[30px] w-[30px] items-center justify-center rounded-full bg-surface-muted active:opacity-70">
          <ChevronRight size={15} color={theme.text} />
        </Pressable>
      </View>

      <View className="mt-3 flex-row">
        {WEEKDAYS.map((d, i) => (
          <Text key={i} variant="caption" tone="tertiary" className="flex-1 text-center">
            {d}
          </Text>
        ))}
      </View>

      {weeks.map((week, w) => (
        <View key={w} className="flex-row">
          {week.map((date, d) => {
            if (!date) return <View key={d} className="h-[46px] flex-1" />;
            const isSelected = date === selected;
            const isToday = date === today;
            const hasRecords = marked.has(date);
            const day = Number(date.slice(8));
            return (
              <Pressable
                key={date}
                accessibilityRole="button"
                accessibilityLabel={`${title.split(' ')[0]} ${day}${hasRecords ? ', has records' : ''}${isToday ? ', today' : ''}`}
                accessibilityState={{ selected: isSelected }}
                onPress={() => onSelect(date)}
                className="h-[46px] flex-1 items-center pt-1">
                <View
                  className={cn(
                    'h-[30px] w-[30px] items-center justify-center rounded-full',
                    isSelected && 'bg-primary',
                    !isSelected && isToday && 'border-[1.5px] border-today-ring'
                  )}>
                  <Text
                    variant="subhead"
                    weight={isSelected ? 'semibold' : 'regular'}
                    tone={isSelected ? 'onPrimary' : isToday ? 'primary' : 'default'}>
                    {day}
                  </Text>
                </View>
                {hasRecords && <View className="mt-1 h-1 w-1 rounded-full bg-record-dot" />}
              </Pressable>
            );
          })}
        </View>
      ))}
    </Card>
  );
}
