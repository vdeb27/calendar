import { describe, it, expect } from 'vitest';
import {
  getSpringEquinox,
  getSummerSolstice,
  getAutumnEquinox,
  getWinterSolstice,
  getSolsticesAndEquinoxes,
  getMoonPhases,
} from './astronomicalEvents';

function toUTCDate(d: Date): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
}

describe('getSpringEquinox', () => {
  it('returns March 20 for 2020', () => {
    expect(toUTCDate(getSpringEquinox(2020))).toBe('2020-03-20');
  });

  it('returns March 20 for 2024', () => {
    expect(toUTCDate(getSpringEquinox(2024))).toBe('2024-03-20');
  });

  it('returns March 20 for 2025', () => {
    expect(toUTCDate(getSpringEquinox(2025))).toBe('2025-03-20');
  });
});

describe('getSummerSolstice', () => {
  it('returns June 20 for 2020', () => {
    expect(toUTCDate(getSummerSolstice(2020))).toBe('2020-06-20');
  });

  it('returns June 20 for 2024', () => {
    expect(toUTCDate(getSummerSolstice(2024))).toBe('2024-06-20');
  });
});

describe('getAutumnEquinox', () => {
  it('returns September 22 for 2020', () => {
    expect(toUTCDate(getAutumnEquinox(2020))).toBe('2020-09-22');
  });

  it('returns September 22 for 2024', () => {
    expect(toUTCDate(getAutumnEquinox(2024))).toBe('2024-09-22');
  });
});

describe('getWinterSolstice', () => {
  it('returns December 21 for 2020', () => {
    expect(toUTCDate(getWinterSolstice(2020))).toBe('2020-12-21');
  });

  it('returns December 21 for 2024', () => {
    expect(toUTCDate(getWinterSolstice(2024))).toBe('2024-12-21');
  });
});

describe('getSolsticesAndEquinoxes', () => {
  it('returns a Map with exactly 4 entries', () => {
    const events = getSolsticesAndEquinoxes(2024);
    expect(events.size).toBe(4);
  });

  it('contains all four event types', () => {
    const events = getSolsticesAndEquinoxes(2024);
    const values = [...events.values()];
    expect(values).toContain('spring-equinox');
    expect(values).toContain('summer-solstice');
    expect(values).toContain('autumn-equinox');
    expect(values).toContain('winter-solstice');
  });
});

describe('getMoonPhases', () => {
  it('returns approximately 49-53 phases per year', () => {
    const phases = getMoonPhases(2024);
    expect(phases.size).toBeGreaterThanOrEqual(49);
    expect(phases.size).toBeLessThanOrEqual(53);
  });

  it('contains all four phase types', () => {
    const phases = getMoonPhases(2024);
    const values = [...phases.values()];
    expect(values).toContain('new-moon');
    expect(values).toContain('first-quarter');
    expect(values).toContain('full-moon');
    expect(values).toContain('last-quarter');
  });

  it('correctly identifies known full moon dates in 2024', () => {
    const phases = getMoonPhases(2024);
    // Verify full moons exist and are on expected dates (within ±1 day tolerance for timezone)
    const fullMoons = [...phases.entries()].filter(([, v]) => v === 'full-moon');
    expect(fullMoons.length).toBeGreaterThanOrEqual(12);
    expect(fullMoons.length).toBeLessThanOrEqual(13);

    // Check specific known full moon: March 25, 2024
    const march25 = new Date(Date.UTC(2024, 2, 25));
    expect(phases.get(march25.toDateString())).toBe('full-moon');
  });

  it('correctly identifies known new moon dates in 2024', () => {
    const phases = getMoonPhases(2024);
    const newMoons = [...phases.entries()].filter(([, v]) => v === 'new-moon');
    expect(newMoons.length).toBeGreaterThanOrEqual(12);
    expect(newMoons.length).toBeLessThanOrEqual(13);

    // Check specific known new moon: April 8, 2024 (solar eclipse)
    const april8 = new Date(Date.UTC(2024, 3, 8));
    expect(phases.get(april8.toDateString())).toBe('new-moon');
  });

  it('works for different years', () => {
    for (const year of [2020, 2025, 2030, 2050]) {
      const phases = getMoonPhases(year);
      expect(phases.size).toBeGreaterThanOrEqual(49);
      expect(phases.size).toBeLessThanOrEqual(53);
    }
  });
});
