import { describe, it, expect } from 'vitest';
import { getSchoolHolidays } from './schoolHolidays';

describe('getSchoolHolidays', () => {
  it('returns a non-empty map for a year with data', () => {
    const holidays = getSchoolHolidays(2026, 'midden');
    expect(holidays.size).toBeGreaterThan(0);
  });

  it('returns an empty map for a year without data', () => {
    const holidays = getSchoolHolidays(2050, 'midden');
    expect(holidays.size).toBe(0);
  });

  it('identifies kerstvakantie 2025 for all regions', () => {
    // Kerstvakantie 2025-2026: 2025-12-20 to 2026-01-04 (heel Nederland)
    const dec25 = new Date(2025, 11, 25); // Christmas day
    for (const region of ['noord', 'midden', 'zuid'] as const) {
      const holidays = getSchoolHolidays(2025, region);
      expect(holidays.get(dec25.toDateString())).toBe('kerstvakantie');
    }
  });

  it('differentiates regions for herfstvakantie 2026', () => {
    // 2026-2027: Noord 2026-10-10 to 2026-10-18; Midden+Zuid 2026-10-17 to 2026-10-25
    const oct12 = new Date(2026, 9, 12); // Only in Noord
    const oct20 = new Date(2026, 9, 20); // Only in Midden+Zuid

    const noord = getSchoolHolidays(2026, 'noord');
    const midden = getSchoolHolidays(2026, 'midden');

    expect(noord.get(oct12.toDateString())).toBe('herfstvakantie');
    expect(midden.has(oct12.toDateString())).toBe(false);

    expect(midden.get(oct20.toDateString())).toBe('herfstvakantie');
    expect(noord.has(oct20.toDateString())).toBe(false);
  });

  it('includes zomervakantie days', () => {
    // Zomervakantie 2026 Midden: 2026-07-18 to 2026-08-30
    const aug1 = new Date(2026, 7, 1);
    const holidays = getSchoolHolidays(2026, 'midden');
    expect(holidays.get(aug1.toDateString())).toBe('zomervakantie');
  });

  it('skips the leading Saturday and Sunday when holiday starts on Saturday', () => {
    // Kerstvakantie 2025-2026: starts 2025-12-20 (Saturday)
    const sat = new Date(2025, 11, 20);
    const sun = new Date(2025, 11, 21);
    const mon = new Date(2025, 11, 22);
    expect(sat.getDay()).toBe(6); // verify it's Saturday
    const holidays = getSchoolHolidays(2025, 'midden');
    expect(holidays.has(sat.toDateString())).toBe(false);
    expect(holidays.has(sun.toDateString())).toBe(false);
    expect(holidays.get(mon.toDateString())).toBe('kerstvakantie');
  });

  it('handles holidays spanning year boundaries', () => {
    // Kerstvakantie 2025-2026: 2025-12-20 to 2026-01-04
    const jan2 = new Date(2026, 0, 2);
    const holidays = getSchoolHolidays(2026, 'midden');
    expect(holidays.get(jan2.toDateString())).toBe('kerstvakantie');
  });
});
