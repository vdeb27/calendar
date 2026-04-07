import { describe, it, expect } from 'vitest';
import {
  getSpringEquinox,
  getSummerSolstice,
  getAutumnEquinox,
  getWinterSolstice,
  getSolsticesAndEquinoxes,
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
