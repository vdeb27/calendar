import { computePerpetual400YearPattern } from './calendarAnalysis';

export function getMondayOfWeek(date: Date): Date {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.getFullYear(), date.getMonth(), diff);
}

// Leap season type - which season gets the extra intercalary week
export type LeapSeason = 'spring' | 'summer' | 'autumn' | 'winter';

// Perpetual Olympian Calendar Configuration
// Based on 400-year astronomical cycle
// - 400 years = 146,097 days = 20,871 weeks exactly
// - Pattern contains exactly 71 leap weeks per 400-year cycle
// - Epoch: March 30, 2020 (Monday)
const EPOCH_YEAR = 2020;
// UTC epoch — must match calendarAnalysis.ts for consistency
const EPOCH_START_UTC = new Date(Date.UTC(2020, 2, 30)); // March 30, 2020 (Monday) UTC

// Perpetual 400-year leap week pattern
// Computed using astronomical event drift optimization
// Each entry specifies a year offset (0-399) and which season gets the leap week
interface LeapWeekEntry {
  yearOffset: number;
  season: LeapSeason;
}

// Lazy-load the perpetual pattern
let PERPETUAL_PATTERN: LeapWeekEntry[] | null = null;

function getPerpetualPattern(): LeapWeekEntry[] {
  if (PERPETUAL_PATTERN === null) {
    // Compute the pattern on first use
    PERPETUAL_PATTERN = computePerpetual400YearPattern();
  }
  return PERPETUAL_PATTERN!;
}

/**
 * Get leap week information for a given year using the perpetual 400-year pattern
 */
function getLeapInfoForYear(year: number): LeapWeekEntry | null {
  const pattern = getPerpetualPattern();
  // Calculate offset within 400-year cycle
  const offset = ((year - EPOCH_YEAR) % 400 + 400) % 400;
  return pattern.find(entry => entry.yearOffset === offset) || null;
}

export function getCustomYearStart(year: number): Date {
  // Calculate the start date by counting weeks from the UTC epoch,
  // then convert to local date for UI display.
  let utcMs = EPOCH_START_UTC.getTime();

  if (year >= EPOCH_YEAR) {
    for (let y = EPOCH_YEAR; y < year; y++) {
      const leapInfo = getLeapInfoForYear(y);
      const weeks = leapInfo ? 53 : 52;
      utcMs += weeks * 7 * 24 * 60 * 60 * 1000;
    }
  } else {
    for (let y = EPOCH_YEAR - 1; y >= year; y--) {
      const leapInfo = getLeapInfoForYear(y);
      const weeks = leapInfo ? 53 : 52;
      utcMs -= weeks * 7 * 24 * 60 * 60 * 1000;
    }
  }

  // Convert UTC midnight to a local Date representing the same calendar date
  const utcDate = new Date(utcMs);
  return new Date(utcDate.getUTCFullYear(), utcDate.getUTCMonth(), utcDate.getUTCDate());
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function addWeeks(date: Date, weeks: number): Date {
  return addDays(date, weeks * 7);
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function getMonthName(monthIndex: number): string {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  return months[monthIndex];
}

export function getTraditionalWeekNumber(date: Date): number {
  // ISO 8601 week numbering
  // Week 1 is the week containing the first Thursday of the year (or Jan 4)
  const target = new Date(date.valueOf());
  const dayNr = (date.getDay() + 6) % 7; // Monday = 0, Sunday = 6
  target.setDate(target.getDate() - dayNr + 3); // Set to Thursday of this week
  const firstThursday = new Date(target.getFullYear(), 0, 4);
  const thursdayOfWeek1 = new Date(firstThursday.valueOf());
  const dayNrOfFirstThursday = (firstThursday.getDay() + 6) % 7;
  thursdayOfWeek1.setDate(firstThursday.getDate() - dayNrOfFirstThursday + 3);

  const weekDiff = (target.valueOf() - thursdayOfWeek1.valueOf()) / (7 * 24 * 60 * 60 * 1000);
  return 1 + Math.round(weekDiff);
}

export function customYearNeedsLeapWeek(year: number): boolean {
  // Use perpetual 400-year pattern
  return getLeapInfoForYear(year) !== null;
}

export function getLeapSeason(year: number): LeapSeason | null {
  const leapInfo = getLeapInfoForYear(year);
  return leapInfo ? leapInfo.season : null;
}
