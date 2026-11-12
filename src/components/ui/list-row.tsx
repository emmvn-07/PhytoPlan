import { ChevronRight } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

import { Card } from './card';
import { Text } from './text';

type ListRowProps = {
  /** Usually an <IconCircle>. */
  leading: ReactNode;
  title: string;
  subtitle?: string;
  /** Makes the row tappable. Without it the row is static (the chevron still shows when `chevron`). */
  onPress?: () => void;
  chevron?: boolean;
};

/** Card row: leading icon, title + subtitle, trailing chevron ("ADSS engine", alerts). */
export function ListRow({ leading, title, subtitle, onPress, chevron = true }: ListRowProps) {
  const theme = useTheme();
  const content = (
    <Card className="flex-row items-center gap-2.5 px-3.5 py-3.5">
      {leading}
      <View className="flex-1 gap-0.5">
        <Text variant="body">{title}</Text>
        {subtitle ? (
          <Text variant="caption" tone="muted" numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {chevron && <ChevronRight size={16} color={theme.primary} />}
    </Card>
  );

  if (!onPress) return content;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={subtitle ? `${title}, ${subtitle}` : title}
      onPress={onPress}
      className="active:opacity-70">
      {content}
    </Pressable>
  );
}
