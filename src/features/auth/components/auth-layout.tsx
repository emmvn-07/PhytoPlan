import { Link, type Href } from 'expo-router';
import type { PropsWithChildren } from 'react';
import { View } from 'react-native';

import { DemoBanner } from '@/components/demo-banner';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';

type AuthLayoutProps = PropsWithChildren<{
  title: string;
  subtitle: string;
  footerText: string;
  footerHref: Href;
}>;

/** Shared shell for sign-in / sign-up: header, demo banner, form, footer link. */
export function AuthLayout({ title, subtitle, footerText, footerHref, children }: AuthLayoutProps) {
  return (
    <Screen>
      <View className="mb-2 mt-16 gap-1">
        <Text variant="subtitle" accessibilityRole="header">
          {title}
        </Text>
        <Text tone="muted">{subtitle}</Text>
      </View>

      <DemoBanner />

      {children}

      {/* Positioning lives on a View: Link isn't a core component, so NativeWind won't style it. */}
      <View className="mt-2 self-center">
        <Link href={footerHref}>
          <Text variant="small" tone="primary">
            {footerText}
          </Text>
        </Link>
      </View>
    </Screen>
  );
}
