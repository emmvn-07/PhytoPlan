import type { CalendarRecord, RecordKind, WeatherConditions } from '@/types/models';

export const mockWeather: WeatherConditions = {
  temperature: 30.4,
  summary: 'Warm, partly sunny',
  humidity: 67,
  advisories: [
    { kind: 'warning', text: 'El Niño advisory: below-normal rainfall expected this month. Keep reservoirs above 40%.' },
    { kind: 'sun', text: 'High midday VPD — schedule irrigation before 9 AM to reduce evaporative loss.' },
  ],
};

/** Nov 8, 2026 — exactly as in design-references/4. */
const nov8: CalendarRecord[] = [
  {
    id: 'rec-1108-1',
    date: '2026-11-08',
    time: '06:20',
    kind: 'irrigation',
    title: 'Automated irrigation — Bed 01',
    description: 'ADSS cycle dispensed 1.1 L over 4 minutes.',
    bedCode: 'B-01',
  },
  {
    id: 'rec-1108-2',
    date: '2026-11-08',
    time: '06:45',
    kind: 'nutrients',
    title: 'Nutrient solution dispensed — Bed 04',
    description: '18 mL of balanced solution dosed at EC 1.7 dS/m.',
    bedCode: 'B-04',
  },
  {
    id: 'rec-1108-3',
    date: '2026-11-08',
    time: '07:10',
    kind: 'scan',
    title: 'Computer vision scan completed',
    description: 'Surface scan captured for Bed 03; anomaly region flagged.',
    bedCode: 'B-03',
  },
];

const templates: Record<RecordKind, (bed: string) => Pick<CalendarRecord, 'title' | 'description'>> = {
  irrigation: (bed) => ({
    title: `Automated irrigation — Bed ${bed.slice(2)}`,
    description: 'ADSS cycle dispensed 1.2 L over 4 minutes.',
  }),
  nutrients: (bed) => ({
    title: `Nutrient solution dispensed — Bed ${bed.slice(2)}`,
    description: '15 mL of balanced solution dosed at EC 1.6 dS/m.',
  }),
  scan: (bed) => ({
    title: 'Computer vision scan completed',
    description: `Surface scan captured for Bed ${bed.slice(2)}; no anomalies.`,
  }),
};

/** One or two generated records on Nov 2–7 (the days with dots in the design). */
const earlier: CalendarRecord[] = [2, 3, 4, 5, 6, 7].flatMap((day, i) => {
  const kinds: RecordKind[] = i % 2 === 0 ? ['irrigation', 'scan'] : ['nutrients'];
  return kinds.map((kind, k) => {
    const bed = `B-0${((day + k) % 6) + 1}`;
    return {
      id: `rec-11${String(day).padStart(2, '0')}-${k}`,
      date: `2026-11-${String(day).padStart(2, '0')}`,
      time: k === 0 ? '06:30' : '07:15',
      kind,
      bedCode: bed,
      ...templates[kind](bed),
    };
  });
});

export const mockRecords: CalendarRecord[] = [...earlier, ...nov8];
