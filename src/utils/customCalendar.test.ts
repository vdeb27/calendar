import { describe, it, expect, beforeAll } from 'vitest';
import { buildCustomYear } from './customCalendar';
import { customYearNeedsLeapWeek, getLeapSeason } from './dateUtils';
import { CustomYear } from '../types/calendar';

// Find a non-leap and a leap year near the epoch for testing
let nonLeapYear: number;
let leapYear: number;
for (let y = 2020; y < 2030; y++) {
  if (!customYearNeedsLeapWeek(y) && !nonLeapYear!) nonLeapYear = y;
  if (customYearNeedsLeapWeek(y) && !leapYear!) leapYear = y;
}
nonLeapYear!;
leapYear!;

describe('buildCustomYear — non-leap year', () => {
  let year: CustomYear;

  beforeAll(() => {
    year = buildCustomYear(nonLeapYear);
  });

  it('has exactly 4 seasons', () => {
    expect(year.seasons.length).toBe(4);
  });

  it('seasons are in correct order', () => {
    expect(year.seasons.map(s => s.name)).toEqual(['Spring', 'Summer', 'Autumn', 'Winter']);
  });

  it('each season has 3 periods', () => {
    for (const season of year.seasons) {
      expect(season.periods.length).toBe(3);
    }
  });

  it('each period has 4 weeks', () => {
    for (const season of year.seasons) {
      for (const period of season.periods) {
        expect(period.weeks.length).toBe(4);
      }
    }
  });

  it('each week has 7 days', () => {
    for (const season of year.seasons) {
      for (const period of season.periods) {
        for (const week of period.weeks) {
          expect(week.days.length).toBe(7);
        }
      }
      for (const week of season.intercalaryWeeks) {
        expect(week.days.length).toBe(7);
      }
    }
  });

  it('each season has exactly 1 intercalary week', () => {
    for (const season of year.seasons) {
      expect(season.intercalaryWeeks.length).toBe(1);
    }
  });

  it('has 52 total weeks', () => {
    let total = 0;
    for (const season of year.seasons) {
      total += season.periods.length * 4 + season.intercalaryWeeks.length;
    }
    expect(total).toBe(52);
  });

  it('startDate is a Monday', () => {
    expect(year.startDate.getDay()).toBe(1);
  });

  it('endDate is 364 days after startDate', () => {
    const diff = Math.round((year.endDate.getTime() - year.startDate.getTime()) / (1000 * 60 * 60 * 24));
    expect(diff).toBe(364);
  });
});

describe('buildCustomYear — leap year', () => {
  let year: CustomYear;

  beforeAll(() => {
    year = buildCustomYear(leapYear);
  });

  it('has 53 total weeks', () => {
    let total = 0;
    for (const season of year.seasons) {
      total += season.periods.length * 4 + season.intercalaryWeeks.length;
    }
    expect(total).toBe(53);
  });

  it('exactly one season has 2 intercalary weeks', () => {
    const counts = year.seasons.map(s => s.intercalaryWeeks.length);
    expect(counts.filter(c => c === 2).length).toBe(1);
    expect(counts.filter(c => c === 1).length).toBe(3);
  });

  it('the leap season matches getLeapSeason', () => {
    const expectedSeason = getLeapSeason(leapYear);
    const leapSeasonObj = year.seasons.find(s => s.intercalaryWeeks.length === 2);
    expect(leapSeasonObj!.name.toLowerCase()).toBe(expectedSeason);
  });

  it('endDate is 371 days after startDate', () => {
    const diff = Math.round((year.endDate.getTime() - year.startDate.getTime()) / (1000 * 60 * 60 * 24));
    expect(diff).toBe(371);
  });
});

describe('period names', () => {
  let year: CustomYear;

  beforeAll(() => {
    year = buildCustomYear(2024);
  });

  it('Spring periods are Zeus, Hera, Poseidon', () => {
    expect(year.seasons[0].periods.map(p => p.name)).toEqual(['Zeus', 'Hera', 'Poseidon']);
  });

  it('Summer periods are Demeter, Apollo, Artemis', () => {
    expect(year.seasons[1].periods.map(p => p.name)).toEqual(['Demeter', 'Apollo', 'Artemis']);
  });

  it('Autumn periods are Ares, Athena, Hephaestus', () => {
    expect(year.seasons[2].periods.map(p => p.name)).toEqual(['Ares', 'Athena', 'Hephaestus']);
  });

  it('Winter periods are Aphrodite, Hermes, Hestia', () => {
    expect(year.seasons[3].periods.map(p => p.name)).toEqual(['Aphrodite', 'Hermes', 'Hestia']);
  });
});

describe('intercalary names', () => {
  let year: CustomYear;

  beforeAll(() => {
    year = buildCustomYear(2024);
  });

  it('intercalary weeks have correct names', () => {
    const names = year.seasons.map(s => s.intercalaryWeeks[0].intercalaryName);
    expect(names).toEqual(['Springjoy', 'Summerjoy', 'Autumnjoy', 'Winterjoy']);
  });
});

describe('date continuity', () => {
  it('all dates are consecutive with no gaps', () => {
    const year = buildCustomYear(2024);
    const allDays: Date[] = [];

    for (const season of year.seasons) {
      for (const period of season.periods) {
        for (const week of period.weeks) {
          for (const day of week.days) {
            allDays.push(day.date);
          }
        }
      }
      for (const week of season.intercalaryWeeks) {
        for (const day of week.days) {
          allDays.push(day.date);
        }
      }
    }

    for (let i = 1; i < allDays.length; i++) {
      const diff = Math.round((allDays[i].getTime() - allDays[i - 1].getTime()) / (1000 * 60 * 60 * 24));
      expect(diff).toBe(1);
    }
  });
});

describe('week numbering', () => {
  it('week numbers are sequential from 1', () => {
    const year = buildCustomYear(2024);
    const weekNumbers: number[] = [];

    for (const season of year.seasons) {
      for (const period of season.periods) {
        for (const week of period.weeks) {
          weekNumbers.push(week.customWeekNumber);
        }
      }
      for (const week of season.intercalaryWeeks) {
        weekNumbers.push(week.customWeekNumber);
      }
    }

    for (let i = 0; i < weekNumbers.length; i++) {
      expect(weekNumbers[i]).toBe(i + 1);
    }
  });
});

describe('olympian day numbering', () => {
  it('period days are numbered 1-28', () => {
    const year = buildCustomYear(2024);
    for (const season of year.seasons) {
      for (const period of season.periods) {
        const dayNumbers = period.weeks.flatMap(w => w.days.map(d => d.olympianDayNumber));
        expect(dayNumbers.length).toBe(28);
        expect(dayNumbers[0]).toBe(1);
        expect(dayNumbers[dayNumbers.length - 1]).toBe(28);
      }
    }
  });

  it('intercalary week days start at 1', () => {
    const year = buildCustomYear(2024);
    for (const season of year.seasons) {
      expect(season.intercalaryWeeks[0].days[0].olympianDayNumber).toBe(1);
    }
  });
});
