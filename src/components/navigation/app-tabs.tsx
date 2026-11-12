import { Tabs, type BottomTabBarProps } from 'expo-router/js-tabs';
import {
  CalendarDays,
  House,
  SlidersHorizontal,
  Sparkles,
  Sprout,
  type LucideIcon,
} from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';
import { Colors, Shadows, TabBar } from '@/constants/theme';

/**
 * Tab order from design-references. `name` = route file in app/(tabs)/.
 * `routes` = extra route files that highlight the same tab (Insights has two views).
 */
const TAB_ITEMS: { name: string; label: string; icon: LucideIcon; routes?: string[] }[] = [
  { name: 'farm-overview', label: 'Home', icon: House },
  { name: 'garden-beds', label: 'Beds', icon: Sprout },
  { name: 'agronomic-calendar', label: 'Calendar', icon: CalendarDays },
  { name: 'suggested-crops', label: 'Insights', icon: Sparkles, routes: ['insights-analytics'] },
  { name: 'irrigation-control', label: 'Control', icon: SlidersHorizontal },
];

/** Every route is declared — Expo Router renders nothing for undeclared ones. */
const ROUTE_NAMES = TAB_ITEMS.flatMap((item) => [item.name, ...(item.routes ?? [])]);

const PILL_SPRING = { damping: 20, stiffness: 220, mass: 0.8 };

export default function AppTabs() {
  return (
    <Tabs
      // Screens slide slightly toward the tapped tab while cross-fading.
      screenOptions={{ headerShown: false, animation: 'shift' }}
      tabBar={(props) => <FloatingTabBar {...props} />}>
      {ROUTE_NAMES.map((name) => (
        <Tabs.Screen key={name} name={name} />
      ))}
    </Tabs>
  );
}

/** Floating pill tab bar with a green indicator that springs to the selected tab. */
function FloatingTabBar({ state, emitter, navigateToTab }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const [barWidth, setBarWidth] = useState(0);
  const activeName = state.routes[state.index]?.name;
  const activeIndex = Math.max(
    0,
    TAB_ITEMS.findIndex((item) => item.name === activeName || item.routes?.includes(activeName ?? ''))
  );
  const itemWidth = (barWidth - TabBar.padding * 2) / TAB_ITEMS.length;

  const pillX = useSharedValue(0);
  const placedIndex = useRef<number | null>(null);
  useEffect(() => {
    if (itemWidth <= 0) return;
    const target = activeIndex * itemWidth;
    // First placement (and bar resizes) snap; only tab changes spring.
    const isTabChange = placedIndex.current !== null && placedIndex.current !== activeIndex;
    pillX.set(isTabChange ? withSpring(target, PILL_SPRING) : target);
    placedIndex.current = activeIndex;
  }, [activeIndex, itemWidth, pillX]);
  const pillStyle = useAnimatedStyle(() => ({ transform: [{ translateX: pillX.get() }] }));

  return (
    <View
      pointerEvents="box-none"
      className="absolute"
      style={{ left: TabBar.sideInset, right: TabBar.sideInset, bottom: insets.bottom + TabBar.bottomGap }}>
      <View
        accessibilityRole="tablist"
        onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}
        className="flex-row rounded-full border border-highlight bg-surface"
        style={{ height: TabBar.height, padding: TabBar.padding, boxShadow: Shadows.card }}>
        {barWidth > 0 && (
          <Animated.View
            pointerEvents="none"
            style={[
              {
                position: 'absolute',
                top: TabBar.padding,
                bottom: TabBar.padding,
                left: TabBar.padding,
                width: itemWidth,
                borderRadius: 999,
                backgroundColor: Colors.accent,
                boxShadow: Shadows.raised,
              },
              pillStyle,
            ]}
          />
        )}

        {TAB_ITEMS.map(({ name, label, icon: Icon }, index) => {
          const route = state.routes.find((r) => r.name === name);
          const focused = index === activeIndex;

          function onPress() {
            if (!route) return;
            // Same contract as expo-router's built-in BottomTabBar.
            const event = emitter.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!focused && !event.defaultPrevented) navigateToTab(route.key);
          }

          return (
            <Pressable
              key={name}
              accessibilityRole="tab"
              accessibilityLabel={label}
              accessibilityState={{ selected: focused }}
              onPress={onPress}
              className="flex-1 items-center justify-center gap-0.5 rounded-full">
              <Icon size={20} color={focused ? Colors.onPrimary : Colors.textTertiary} />
              <Text
                variant="caption"
                weight={focused ? 'bold' : 'regular'}
                tone={focused ? 'onPrimary' : 'tertiary'}
                style={{ lineHeight: 13 }}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
