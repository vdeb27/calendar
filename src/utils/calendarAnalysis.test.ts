import { describe, it, expect, beforeAll } from 'vitest';
import { computePerpetual400YearPattern } from './calendarAnalysis';

describe('computePerpetual400YearPattern', () => {
  let pattern: Array<{ yearOffset: number; season: string }>;

  beforeAll(() => {
    pattern = computePerpetual400YearPattern();
  });

  it('returns exactly 71 entries', () => {
    expect(pattern.length).toBe(71);
  });

  it('all yearOffsets are in range [0, 399]', () => {
    for (const entry of pattern) {
      expect(entry.yearOffset).toBeGreaterThanOrEqual(0);
      expect(entry.yearOffset).toBeLessThan(400);
    }
  });

  it('has no duplicate yearOffsets', () => {
    const offsets = pattern.map(e => e.yearOffset);
    expect(new Set(offsets).size).toBe(offsets.length);
  });

  it('yearOffsets are sorted ascending', () => {
    for (let i = 1; i < pattern.length; i++) {
      expect(pattern[i].yearOffset).toBeGreaterThan(pattern[i - 1].yearOffset);
    }
  });

  it('all seasons are valid', () => {
    const validSeasons = ['spring', 'summer', 'autumn', 'winter'];
    for (const entry of pattern) {
      expect(validSeasons).toContain(entry.season);
    }
  });

  it('produces exactly 20,871 weeks over 400 years (Gregorian cycle)', () => {
    const leapYears = pattern.length; // 71
    const normalYears = 400 - leapYears; // 329
    const totalWeeks = normalYears * 52 + leapYears * 53;
    expect(totalWeeks).toBe(20871);
    expect(totalWeeks).toBe(146097 / 7); // 400 Gregorian years in days / 7
  });

  it('is deterministic', () => {
    const pattern2 = computePerpetual400YearPattern();
    expect(pattern2).toEqual(pattern);
  });
});
