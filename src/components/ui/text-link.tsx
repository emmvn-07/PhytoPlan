import { Pressable } from 'react-native';

import { Text } from './text';

/** Small green text button ("View all"). */
export function TextLink({ label, onPress, accessibilityLabel }: { label: string; onPress: () => void; accessibilityLabel?: string }) {
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={accessibilityLabel ?? label}
      hitSlop={10}
      onPress={onPress}
      className="active:opacity-60">
      <Text variant="caption" tone="primary">
        {label}
      </Text>
    </Pressable>
  );
}
