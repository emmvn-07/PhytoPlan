import { Bell, Droplets } from 'lucide-react-native';
import { View } from 'react-native';

import { Text } from '@/components/ui/text';
import { config } from '@/constants/config';
import { Shadows } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatLongDate, greetingFor, initials } from '@/lib/utils';

type FarmHeaderProps = {
  /** Display name; the greeting uses the first word. */
  name: string;
  now?: Date;
};

/** Brand mark, notifications + profile buttons, greeting and date. */
export function FarmHeader({ name, now = new Date() }: FarmHeaderProps) {
  const theme = useTheme();
  const firstName = name.split(/\s+/)[0];

  return (
    <View className="pl-2">
      <View className="flex-row items-start justify-between">
        <View className="flex-row items-center gap-2.5">
          <View className="h-[26px] w-[26px] items-center justify-center rounded-[7px] bg-primary">
            <Droplets size={15} color={theme.onPrimary} />
          </View>
          <Text variant="overline" weight="semibold" tone="primary" className="tracking-[1.6px]">
            {config.appName}
          </Text>
        </View>

        <View className="flex-row gap-1.5">
          {/* Notifications aren't built yet — static for now. */}
          <View
            accessible
            accessibilityLabel="Notifications, new alerts"
            className="h-[38px] w-[38px] items-center justify-center rounded-[13px] border border-highlight bg-surface"
            style={{ boxShadow: Shadows.card }}>
            <Bell size={18} color={theme.primary} />
            <View className="absolute right-[10px] top-[9px] h-[6px] w-[6px] rounded-full bg-attention" />
          </View>
          {/* Static while login/profile are disabled. */}
          <View
            accessible
            accessibilityLabel={`Signed in as ${name}`}
            className="h-[38px] w-[38px] items-center justify-center rounded-[13px] bg-primary-muted"
            style={{ boxShadow: Shadows.raised }}>
            <Text variant="subhead" weight="medium" tone="onPrimary">
              {initials(name)}
            </Text>
          </View>
        </View>
      </View>

      <Text variant="heading" accessibilityRole="header" className="mt-2">
        {`${greetingFor(now.getHours())},\n${firstName}`}
      </Text>
      <Text variant="subhead" tone="muted" className="mt-1">
        {formatLongDate(now)}
      </Text>
    </View>
  );
}
