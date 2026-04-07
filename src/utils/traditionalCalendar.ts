import { Week, Day, CustomYear, SeasonName } from '../types/calendar';
import { buildCustomYear } from './customCalendar';
import { getMondayOfWeek, addDays, addWeeks, getTraditionalWeekNumber } from './dateUtils';
import { getSolsticesAndEquinoxes } from './astronomicalEvents';
import { DAYS_PER_WEEK } from '../constants/calendar';

export interface CustomWeekInfo {
  seasonName: SeasonName;
  periodName: string | null;
  customWeekNumber: number;
  isIntercalary: boolean;
  periodIndex: number;
  seasonTint: string;
  olympianDayNumber: number;
  intercalaryName?: string;
}

export interface TraditionalYear {
  year: number;
  weeks: Week[];
  customYearMapping: Map<string, CustomWeekInfo>;
}

function buildCustomMapping(customYears: CustomYear[]): Map<string, CustomWeekInfo> {
  const mapping = new Map<string, CustomWeekInfo>();

  customYears.forEach(customYear => {
    customYear.seasons.forEach((season) => {
      season.periods.forEach((period, periodIdx) => {
        period.weeks.forEach(week => {
          week.days.forEach(day => {
            mapping.set(day.date.toDateString(), {
              seasonName: season.name,
              periodName: period.name,
              customWeekNumber: week.customWeekNumber,
              isIntercalary: false,
              periodIndex: periodIdx,
              seasonTint: season.tint,
              olympianDayNumber: day.olympianDayNumber,
            });
          });
        });
      });

      // Handle intercalary weeks
      season.intercalaryWeeks.forEach(intercalaryWeek => {
        intercalaryWeek.days.forEach(day => {
          mapping.set(day.date.toDateString(), {
            seasonName: season.name,
            periodName: null,
            customWeekNumber: intercalaryWeek.customWeekNumber,
            isIntercalary: true,
            periodIndex: 3,
            seasonTint: season.tint,
            olympianDayNumber: day.olympianDayNumber,
            intercalaryName: intercalaryWeek.intercalaryName,
          });
        });
      });
    });
  });

  return mapping;
}

export function buildTraditionalYear(year: number): TraditionalYear {
  // Get custom years that overlap this traditional year
  // Traditional year 2026 (Jan-Dec) overlaps:
  // - Custom year 2025 (Mar 2025 - Mar 2026)
  // - Custom year 2026 (Mar 2026 - Mar 2027)
  const customYearPrev = buildCustomYear(year - 1);
  const customYearCurr = buildCustomYear(year);

  const customYearMapping = buildCustomMapping([customYearPrev, customYearCurr]);

  // Get astronomical events for this year and next
  const astronomicalEvents = getSolsticesAndEquinoxes(year);
  const nextYearEvents = getSolsticesAndEquinoxes(year + 1);
  nextYearEvents.forEach((value, key) => astronomicalEvents.set(key, value));

  // Build weeks starting from first Monday of ISO week 1
  // ISO week 1 is the week containing the first Thursday of the year
  const jan4 = new Date(year, 0, 4);
  const thursdayOfWeek1 = new Date(jan4.valueOf());
  const dayNrOfJan4 = (jan4.getDay() + 6) % 7;
  thursdayOfWeek1.setDate(jan4.getDate() - dayNrOfJan4 + 3);
  const mondayOfWeek1 = getMondayOfWeek(thursdayOfWeek1);

  const weeks: Week[] = [];
  let currentDate = mondayOfWeek1;

  // Check today's date
  const today = new Date();

  // Generate up to 53 weeks (to cover the full year)
  for (let i = 0; i < 53; i++) {
    const days: Day[] = [];

    for (let d = 0; d < DAYS_PER_WEEK; d++) {
      const date = addDays(currentDate, d);
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const event = astronomicalEvents.get(date.toDateString());
      const isToday = date.toDateString() === today.toDateString();

      // Get olympianDayNumber from custom mapping
      const customInfo = customYearMapping.get(date.toDateString());
      const olympianDayNumber = customInfo?.olympianDayNumber || 0;

      days.push({
        date,
        traditionalDayNumber: date.getDate(),
        olympianDayNumber,
        isWeekend,
        astronomicalEvent: event,
        isToday,
      });
    }

    const traditionalWeekNum = getTraditionalWeekNumber(currentDate);

    weeks.push({
      customWeekNumber: traditionalWeekNum,
      days,
      isIntercalary: false,
    });

    currentDate = addWeeks(currentDate, 1);

    // Stop if we've gone into the next year's weeks
    const lastDayOfWeek = days[6];
    if (i > 50 && lastDayOfWeek.date.getFullYear() > year && lastDayOfWeek.date.getMonth() > 0) {
      break;
    }
  }

  return {
    year,
    weeks,
    customYearMapping,
  };
}
