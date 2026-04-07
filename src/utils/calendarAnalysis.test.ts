import { describe, it, expect, beforeAll } from 'vitest';
import { computePerpetual400YearPattern, verifyPattern } from './calendarAnalysis';

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
    expect(totalWeeks).toBe(146097 / 7);
  });

  it('is deterministic', () => {
    const pattern2 = computePerpetual400YearPattern();
    expect(pattern2).toEqual(pattern);
  });
});

describe('verifyPattern — independent verification', () => {
  let pattern: Array<{ yearOffset: number; season: string }>;
  let verification: ReturnType<typeof verifyPattern>;

  beforeAll(() => {
    pattern = computePerpetual400YearPattern();
    verification = verifyPattern(pattern as Array<{ yearOffset: number; season: 'spring' | 'summer' | 'autumn' | 'winter' }>);
  });

  it('checks all 1600 events', () => {
    expect(verification.totalEvents).toBe(1600);
  });

  it('reports a positive number of hits', () => {
    expect(verification.totalHits).toBeGreaterThan(0);
  });

  it('all per-year hit counts are between 0 and 4', () => {
    for (const yr of verification.perYear) {
      expect(yr.hits).toBeGreaterThanOrEqual(0);
      expect(yr.hits).toBeLessThanOrEqual(4);
    }
  });

  it('per-year hits sum to totalHits', () => {
    const sum = verification.perYear.reduce((acc, yr) => acc + yr.hits, 0);
    expect(sum).toBe(verification.totalHits);
  });

  it('per-year drift sums to totalDrift', () => {
    const sum = verification.perYear.reduce((acc, yr) => acc + yr.drift, 0);
    expect(sum).toBe(verification.totalDrift);
  });

  it('reports the optimization result', () => {
    console.log(`\n=== INTERCALARY OPTIMIZATION RESULT ===`);
    console.log(`Events in Vreugde: ${verification.totalHits}/${verification.totalEvents} (${verification.percentage}%)`);
    console.log(`Total drift: ${verification.totalDrift} days`);
    console.log(`Average drift per miss: ${(verification.totalDrift / (verification.totalEvents - verification.totalHits)).toFixed(1)} days`);

    // Show years with 0 hits (worst cases)
    const worstYears = verification.perYear.filter(yr => yr.hits === 0);
    if (worstYears.length > 0) {
      console.log(`\nYears with 0 hits: ${worstYears.length}`);
      worstYears.slice(0, 5).forEach(yr => {
        console.log(`  ${yr.year}: drift=${yr.drift}`);
        yr.details.forEach(d => console.log(`    ${d}`));
      });
    }

    // Show years with 4 hits (best cases)
    const bestYears = verification.perYear.filter(yr => yr.hits === 4);
    console.log(`Years with 4/4 hits: ${bestYears.length}`);

    // This test always passes — it's for reporting
    expect(true).toBe(true);
  });
});
