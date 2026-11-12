import { useId, useState } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Defs, Line, LinearGradient, Path, Stop } from 'react-native-svg';

import { Colors } from '@/constants/theme';

import { Text } from './text';

export type ChartPoint = { label: string; value: number };

type LineChartProps = {
  data: ChartPoint[];
  /** Plot height in pt (excludes x labels). */
  height?: number;
  /** Line under the chart: "Daily farm average · Soil moisture (%)". */
  caption?: string;
  accessibilityLabel: string;
};

const Y_AXIS_WIDTH = 24;
// No 0.25/2.5 steps: the design's axes use round ticks (60, 63, 66… / 30, 35, 40…).
const STEPS = [0.05, 0.1, 0.2, 0.5, 1, 2, 3, 5, 10, 20, 25, 50, 100];

/** Round axis bounds/step so there are at most 4 intervals: 30–50 by 5, 60–72 by 3. */
export function niceScale(values: number[]) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  for (const step of STEPS) {
    const lo = Math.floor(min / step) * step;
    const hi = Math.max(Math.ceil(max / step) * step, lo + step);
    if ((hi - lo) / step <= 4) {
      const ticks = Array.from({ length: Math.round((hi - lo) / step) + 1 }, (_, i) => +(lo + i * step).toFixed(2));
      return { lo, hi, ticks };
    }
  }
  return { lo: min, hi: max === min ? min + 1 : max, ticks: [min, max] };
}

/** Smooth path through the points (Catmull-Rom → cubic Bézier). */
function smoothPath(points: { x: number; y: number }[]) {
  if (points.length === 0) return '';
  let d = `M${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C${c1x},${c1y} ${c2x},${c2y} ${p2.x},${p2.y}`;
  }
  return d;
}

/** Area line chart with gridlines, dots and axis labels (design-references 3 and 6). */
export function LineChart({ data, height = 150, caption, accessibilityLabel }: LineChartProps) {
  const [width, setWidth] = useState(0);
  const gradientId = `area${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const { lo, hi, ticks } = niceScale(data.map((p) => p.value));

  const plotWidth = Math.max(0, width - Y_AXIS_WIDTH - 4);
  const x = (i: number) => Y_AXIS_WIDTH + (data.length > 1 ? (i / (data.length - 1)) * plotWidth : plotWidth / 2);
  const y = (v: number) => 4 + (1 - (v - lo) / (hi - lo)) * (height - 8);
  const points = data.map((p, i) => ({ x: x(i), y: y(p.value) }));
  const line = smoothPath(points);
  const area = points.length
    ? `${line} L${points[points.length - 1].x},${height} L${points[0].x},${height} Z`
    : '';
  // Thin out x labels so they never collide.
  const labelEvery = Math.max(1, Math.ceil(data.length / 10));

  return (
    <View accessible accessibilityLabel={accessibilityLabel}>
      <View onLayout={(e) => setWidth(e.nativeEvent.layout.width)} style={{ height }}>
        {width > 0 && (
          <Svg width={width} height={height}>
            <Defs>
              <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={Colors.chartArea} stopOpacity={0.95} />
                <Stop offset="1" stopColor={Colors.chartArea} stopOpacity={0.05} />
              </LinearGradient>
            </Defs>
            {ticks.map((t) => (
              <Line key={t} x1={Y_AXIS_WIDTH} x2={width} y1={y(t)} y2={y(t)} stroke={Colors.border} strokeWidth={1} />
            ))}
            <Path d={area} fill={`url(#${gradientId})`} />
            <Path d={line} fill="none" stroke={Colors.chartLine} strokeWidth={2} />
            {points.map((p, i) => (
              <Circle key={i} cx={p.x} cy={p.y} r={2.5} fill={Colors.chartLine} />
            ))}
          </Svg>
        )}
        {/* Y labels as Text so they use Inter. */}
        {ticks.map((t) => (
          <Text
            key={t}
            variant="micro"
            tone="tertiary"
            className="absolute left-0"
            style={{ top: y(t) - 6 }}>
            {String(t)}
          </Text>
        ))}
      </View>
      <View className="mt-1.5 flex-row" style={{ paddingLeft: Y_AXIS_WIDTH }}>
        {data.map((p, i) => (
          <Text key={p.label + i} variant="micro" tone="tertiary" className="flex-1 text-center" numberOfLines={1}>
            {i % labelEvery === 0 ? p.label : ''}
          </Text>
        ))}
      </View>
      {caption ? (
        <Text variant="caption" tone="tertiary" className="mt-3 text-center">
          {caption}
        </Text>
      ) : null}
    </View>
  );
}
