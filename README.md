# PhytoPlan

Mobile app built with **React Native + Expo (SDK 58)**, **Expo Router**, **Supabase** (auth + database), **NativeWind** (Tailwind CSS) and **Lucide** icons.

## Quick start (no backend needed)

```bash
npm install
npx expo start
```

Without Supabase keys the app runs in **demo mode**: any email/password signs in locally and screens use mock data from `src/mocks/`.

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
  _layout.tsx               Root: theme variables, AuthProvider, auth guard (Stack.Protected)
  (auth)/                   Sign in / sign up (signed out)
  (tabs)/                   Home / Profile (signed in)
src/
  components/
    ui/                     Primitives: Text, Button, TextField, Card, Screen
    navigation/             Tab bars (native + web)
    demo-banner.tsx
  features/                 Feature-specific UI + hooks
    auth/                   AuthProvider / useAuth(), AuthLayout
    plants/                 PlantCard, usePlants()
  services/                 Backend access (the only place that touches Supabase)
    auth.service.ts         Supabase auth, or local demo session
    profile.service.ts      public.profiles
    plants.service.ts       Placeholder — returns mock data
  sensors/                  Reserved for hardware integration (mock SensorClient)
  hooks/                    Shared hooks (useTheme, useColorScheme)
  lib/                      Supabase client, small utilities (cn, dates, errors)
  types/                    models.ts (app models), database.ts (Supabase types)
  constants/                config.ts (env + demo mode), colors.ts (palette), theme.ts
  mocks/                    Temporary frontend data
  global.css                Tailwind entry
supabase/migrations/        SQL migrations (tables, RLS, triggers)
```

**Data flow:** screen → feature hook / `useAuth()` → service → Supabase (or mocks).
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
