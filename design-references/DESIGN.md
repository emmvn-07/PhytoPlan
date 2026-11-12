# PhytoPlan Design Spec

Source: 7 screenshots in this folder (light mode only), 1179px wide = 393pt @3x.
Rows marked **measured** were pixel-sampled from `1. Farm overview.png` and are what `src/constants/colors.ts` uses; the rest are eyeballed and get sampled when their screen is built.

## 1. Tokens

### Color
| Token | Hex | Use |
|---|---|---|
| `background` | `#F7F6EF` measured | Screen background (warm off-white) |
| `surface` | `#FCFBF6` measured | Cards, tiles, tab bar |
| `surface-muted` | `#ECF1E4` measured | Icon circles, segmented-control track, inactive chips |
| `highlight` | `#FFFFFF` measured | 1px light edge on cards, light chips over images |
| `border` | `#EBEDE6` measured | Dividers, progress track |
| `primary` | `#194D37` measured | Logo, brand text, "Healthy", links, chevrons |
| `primary-soft` | `#E9F2E9` measured | "Demo data" pill |
| `primary-muted` | `#2E7054` measured | Avatar |
| `accent` | `#166E49` measured | Active tab pill |
| `progress` | `#6BA67C` measured | Progress-bar fill |
| `text` | `#071B19` measured | Headings, values |
| `text-secondary` | `#6F7769` measured | Subtitles, captions |
| `text-tertiary` | `#848A74` measured | Overline labels, units, inactive tabs |
| `icon-muted` | `#B4BBA6` measured | Metric-tile icons |
| `danger` | `#DC252A` measured | "Needs attention", stressed count, harvest button |
| `danger-soft` | `#FCE9E2` measured | Alert icon circle, destructive button fill |
| `attention` | `#D14C32` measured | Alert triangle icon, notification dot |
| `offline` | `#94A3B8` | Offline dot/text, disabled wifi icon |
| `warning` | `#C27C1A` | Temperature icon, trend icon, advisory icon |
| `info` / `info-soft` | `#1F6FB2` / `#E3EEF8` | Water/irrigation icon and tag |
| `nutrient` / `nutrient-soft` | `#7C3AED` / `#EFE7FB` | Nutrient icon and tag |
| `hero-gradient` | `#1E4D36 → #2F6E4E` | Current-conditions hero card |
| `reservoir-gradient` | `#9BD3B0 → #1E5A3C` | Reservoir tank fill, progress bar |

### Type (system sans)
| Style | Size / weight | Example |
|---|---|---|
| `display` | 64 / 700 | "50 %" |
| `title` | 34 / 700, tight leading | "Garden Beds", "Good evening, Angel" |
| `metric` | 32 / 600 + small `unit` (14, muted) | "30.4 °C" |
| `section` | 20 / 600 | "Environmental monitoring" |
| `body` | 16 / 500 | Card titles, list rows |
| `caption` | 14 / 400, muted | "Last sync about 21 hours ago" |
| `overline` | 12 / 500, UPPERCASE, letter-spacing ~1.5, muted | "AIR TEMP", "FARM OVERVIEW" |

### Shape & spacing
- Radius: cards 24, inner tiles 20, inputs/buttons 16, pills/chips full.
- Card padding 20–24. Screen gutter 16–20. Vertical gap between sections 24–32, between cards 12.
- Elevation: soft shadow `0 4 16 rgba(36,48,28,0.07)` plus a 1px `highlight` edge (`Shadows.card`); filled green elements (active tab, avatar) use `Shadows.raised`.
- Measured type scale (pt): display 44 bold · heading 25 bold · metric 23/26 semibold · stat 19 · section 14 semibold · subhead 13 · body 12 medium · caption 11 · overline 10 caps +1 tracking. See `src/components/ui/text.tsx`.

## 2. Reusable components
| Component | Seen in | Notes |
|---|---|---|
| `ScreenHeader` | all | `title` plus a green dot and subtitle line; optional right slot ("Gateway online" pill, bell and avatar). |
| `Card` | all | `surface`, radius 24, soft shadow. Variant `hero` (gradient, white text). |
| `SectionHeader` | 1, 3, 7 | `section` title with a right link ("View all") or meta text ("3 records", "Tap to expand", "• Live"). |
| `MetricTile` | 1, 3, 6, 7 | Overline label, top-right icon (optionally in a tinted circle), value with unit. Used in a 2-col grid. |
| `StatRow` | 1, 2, 6 | 3–4 numbers with overline labels, optional vertical dividers, optional color per value. |
| `StatusDot` | 2, 1, 3 | Dot plus label: Healthy / Needs attention / Offline. |
| `Badge` / `Pill` | 1, 3, 4, 5, 7 | Small rounded label: "DEMO DATA", "B-01", "96%", "completed", "100% match", category tags (Irrigation/Nutrients/Scan). |
| `BedCard` | 1, 2 | Image (top, radius 24), `B-0x` pill top-left, wifi badge top-right, name, `StatusDot`, divider, moisture % and temp °. Offline variant shows a desaturated image and "—". |
| `CropCard` | 5 | Image with dark gradient; name and scientific name overlaid; match pill; footer of 3 metrics (Duration, Water/day, Temp). |
| `ListRow` | 1, 7 | Leading tinted icon circle or number box, title and caption, trailing value/badge/chevron. Variants: alert, execution log, bed control (expandable). |
| `TimelineItem` | 4 | Tinted icon circle on a vertical line, card with title, time, description, tag and bed id. |
| `SegmentedControl` | 5, 6, 3 | `surface-muted` track with a white selected segment ("Crops/Analytics", "7D/14D/30D", "Smart/Manual"). |
| `Chip` / `FilterChips` | 2, 3, 6 | Horizontal, pill-shaped; selected = `primary` fill with white text, else outline or muted fill. |
| `Button` | 3, 4, 5, 6 | `primary` (filled green), `secondary` (outline), `soft` (tinted: info/nutrient/primary-soft), `danger-soft`. Optional leading Lucide icon. Height ~48, radius 16. |
| `SearchField` / `Select` / `TextField` | 2, 3 | Bordered, radius 16, leading icon or trailing chevron/unit/clock. |
| `ProgressBar` | 1, 3, 6, 7 | Thin, rounded, track `surface-muted`, fill green/gradient. |
| `ReservoirGauge` | 3, 7 | Vertical tank with % label and gradient fill, next to capacity text, progress bar and status line. |
| `LineChart` | 3, 6 | Smooth line, light area fill, dot markers, faint gridlines, metric chips above, caption below. |
| `CalendarMonth` | 4 | Month nav (circle arrow buttons), 7-col grid; selected = filled `primary` circle, today = outlined circle, green dot = has records. |
| `Toggle` | 7 | Green track switch in a settings row card. |
| `CameraFeed` | 3 | Live image with overlay labels (REC, LIVE 1080P, timestamp, bed id). |
| `IconCircle` | many | 40–48 circle in a soft tint holding a Lucide icon. |

Icons: Lucide outline (home, sprout, calendar, sparkles, sliders-horizontal, droplets, thermometer, wifi, wifi-off, flask-conical, scan, alert-triangle, bell, chevron-*, power, activity, shield-check, refresh-cw, download, clock, camera, play, square, check-circle, scissors).

## 3. Navigation
Floating bottom tab bar: pill-shaped container in `surface` with a shadow, inset from screen edges. The active tab is a filled `primary` pill with a white icon and bold label; inactive tabs are muted icon plus label.

| Tab | Route | Screen |
|---|---|---|
| Home | `(tabs)/index` | Farm overview (greeting, health hero, ADSS link, env tiles, water, beds carousel, alerts) |
| Beds | `(tabs)/beds` | Garden beds (stats, search, filter, 2-col grid) |
| Calendar | `(tabs)/calendar` | Agronomic calendar (conditions hero, month grid, "Suggested plants" CTA, day timeline) |
| Insights | `(tabs)/insights` | Segmented: Crops (conditions and crop cards) / Analytics (period, export, stats, trends chart) |
| Control | `(tabs)/control` | Irrigation control (pump/active tiles, reservoir, auto toggle, bed controls, executions) |

Stack (pushed over tabs, no tab bar): `beds/[id]`, the bed detail (back button, hero image, camera and health, irrigation overrides, schedule form, metrics grid, trends, reservoir, bed actions).
Header avatar/bell (Home) leads to Profile/notifications. The current Profile tab moves there.

## 4. Mapping to current code
- Extend `src/constants/colors.ts` with the tokens above. Rename/keep: `backgroundElement` → `surface`, `backgroundSelected` → `surface-muted`. Update `primary` to the deeper green.
- Existing `Card`, `Button`, `Text`, `TextField`, `Screen` become the base; add variants rather than new components where possible.
- Native tab bar (`NativeTabs`) can't render this floating pill design. A custom tab bar (Expo Router `Tabs` with a `tabBar` render, like the current `app-tabs.web.tsx`) is needed to match.
- Dark mode is not designed; derive it later from the tokens.
