import '@/global.css';

import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { Colors } from '@/constants/theme';

SplashScreen.preventAutoHideAsync();

// Light only — navigation chrome uses the design's colors regardless of the system theme.
const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.primary,
    background: Colors.background,
    card: Colors.surface,
    text: Colors.text,
    border: Colors.border,
  },
};

// Login is disabled for now: the app opens straight into the tabs (see app/index.tsx).
// auth.service / profile.service are kept in src/services for when sign-in returns.
export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  const ready = fontsLoaded || !!fontError;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  // Keep the splash up until Inter is ready so text never flashes in the system font.
  if (!ready) return null;

  return (
    <ThemeProvider value={navigationTheme}>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.background } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="butterhead-lettuce" />
      </Stack>
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}
