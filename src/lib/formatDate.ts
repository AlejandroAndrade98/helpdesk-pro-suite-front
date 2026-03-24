import { format } from 'date-fns';

/**
 * Safely formats a date value. Returns fallback if the value is
 * null, undefined, empty, or produces an invalid Date.
 */
export function formatDate(
  value: string | null | undefined,
  pattern: string = 'MMM d, yyyy',
  fallback: string = '—',
): string {
  if (!value) return fallback;
  try {
    const date = new Date(value);
    if (isNaN(date.getTime())) return fallback;
    return format(date, pattern);
  } catch {
    return fallback;
  }
}
