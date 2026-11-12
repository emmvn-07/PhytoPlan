import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { Shadows } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';

import { Text } from './text';

type ScreenHeaderProps = {
  title: string;
  /** Line under the title, prefixed with a green dot. */
  subtitle?: string;
  /** Right-hand slot ("Gateway online" pill). */
  right?: ReactNode;
  /** Show a back button (stack screens). */
  back?: boolean;
  className?: string;
};

/** "Garden Beds / • 6 connected beds · CUIA rooftop" screen title block. */
export function ScreenHeader({ title, subtitle, right, back, className }: ScreenHeaderProps) {
  const theme = useTheme();
  return (
    <View className={cn('flex-row items-start gap-3 px-2', className)}>
      {back && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={6}
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/farm-overview'))}
          className="mt-0.5 h-9 w-9 items-center justify-center rounded-xl border border-highlight bg-surface active:opacity-70"
          style={{ boxShadow: Shadows.card }}>
          <ChevronLeft size={18} color={theme.text} />
        </Pressable>
      )}
      <View className="flex-1">
        <Text variant="title" accessibilityRole="header">
          {title}
        </Text>
        {subtitle ? (
          <View className="mt-0.5 flex-row items-center gap-1.5">
            <View className="h-[5px] w-[5px] rounded-full bg-record-dot" />
            <Text variant="body" weight="regular" tone="slate" className="flex-1" numberOfLines={1}>
              {subtitle}
            </Text>
          </View>
        ) : null}
      </View>
      {right}
    </View>
  );
}
