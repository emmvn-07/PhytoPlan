import { toIsoDate } from '@/lib/utils';
import type { TrendPoint } from '@/types/models';

/** Dates for the `count` days ending at `end` (inclusive), oldest first. */
function lastDays(count: number, end: Date) {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(end);
    d.setDate(end.getDate() - (count - 1 - i));
    return toIsoDate(d);
  });
}

/** Attach values to the last N days. `values` may be shorter than `count`: it's repeated with a wave. */
export function series(values: number[], end: Date, count = values.length, decimals = 1): TrendPoint[] {
  return lastDays(count, end).map((date, i) => {
    const base = values[i % values.length];
    // Deterministic drift for long periods so 14D/30D aren't copies of 7D.
    const drift = count > values.length ? Math.sin(i * 0.9) * (base * 0.04) : 0;
    return { date, value: +(base + drift).toFixed(decimals) };
  });
}
