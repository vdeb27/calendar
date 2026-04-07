import { describe, it, expect, beforeAll } from 'vitest';
import { buildTraditionalYear, TraditionalYear } from './traditionalCalendar';

describe('buildTraditionalYear', () => {
  let result: TraditionalYear;

  beforeAll(() => {
    result = buildTraditionalYear(2024);
  });

  it('year property equals input', () => {
    expect(result.year).toBe(2024);
  });

  it('has 52 or 53 weeks', () => {
    expect(result.weeks.length).toBeGreaterThanOrEqual(52);
    expect(result.weeks.length).toBeLessThanOrEqual(53);
  });

  it('first week starts on a Monday', () => {
    expect(result.weeks[0].days[0].date.getDay()).toBe(1);
  });

  it('each week has exactly 7 days', () => {
    for (const week of result.weeks) {
      expect(week.days.length).toBe(7);
    }
  });

  it('first week number is 1', () => {
    expect(result.weeks[0].customWeekNumber).toBe(1);
  });

  it('customYearMapping is populated', () => {
    expect(result.customYearMapping.size).toBeGreaterThan(0);
  });

  it('mapping entries contain expected fields', () => {
    // Pick a mid-year date
    const midYearDate = new Date(2024, 5, 15); // June 15
    const info = result.customYearMapping.get(midYearDate.toDateString());
    expect(info).toBeDefined();
    expect(info!.seasonName).toBeDefined();
    expect(info!.customWeekNumber).toBeDefined();
    expect(typeof info!.isIntercalary).toBe('boolean');
  });

  it('weeks cover January through December', () => {
    const months = new Set<number>();
    for (const week of result.weeks) {
      for (const day of week.days) {
        if (day.date.getFullYear() === 2024) {
          months.add(day.date.getMonth());
        }
      }
    }
    // All 12 months should be represented
    for (let m = 0; m < 12; m++) {
      expect(months.has(m)).toBe(true);
    }
  });
});
