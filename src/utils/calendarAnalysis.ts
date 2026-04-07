/**
 * Calendar Analysis — Perpetual 400-year leap week pattern
 *
 * Uses Dynamic Programming to find the optimal placement of exactly 71 leap weeks
 * across 400 years to maximize astronomical event alignment with intercalary weeks.
 *
 * Scoring:
 *   Primary: maximize events falling within their Vreugde (intercalary) week
 *   Secondary (tiebreaker): minimize total drift (days from nearest Vreugde boundary)
 *
 * All date arithmetic uses UTC to avoid timezone boundary issues with astronomical events.
 */

import {
  getSpringEquinox,
  getSummerSolstice,
  getAutumnEquinox,
  getWinterSolstice,
} from './astronomicalEvents';

type Season = 'spring' | 'summer' | 'autumn' | 'winter';

function addDaysUTC(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

function daysBetweenUTC(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / (24 * 60 * 60 * 1000));
}

// Score encoding: primary * DRIFT_WEIGHT + driftPenalty
// Primary always dominates because max drift per event < 100 days, max 4 events,
// so max total drift < 400, well under DRIFT_WEIGHT.
const DRIFT_WEIGHT = 10000;

interface YearScore {
  hits: number;       // events within intercalary weeks
  totalDrift: number; // sum of |days from nearest intercalary boundary| for misses
  combined: number;   // hits * DRIFT_WEIGHT - totalDrift (for DP comparison)
}

/**
 * Compute alignment score for a single year.
 *
 * Event mapping (each event falls at the END of its preceding season):
 *   events[0] = Summer Solstice  → intercalaries[0] = Springjoy  (end of Spring)
 *   events[1] = Autumn Equinox   → intercalaries[1] = Summerjoy  (end of Summer)
 *   events[2] = Winter Solstice  → intercalaries[2] = Autumnjoy  (end of Autumn)
 *   events[3] = Spring Equinox+1 → intercalaries[3] = Winterjoy  (end of Winter)
 */
function computeYearScore(
  yearOffset: number,
  cumulativeLeapsBefore: number,
  hasLeap: boolean,
  season: Season | null,
  events: Date[][],
  epochStart: Date
): YearScore {
  const yearStart = addDaysUTC(epochStart, (yearOffset * 52 + cumulativeLeapsBefore) * 7);

  const springWeeks = (hasLeap && season === 'spring') ? 14 : 13;
  const summerWeeks = (hasLeap && season === 'summer') ? 14 : 13;
  const autumnWeeks = (hasLeap && season === 'autumn') ? 14 : 13;
  const winterWeeks = (hasLeap && season === 'winter') ? 14 : 13;

  const springIntercalaryWeeks = (hasLeap && season === 'spring') ? 2 : 1;
  const summerIntercalaryWeeks = (hasLeap && season === 'summer') ? 2 : 1;
  const autumnIntercalaryWeeks = (hasLeap && season === 'autumn') ? 2 : 1;
  const winterIntercalaryWeeks = (hasLeap && season === 'winter') ? 2 : 1;

  const intercalaries = [
    { start: addDaysUTC(yearStart, (springWeeks - springIntercalaryWeeks) * 7), weeks: springIntercalaryWeeks },
    { start: addDaysUTC(yearStart, (springWeeks + summerWeeks - summerIntercalaryWeeks) * 7), weeks: summerIntercalaryWeeks },
    { start: addDaysUTC(yearStart, (springWeeks + summerWeeks + autumnWeeks - autumnIntercalaryWeeks) * 7), weeks: autumnIntercalaryWeeks },
    { start: addDaysUTC(yearStart, (springWeeks + summerWeeks + autumnWeeks + winterWeeks - winterIntercalaryWeeks) * 7), weeks: winterIntercalaryWeeks },
  ];

  let hits = 0;
  let totalDrift = 0;

  for (let i = 0; i < 4; i++) {
    const eventDate = events[yearOffset][i];
    const intercalaryStart = intercalaries[i].start;
    const intercalaryEnd = addDaysUTC(intercalaryStart, intercalaries[i].weeks * 7 - 1);

    if (eventDate >= intercalaryStart && eventDate <= intercalaryEnd) {
      hits++;
    } else {
      // Compute drift: minimum distance to intercalary boundary
      const daysBeforeStart = daysBetweenUTC(eventDate, intercalaryStart);
      const daysAfterEnd = daysBetweenUTC(intercalaryEnd, eventDate);
      totalDrift += Math.min(Math.abs(daysBeforeStart), Math.abs(daysAfterEnd));
    }
  }

  return {
    hits,
    totalDrift,
    combined: hits * DRIFT_WEIGHT - totalDrift,
  };
}

/**
 * Compute the 400-year perpetual pattern for leap weeks.
 *
 * The algorithm:
 * 1. Pre-computes all 1600 astronomical events (4 per year x 400 years) in UTC
 * 2. Uses DP with state (year, cumulative_leaps) to find optimal placement
 * 3. For each leap year, tries all 4 seasons to find best alignment
 * 4. Uses drift as tiebreaker when primary score (hits) is equal
 * 5. Reconstructs the optimal solution via backtracking
 */
export function computePerpetual400YearPattern(): Array<{ yearOffset: number; season: Season }> {
  const EPOCH_YEAR = 2020;
  const EPOCH_START = new Date(Date.UTC(2020, 2, 30)); // March 30, 2020 (Monday) UTC
  const TOTAL_YEARS = 400;
  const REQUIRED_LEAPS = 71;

  // Pre-compute all astronomical events in UTC (1600 total)
  const events: Date[][] = [];
  for (let y = 0; y < TOTAL_YEARS; y++) {
    const year = EPOCH_YEAR + y;
    events[y] = [
      getSummerSolstice(year),       // → Springjoy (end of spring)
      getAutumnEquinox(year),        // → Summerjoy (end of summer)
      getWinterSolstice(year),       // → Autumnjoy (end of autumn)
      getSpringEquinox(year + 1),    // → Winterjoy (end of winter)
    ];
  }

  // DP: dp[year][leaps] = best combined score (hits * DRIFT_WEIGHT - drift)
  const dp: number[][] = Array.from({ length: TOTAL_YEARS + 1 }, () =>
    Array(REQUIRED_LEAPS + 1).fill(-Infinity)
  );
  const backpointer: Array<Array<{ fromLeaps: number; hasLeap: boolean; season?: Season } | null>> =
    Array.from({ length: TOTAL_YEARS + 1 }, () => Array(REQUIRED_LEAPS + 1).fill(null));

  dp[0][0] = 0;

  for (let year = 0; year < TOTAL_YEARS; year++) {
    for (let leaps = 0; leaps <= REQUIRED_LEAPS; leaps++) {
      if (dp[year][leaps] === -Infinity) continue;

      // Option 1: No leap week this year
      const noLeapScore = computeYearScore(year, leaps, false, null, events, EPOCH_START);
      const noLeapTotal = dp[year][leaps] + noLeapScore.combined;
      if (noLeapTotal > dp[year + 1][leaps]) {
        dp[year + 1][leaps] = noLeapTotal;
        backpointer[year + 1][leaps] = { fromLeaps: leaps, hasLeap: false };
      }

      // Option 2: Leap week this year (try all 4 seasons, pick best)
      if (leaps < REQUIRED_LEAPS) {
        let bestSeason: Season = 'spring';
        let bestCombined = -Infinity;
        for (const season of ['spring', 'summer', 'autumn', 'winter'] as Season[]) {
          const score = computeYearScore(year, leaps, true, season, events, EPOCH_START);
          if (score.combined > bestCombined) {
            bestCombined = score.combined;
            bestSeason = season;
          }
        }
        const leapTotal = dp[year][leaps] + bestCombined;
        if (leapTotal > dp[year + 1][leaps + 1]) {
          dp[year + 1][leaps + 1] = leapTotal;
          backpointer[year + 1][leaps + 1] = { fromLeaps: leaps, hasLeap: true, season: bestSeason };
        }
      }
    }
  }

  // Reconstruct solution
  const result: Array<{ yearOffset: number; season: Season }> = [];
  let currentYear = TOTAL_YEARS;
  let currentLeaps = REQUIRED_LEAPS;

  while (currentYear > 0) {
    const bp = backpointer[currentYear][currentLeaps];
    if (!bp) {
      throw new Error(`No backpointer at (${currentYear}, ${currentLeaps}) — pattern is infeasible`);
    }

    if (bp.hasLeap) {
      result.unshift({ yearOffset: currentYear - 1, season: bp.season! });
    }

    currentLeaps = bp.fromLeaps;
    currentYear--;
  }

  return result;
}

/**
 * Independently verify a pattern's score by building the full 400-year calendar.
 * Returns detailed alignment statistics.
 */
export function verifyPattern(
  pattern: Array<{ yearOffset: number; season: Season }>
): {
  totalHits: number;
  totalEvents: number;
  totalDrift: number;
  percentage: number;
  perYear: Array<{ year: number; hits: number; drift: number; details: string[] }>;
} {
  const EPOCH_YEAR = 2020;
  const EPOCH_START = new Date(Date.UTC(2020, 2, 30));
  const TOTAL_YEARS = 400;

  const leapMap = new Map<number, Season>();
  for (const entry of pattern) {
    leapMap.set(entry.yearOffset, entry.season);
  }

  const eventNames = ['Summer Solstice', 'Autumn Equinox', 'Winter Solstice', 'Spring Equinox+1'];
  const intercalaryNames = ['Springjoy', 'Summerjoy', 'Autumnjoy', 'Winterjoy'];

  let totalHits = 0;
  let totalDrift = 0;
  let cumulativeLeaps = 0;
  const perYear: Array<{ year: number; hits: number; drift: number; details: string[] }> = [];

  for (let y = 0; y < TOTAL_YEARS; y++) {
    const year = EPOCH_YEAR + y;
    const leapSeason = leapMap.get(y) || null;
    const hasLeap = leapSeason !== null;

    const events = [
      getSummerSolstice(year),
      getAutumnEquinox(year),
      getWinterSolstice(year),
      getSpringEquinox(year + 1),
    ];

    const yearStart = addDaysUTC(EPOCH_START, (y * 52 + cumulativeLeaps) * 7);

    const springWeeks = (hasLeap && leapSeason === 'spring') ? 14 : 13;
    const summerWeeks = (hasLeap && leapSeason === 'summer') ? 14 : 13;
    const autumnWeeks = (hasLeap && leapSeason === 'autumn') ? 14 : 13;
    const winterWeeks = (hasLeap && leapSeason === 'winter') ? 14 : 13;

    const springIW = (hasLeap && leapSeason === 'spring') ? 2 : 1;
    const summerIW = (hasLeap && leapSeason === 'summer') ? 2 : 1;
    const autumnIW = (hasLeap && leapSeason === 'autumn') ? 2 : 1;
    const winterIW = (hasLeap && leapSeason === 'winter') ? 2 : 1;

    const intercalaries = [
      { start: addDaysUTC(yearStart, (springWeeks - springIW) * 7), weeks: springIW },
      { start: addDaysUTC(yearStart, (springWeeks + summerWeeks - summerIW) * 7), weeks: summerIW },
      { start: addDaysUTC(yearStart, (springWeeks + summerWeeks + autumnWeeks - autumnIW) * 7), weeks: autumnIW },
      { start: addDaysUTC(yearStart, (springWeeks + summerWeeks + autumnWeeks + winterWeeks - winterIW) * 7), weeks: winterIW },
    ];

    let yearHits = 0;
    let yearDrift = 0;
    const details: string[] = [];

    for (let i = 0; i < 4; i++) {
      const eventDate = events[i];
      const iStart = intercalaries[i].start;
      const iEnd = addDaysUTC(iStart, intercalaries[i].weeks * 7 - 1);

      if (eventDate >= iStart && eventDate <= iEnd) {
        yearHits++;
        details.push(`  HIT  ${eventNames[i]} → ${intercalaryNames[i]}`);
      } else {
        const dBefore = Math.abs(daysBetweenUTC(eventDate, iStart));
        const dAfter = Math.abs(daysBetweenUTC(iEnd, eventDate));
        const drift = Math.min(dBefore, dAfter);
        yearDrift += drift;
        details.push(`  MISS ${eventNames[i]} → ${intercalaryNames[i]} (${drift} days off)`);
      }
    }

    totalHits += yearHits;
    totalDrift += yearDrift;
    perYear.push({ year, hits: yearHits, drift: yearDrift, details });

    if (hasLeap) cumulativeLeaps++;
  }

  return {
    totalHits,
    totalEvents: TOTAL_YEARS * 4,
    totalDrift,
    percentage: Math.round((totalHits / (TOTAL_YEARS * 4)) * 10000) / 100,
    perYear,
  };
}
