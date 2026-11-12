/** Join class names, skipping falsy values: cn('p-4', isActive && 'bg-primary'). */
export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return typeof error === 'string' ? error : 'Something went wrong';
}

/** Resolves after `ms` — used by mock services to simulate network latency. */
export function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

const HOUR_MS = 60 * 60 * 1000;

/** ISO timestamp for `hours` hours before now (handy for mock data). */
export function isoHoursAgo(hours: number) {
  return new Date(Date.now() - hours * HOUR_MS).toISOString();
}

/** "just now", "12 minutes ago", "about 21 hours ago", "3 days ago". */
export function formatTimeAgo(iso: string, now = Date.now()) {
  const minutes = Math.round((now - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `about ${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

/** "Good morning" / "Good afternoon" / "Good evening" for the given hour (0–23). */
export function greetingFor(hour: number) {
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

/** "Monday, November 9" */
export function formatLongDate(date: Date) {
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

/** "Oct 21, 2026" */
export function formatMediumDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/** "Nov 3" — chart axis labels. Accepts ISO date (yyyy-mm-dd) as local date. */
export function formatShortDate(isoDate: string) {
  return parseLocalDate(isoDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/** "Sunday, Nov 8" */
export function formatDayHeading(isoDate: string) {
  return parseLocalDate(isoDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
}

/** "2:20 PM" */
export function formatClock(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

/** "2026-11-08" from a local Date (no UTC shift). */
export function toIsoDate(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Local midnight for "yyyy-mm-dd" (new Date("yyyy-mm-dd") would be UTC). */
export function parseLocalDate(isoDate: string) {
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** "1,240" */
/** `trimZeros`: "0" instead of "0.0", "1.1" stays "1.1". */
export function formatNumber(value: number, fractionDigits = 0, trimZeros = false) {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: trimZeros ? 0 : fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

/** Initials for an avatar: "Angel Aquino" → "AA", "demo@x.com" → "DE". */
export function initials(nameOrEmail: string) {
  const words = nameOrEmail.trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  return (words[0] ?? '?').slice(0, 2).toUpperCase();
}
