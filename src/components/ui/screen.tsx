import type { PropsWithChildren } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MaxContentWidth, TabBar } from '@/constants/theme';
import { cn } from '@/lib/utils';

type ScreenProps = PropsWithChildren<{
  /** Reserve space at the bottom so content scrolls clear of the floating tab bar. */
  withTabBar?: boolean;
  /** Pad for the status bar. Turn off when a native stack header already does. */
  topInset?: boolean;
  /** Padding/gap of the scroll content. Replaces the default, so pass the full set. */
  contentClassName?: string;
}>;

/** Safe-area aware, keyboard-friendly scrollable screen container. */
export function Screen({
  children,
  withTabBar,
  topInset = true,
  contentClassName = 'gap-4 p-6',
}: ScreenProps) {
  const insets = useSafeAreaInsets();
  const bottomPadding = withTabBar
    ? insets.bottom + TabBar.bottomGap + TabBar.height + 24
    : insets.bottom + 24;

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: topInset ? insets.top : 0 }}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerClassName={cn('w-full grow self-center', contentClassName)}
          contentContainerStyle={{ maxWidth: MaxContentWidth, paddingBottom: bottomPadding }}
          keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
