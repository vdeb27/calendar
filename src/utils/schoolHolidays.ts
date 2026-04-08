import { schoolHolidayData, SchoolHolidayRegion, SchoolHolidayType } from '../data/schoolHolidays';

/**
 * Returns a Map of date string → holiday type for all school holidays
 * in the given calendar year for the given region.
 * Key format: date.toDateString() (consistent with astro events / moon phases).
 */
export function getSchoolHolidays(
  year: number,
  region: SchoolHolidayRegion
): Map<string, SchoolHolidayType> {
  const result = new Map<string, SchoolHolidayType>();

  for (const entry of schoolHolidayData) {
    if (!entry.regions.includes(region)) continue;

    const start = parseDate(entry.startDate);
    const end = parseDate(entry.endDate);

    // Skip entries that don't overlap this calendar year at all
    if (end.getFullYear() < year && start.getFullYear() < year) continue;
    if (start.getFullYear() > year) continue;

    // Skip leading weekend when holiday starts on Saturday
    const current = new Date(start);
    if (current.getDay() === 6) { // Saturday
      current.setDate(current.getDate() + 2); // skip to Monday
    }

    // Iterate each day in the range (inclusive)
    while (current <= end) {
      if (current.getFullYear() === year) {
        result.set(current.toDateString(), entry.type);
      }
      current.setDate(current.getDate() + 1);
    }
  }

  return result;
}

function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}
