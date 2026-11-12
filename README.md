# PhytoPlan

Mobile app built with **React Native + Expo (SDK 58)**, **Expo Router**, **Supabase** (auth + database), **NativeWind** (Tailwind CSS) and **Lucide** icons.

## Quick start (no backend needed)

```bash
npm install
npx expo start
```

Login is disabled for now: the app opens straight on the Farm overview, and screens use mock data from `src/mocks/`.

## Connecting Supabase

1. Create a project at https://supabase.com and copy the env file:

   ```bash
   cp .env.example .env.local
   ```

   Fill in the project URL and publishable (or anon) key, then restart Expo.

2. Create the schema: Supabase Dashboard → SQL Editor → run
   [supabase/migrations/0001_profiles.sql](supabase/migrations/0001_profiles.sql).

## Project structure

```
app/                        Expo Router routes — thin screens only
  _layout.tsx               Root: theme variables + stack (login disabled for now)
  index.tsx                 Redirects "/" to /farm-overview
  (tabs)/                   Floating tab bar: farm-overview, garden-beds, agronomic-calendar,
                            suggested-crops + insights-analytics (Insights), irrigation-control
  butterhead-lettuce.tsx    Bed detail (stack screen, ?id=bed-0x)
src/
  components/
    ui/                     Primitives: Text, Card, Badge, StatusDot, MetricTile, ListRow, Screen…
    navigation/             Floating tab bar (app-tabs.tsx)
  features/                 Feature-specific UI + hooks
    farm/                   Farm overview cards, useFarmOverview()
    beds/                   BedCard, bed detail sections, useBeds()/filterBeds()
    calendar/               Conditions hero, MonthCalendar, RecordTimeline
    insights/               Crops/Analytics header, CropCard, GrowingConditionsCard
    irrigation/             ReservoirCard, BedControlRow
  services/                 Backend access (the only place that touches Supabase)
    farm/beds/calendar/insights/irrigation.service.ts   Placeholders — return mock data
    auth.service.ts         Supabase auth (not wired to the UI while login is disabled)
    profile.service.ts      public.profiles (not wired to the UI yet)
  sensors/                  Reserved for hardware integration (mock SensorClient)
  hooks/                    Shared hooks (useTheme, useColorScheme, useAsync)
  lib/                      Supabase client, small utilities (cn, dates, numbers)
  types/                    models.ts (app models), database.ts (Supabase types)
  constants/                config.ts (env + demo mode), colors.ts (palette), theme.ts
  mocks/                    Temporary frontend data
  global.css                Tailwind entry
supabase/migrations/        SQL migrations (tables, RLS, triggers)
```

**Data flow:** screen → feature hook → service → Supabase (or mocks).
To connect a real table, change only the service function; hooks and screens stay the same.

## Styling

- Use `className` with Tailwind classes. Theme colors: `bg-background`, `bg-background-element`, `bg-background-selected`, `text-text`, `text-text-secondary`, `bg-primary`, `text-on-primary`, `border-border`, `text-danger`.
- Colors are defined once in [src/constants/colors.ts](src/constants/colors.ts) and switch automatically for dark mode.
- For props that need a raw color (icons, `placeholderTextColor`), use `useTheme()`.
- NativeWind styles core React Native components only. For third-party components, put layout classes on a wrapping `View`.

## Database types

After changing the schema, regenerate types:

```bash
npx supabase gen types typescript --project-id <your-project-ref> > src/types/database.ts
```

## Scripts

| Command              | What it does                           |
| -------------------- | -------------------------------------- |
| `npm start`          | Start the Expo dev server              |
| `npm run android`    | Open on Android                        |
| `npm run ios`        | Open on iOS                            |
| `npm run lint`       | Lint                                   |
| `npm run typecheck`  | TypeScript check                       |
| `npm run check-deps` | Verify deps match the Expo SDK version |

## Notes

- Only `EXPO_PUBLIC_*` vars reach the app, and they ship inside the bundle — never put the Supabase secret / `service_role` key in them.
- Security lives in Supabase **Row Level Security** policies. Enable RLS on every new table.
