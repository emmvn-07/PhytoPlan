import { useId } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

const directions = {
  /** top-left → bottom-right */
  diagonal: { x1: '0', y1: '0', x2: '1', y2: '1' },
  /** top → bottom */
  vertical: { x1: '0', y1: '0', x2: '0', y2: '1' },
  /** left → right */
  horizontal: { x1: '0', y1: '0', x2: '1', y2: '0' },
} as const;

type GradientProps = {
  from: string;
  to: string;
  direction?: keyof typeof directions;
  fromOpacity?: number;
  toOpacity?: number;
};

/**
 * Linear gradient filling its parent (absolute). Put it first inside a View with
 * `overflow-hidden` + a radius to clip it to rounded corners.
 */
export function Gradient({ from, to, direction = 'diagonal', fromOpacity = 1, toOpacity = 1 }: GradientProps) {
  const id = `g${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg width="100%" height="100%">
        <Defs>
          <LinearGradient id={id} {...directions[direction]}>
            <Stop offset="0" stopColor={from} stopOpacity={fromOpacity} />
            <Stop offset="1" stopColor={to} stopOpacity={toOpacity} />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill={`url(#${id})`} />
      </Svg>
    </View>
  );
}
