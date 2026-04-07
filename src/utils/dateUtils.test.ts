import { describe, it, expect } from 'vitest';
import {
  getMondayOfWeek,
  addDays,
  addWeeks,
  isSameDay,
  getMonthName,
  getTraditionalWeekNumber,
  getCustomYearStart,
  customYearNeedsLeapWeek,
  getLeapSeason,
} from './dateUtils';

describe('getMondayOfWeek', () => {
  it('returns Monday for a Wednesday', () => {
    // 2024-01-03 is a Wednesday
    const wed = new Date(2024, 0, 3);
    const mon = getMondayOfWeek(wed);
    expect(mon.getDay()).toBe(1);
    expect(mon.getDate()).toBe(1);
  });

  it('returns same date for a Monday', () => {
    const mon = new Date(2024, 0, 1);
    const result = getMondayOfWeek(mon);
    expect(result.getDate()).toBe(1);
  });

  it('returns preceding Monday for a Sunday', () => {
    // 2024-01-07 is a Sunday
    const sun = new Date(2024, 0, 7);
    const mon = getMondayOfWeek(sun);
    expect(mon.getDay()).toBe(1);
    expect(mon.getDate()).toBe(1);
  });
});

describe('addDays', () => {
  it('adds positive days', () => {
    const d = new Date(2024, 0, 1);
    const result = addDays(d, 5);
    expect(result.getDate()).toBe(6);
  });

  it('adds negative days', () => {
    const d = new Date(2024, 0, 10);
    const result = addDays(d, -5);
    expect(result.getDate()).toBe(5);
  });

  it('crosses month boundary', () => {
    const d = new Date(2024, 0, 30);
    const result = addDays(d, 5);
    expect(result.getMonth()).toBe(1); // February
    expect(result.getDate()).toBe(4);
  });

  it('crosses year boundary', () => {
    const d = new Date(2024, 11, 30);
    const result = addDays(d, 5);
    expect(result.getFullYear()).toBe(2025);
    expect(result.getMonth()).toBe(0);
    expect(result.getDate()).toBe(4);
  });
});

describe('addWeeks', () => {
  it('adds 1 week equals 7 days', () => {
    const d = new Date(2024, 0, 1);
    const byWeeks = addWeeks(d, 1);
    const byDays = addDays(d, 7);
    expect(byWeeks.getTime()).toBe(byDays.getTime());
  });

  it('subtracts weeks correctly', () => {
    const d = new Date(2024, 0, 15);
    const result = addWeeks(d, -2);
    expect(result.getDate()).toBe(1);
  });
});

describe('isSameDay', () => {
  it('returns true for same date', () => {
    const d1 = new Date(2024, 0, 1);
    const d2 = new Date(2024, 0, 1);
    expect(isSameDay(d1, d2)).toBe(true);
  });

  it('returns true for same day with different times', () => {
    const d1 = new Date(2024, 0, 1, 8, 0);
    const d2 = new Date(2024, 0, 1, 20, 30);
    expect(isSameDay(d1, d2)).toBe(true);
  });

  it('returns false for different days', () => {
    const d1 = new Date(2024, 0, 1);
    const d2 = new Date(2024, 0, 2);
    expect(isSameDay(d1, d2)).toBe(false);
  });
});

describe('getMonthName', () => {
  it('returns Jan for index 0', () => {
    expect(getMonthName(0)).toBe('Jan');
  });

  it('returns Dec for index 11', () => {
    expect(getMonthName(11)).toBe('Dec');
  });

  it('returns correct names for all months', () => {
    const expected = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for (let i = 0; i < 12; i++) {
      expect(getMonthName(i)).toBe(expected[i]);
    }
  });
});

describe('getTraditionalWeekNumber', () => {
  it('returns week 1 for 2024-01-01 (Monday)', () => {
    expect(getTraditionalWeekNumber(new Date(2024, 0, 1))).toBe(1);
  });

  it('returns week 53 for 2020-12-31 (Thursday, long ISO year)', () => {
    expect(getTraditionalWeekNumber(new Date(2020, 11, 31))).toBe(53);
  });

  it('returns week 25 for 2024-06-17 (Monday)', () => {
    expect(getTraditionalWeekNumber(new Date(2024, 5, 17))).toBe(25);
  });
});

describe('getCustomYearStart', () => {
  it('returns March 30, 2020 for epoch year', () => {
    const start = getCustomYearStart(2020);
    expect(start.getFullYear()).toBe(2020);
    expect(start.getMonth()).toBe(2); // March
    expect(start.getDate()).toBe(30);
  });

  it('always returns a Monday', () => {
    for (let year = 2018; year <= 2030; year++) {
      const start = getCustomYearStart(year);
      expect(start.getDay()).toBe(1);
    }
  });

  it('consecutive years are 364 or 371 days apart', () => {
    for (let year = 2018; year <= 2029; year++) {
      const start = getCustomYearStart(year);
      const nextStart = getCustomYearStart(year + 1);
      const daysBetween = Math.round((nextStart.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      expect([364, 371]).toContain(daysBetween);
    }
  });
});

describe('customYearNeedsLeapWeek', () => {
  it('returns boolean', () => {
    expect(typeof customYearNeedsLeapWeek(2020)).toBe('boolean');
  });

  it('produces exactly 71 leap years per 400-year cycle', () => {
    let leapCount = 0;
    for (let y = 2020; y < 2420; y++) {
      if (customYearNeedsLeapWeek(y)) leapCount++;
    }
    expect(leapCount).toBe(71);
  });
});

describe('getLeapSeason', () => {
  it('returns null for non-leap years', () => {
    // Find a non-leap year
    for (let y = 2020; y < 2030; y++) {
      if (!customYearNeedsLeapWeek(y)) {
        expect(getLeapSeason(y)).toBeNull();
        return;
      }
    }
  });

  it('returns a valid season for leap years', () => {
    const validSeasons = ['spring', 'summer', 'autumn', 'winter'];
    for (let y = 2020; y < 2030; y++) {
      if (customYearNeedsLeapWeek(y)) {
        expect(validSeasons).toContain(getLeapSeason(y));
        return;
      }
    }
  });
});
