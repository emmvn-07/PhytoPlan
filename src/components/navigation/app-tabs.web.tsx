import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  type TabTriggerSlotProps,
  type TabListProps,
} from 'expo-router/ui';
import { Pressable, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { config } from '@/constants/config';
import { MaxContentWidth } from '@/constants/theme';
import { cn } from '@/lib/utils';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="home" href="/" asChild>
            <TabButton>Home</TabButton>
          </TabTrigger>
          <TabTrigger name="profile" href="/profile" asChild>
            <TabButton>Profile</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

// `ref` is dropped: TabTriggerSlotProps' ref type doesn't match Pressable's in RN 0.88 types.
function TabButton({ children, isFocused, ref: _ref, ...props }: TabTriggerSlotProps) {
  return (
    <Pressable {...props} className="active:opacity-70">
      <View
        className={cn(
          'rounded-2xl px-4 py-1',
          isFocused ? 'bg-background-selected' : 'bg-background-element'
        )}>
        <Text variant="small" tone={isFocused ? 'default' : 'muted'}>
          {children}
        </Text>
      </View>
    </Pressable>
  );
}

function CustomTabList(props: TabListProps) {
  return (
    <View {...props} className="absolute w-full flex-row items-center justify-center p-4">
      <View
        className="grow flex-row items-center gap-2 rounded-[32px] bg-background-element px-8 py-2"
        style={{ maxWidth: MaxContentWidth }}>
        <Text variant="smallBold" className="mr-auto">
          {config.appName}
        </Text>
        {props.children}
      </View>
    </View>
  );
}
