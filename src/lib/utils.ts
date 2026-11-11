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

const DAY_MS = 24 * 60 * 60 * 1000;

/** Whole days between now and an ISO date (positive = in the past). */
export function daysSince(iso: string) {
  return Math.floor((Date.now() - new Date(iso).getTime()) / DAY_MS);
}

/** "today", "yesterday", "3 days ago". */
export function formatDaysAgo(iso: string) {
  const days = daysSince(iso);
  if (days <= 0) return 'today';
  if (days === 1) return 'yesterday';
  return `${days} days ago`;
}

/** ISO timestamp for `days` days before now (handy for mock data). */
export function isoDaysAgo(days: number) {
  return new Date(Date.now() - days * DAY_MS).toISOString();
}
