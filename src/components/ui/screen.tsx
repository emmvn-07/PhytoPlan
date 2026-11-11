import type { PropsWithChildren } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomTabInset, MaxContentWidth } from '@/constants/theme';

type ScreenProps = PropsWithChildren<{
  /** Add bottom padding so content clears the native tab bar. */
  withTabBar?: boolean;
}>;

/** Safe-area aware, keyboard-friendly scrollable screen container. */
export function Screen({ children, withTabBar }: ScreenProps) {
  return (
    // className goes on core RN components only — NativeWind doesn't style third-party
    // components like SafeAreaView without a cssInterop() registration.
    <View className="flex-1 bg-background">
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView
            contentContainerClassName="w-full grow gap-4 self-center p-6"
            contentContainerStyle={[
              { maxWidth: MaxContentWidth },
              withTabBar && { paddingBottom: BottomTabInset + 24 },
            ]}
            keyboardShouldPersistTaps="handled">
            {children}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
