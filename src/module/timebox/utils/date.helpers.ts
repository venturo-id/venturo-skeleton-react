// Date utilities for Timebox module

import type { Dayjs } from 'dayjs';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import isToday from 'dayjs/plugin/isToday';
import timezone from 'dayjs/plugin/timezone';
import isTomorrow from 'dayjs/plugin/isTomorrow';
import isYesterday from 'dayjs/plugin/isYesterday';
import relativeTime from 'dayjs/plugin/relativeTime';

// Extend dayjs with plugins
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isToday);
dayjs.extend(isTomorrow);
dayjs.extend(isYesterday);

// ----------------------------------------------------------------------
// Type Definitions
// ----------------------------------------------------------------------

export type DateInput = string | Date | Dayjs | null | undefined;

// ----------------------------------------------------------------------
// Date Formatting
// ----------------------------------------------------------------------

/**
 * Format date for display
 */
export function formatDate(date: DateInput, format: string = 'DD MMM YYYY'): string {
  if (!date) return '';
  return dayjs(date).format(format);
}

/**
 * Format date with time for display
 */
export function formatDateTime(date: DateInput): string {
  if (!date) return '';
  return dayjs(date).format('DD MMM YYYY HH:mm');
}

/**
 * Format date as relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: DateInput): string {
  if (!date) return '';
  return dayjs(date).fromNow();
}

/**
 * Format date for input (ISO format)
 */
export function formatInputDate(date: DateInput): string {
  if (!date) return '';
  return dayjs(date).format('YYYY-MM-DD');
}

/**
 * Format date with time for input
 */
export function formatInputDateTime(date: DateInput): string {
  if (!date) return '';
  return dayjs(date).format('YYYY-MM-DDTHH:mm');
}

// ----------------------------------------------------------------------
// Date Checks
// ----------------------------------------------------------------------

/**
 * Check if date is today
 */
export function isDateToday(date: DateInput): boolean {
  if (!date) return false;
  return dayjs(date).isToday();
}

/**
 * Check if date is tomorrow
 */
export function isDateTomorrow(date: DateInput): boolean {
  if (!date) return false;
  return dayjs(date).isTomorrow();
}

/**
 * Check if date is yesterday
 */
export function isDateYesterday(date: DateInput): boolean {
  if (!date) return false;
  return dayjs(date).isYesterday();
}

/**
 * Check if date is in the past
 */
export function isDatePast(date: DateInput): boolean {
  if (!date) return false;
  return dayjs(date).isBefore(dayjs(), 'day');
}

/**
 * Check if date is in the future
 */
export function isDateFuture(date: DateInput): boolean {
  if (!date) return false;
  return dayjs(date).isAfter(dayjs(), 'day');
}

/**
 * Check if date is overdue (past and not completed)
 */
export function isDateOverdue(dueDate: DateInput, completedAt?: DateInput): boolean {
  if (!dueDate) return false;
  if (completedAt) return false; // Task is completed
  return dayjs(dueDate).isBefore(dayjs(), 'day');
}

/**
 * Check if date is within this week
 */
export function isDateThisWeek(date: DateInput): boolean {
  if (!date) return false;
  const now = dayjs();
  const startOfWeek = now.startOf('week');
  const endOfWeek = now.endOf('week');
  return dayjs(date).isAfter(startOfWeek) && dayjs(date).isBefore(endOfWeek);
}

/**
 * Check if date is within next week
 */
export function isDateNextWeek(date: DateInput): boolean {
  if (!date) return false;
  const now = dayjs();
  const startOfNextWeek = now.add(1, 'week').startOf('week');
  const endOfNextWeek = now.add(1, 'week').endOf('week');
  return dayjs(date).isAfter(startOfNextWeek) && dayjs(date).isBefore(endOfNextWeek);
}

// ----------------------------------------------------------------------
// Date Calculations
// ----------------------------------------------------------------------

/**
 * Get start of day
 */
export function getStartOfDay(date?: DateInput): Date {
  return dayjs(date).startOf('day').toDate();
}

/**
 * Get end of day
 */
export function getEndOfDay(date?: DateInput): Date {
  return dayjs(date).endOf('day').toDate();
}

/**
 * Get start of week
 */
export function getStartOfWeek(date?: DateInput): Date {
  return dayjs(date).startOf('week').toDate();
}

/**
 * Get end of week
 */
export function getEndOfWeek(date?: DateInput): Date {
  return dayjs(date).endOf('week').toDate();
}

/**
 * Add days to date
 */
export function addDays(date: DateInput, days: number): Date {
  return dayjs(date).add(days, 'day').toDate();
}

/**
 * Subtract days from date
 */
export function subtractDays(date: DateInput, days: number): Date {
  return dayjs(date).subtract(days, 'day').toDate();
}

/**
 * Add weeks to date
 */
export function addWeeks(date: DateInput, weeks: number): Date {
  return dayjs(date).add(weeks, 'week').toDate();
}

/**
 * Get difference in days between two dates
 */
export function getDaysDiff(date1: DateInput, date2: DateInput): number {
  return dayjs(date1).diff(dayjs(date2), 'day');
}

/**
 * Get difference in hours between two dates
 */
export function getHoursDiff(date1: DateInput, date2: DateInput): number {
  return dayjs(date1).diff(dayjs(date2), 'hour');
}

// ----------------------------------------------------------------------
// Date Grouping
// ----------------------------------------------------------------------

/**
 * Get date group for task grouping
 */
export type DateGroup =
  | 'overdue'
  | 'yesterday'
  | 'today'
  | 'tomorrow'
  | 'this_week'
  | 'next_week'
  | 'later'
  | 'no_date';

export function getDateGroup(date: DateInput, completedAt?: DateInput): DateGroup {
  if (!date) return 'no_date';

  if (completedAt) {
    // If completed, show when it was completed
    if (isDateYesterday(date)) return 'yesterday';
    if (isDateToday(date)) return 'today';
    return 'later';
  }

  if (isDateOverdue(date, completedAt)) return 'overdue';
  if (isDateToday(date)) return 'today';
  if (isDateTomorrow(date)) return 'tomorrow';
  if (isDateThisWeek(date)) return 'this_week';
  if (isDateNextWeek(date)) return 'next_week';
  return 'later';
}

/**
 * Get date group label
 */
export function getDateGroupLabel(group: DateGroup): string {
  const labels: Record<DateGroup, string> = {
    overdue: 'Overdue',
    yesterday: 'Yesterday',
    today: 'Today',
    tomorrow: 'Tomorrow',
    this_week: 'This Week',
    next_week: 'Next Week',
    later: 'Later',
    no_date: 'No Date',
  };
  return labels[group];
}

// ----------------------------------------------------------------------
// Date Parsing
// ----------------------------------------------------------------------

/**
 * Parse date string to Date object
 */
export function parseDate(date: DateInput): Date | null {
  if (!date) return null;
  const parsed = dayjs(date);
  return parsed.isValid() ? parsed.toDate() : null;
}

/**
 * Parse ISO string to Date object
 */
export function parseISODate(isoString: string): Date | null {
  if (!isoString) return null;
  const parsed = dayjs(isoString);
  return parsed.isValid() ? parsed.toDate() : null;
}

// ----------------------------------------------------------------------
// Date Validation
// ----------------------------------------------------------------------

/**
 * Check if date is valid
 */
export function isValidDate(date: DateInput): boolean {
  if (!date) return false;
  return dayjs(date).isValid();
}

/**
 * Check if date string is valid ISO format
 */
export function isValidISODate(isoString: string): boolean {
  if (!isoString) return false;
  return dayjs(isoString).isValid();
}

// ----------------------------------------------------------------------
// Timezone Utilities
// ----------------------------------------------------------------------

/**
 * Get user's timezone
 */
export function getUserTimezone(): string {
  return dayjs.tz.guess();
}

/**
 * Convert date to user's timezone
 */
export function toUserTimezone(date: DateInput): Date {
  if (!date) return new Date();
  return dayjs(date).tz(dayjs.tz.guess()).toDate();
}

/**
 * Format date in user's timezone
 */
export function formatInUserTimezone(date: DateInput, format: string = 'DD MMM YYYY HH:mm'): string {
  if (!date) return '';
  return dayjs(date).tz(dayjs.tz.guess()).format(format);
}
