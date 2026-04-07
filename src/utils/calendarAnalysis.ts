/**
 * Calendar Analysis — Perpetual 400-year leap week pattern
 *
 * Uses Dynamic Programming to find the optimal placement of exactly 71 leap weeks
 * across 400 years to maximize astronomical event alignment with intercalary weeks.
 */

import {
  getSpringEquinox,
  getSummerSolstice,
  getAutumnEquinox,
  getWinterSolstice,
} from './astronomicalEvents';

type Season = 'spring' | 'summer' | 'autumn' | 'winter';

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Helper function to compute alignment score for a single year
 */
function computeYearScore(
  yearOffset: number,
  cumulativeLeapsBefore: number,
  hasLeap: boolean,
  season: Season | null,
  events: Date[][],
  epochStart: Date
): number {
  // Calculate year start
  const yearStart = addDays(epochStart, (yearOffset * 52 + cumulativeLeapsBefore) * 7);

  // Calculate intercalary week positions
  const springWeeks = (hasLeap && season === 'spring') ? 14 : 13;
  const summerWeeks = (hasLeap && season === 'summer') ? 14 : 13;
  const autumnWeeks = (hasLeap && season === 'autumn') ? 14 : 13;
  const winterWeeks = (hasLeap && season === 'winter') ? 14 : 13;

  // Intercalary weeks are the LAST week(s) of each season
  const springIntercalaryWeeks = (hasLeap && season === 'spring') ? 2 : 1;
  const summerIntercalaryWeeks = (hasLeap && season === 'summer') ? 2 : 1;
  const autumnIntercalaryWeeks = (hasLeap && season === 'autumn') ? 2 : 1;
  const winterIntercalaryWeeks = (hasLeap && season === 'winter') ? 2 : 1;

  const intercalaries = [
    { start: addDays(yearStart, (springWeeks - springIntercalaryWeeks) * 7), weeks: springIntercalaryWeeks },
    { start: addDays(yearStart, (springWeeks + summerWeeks - summerIntercalaryWeeks) * 7), weeks: summerIntercalaryWeeks },
    { start: addDays(yearStart, (springWeeks + summerWeeks + autumnWeeks - autumnIntercalaryWeeks) * 7), weeks: autumnIntercalaryWeeks },
    { start: addDays(yearStart, (springWeeks + summerWeeks + autumnWeeks + winterWeeks - winterIntercalaryWeeks) * 7), weeks: winterIntercalaryWeeks },
  ];

  // Count events within intercalary weeks
  let score = 0;
  for (let i = 0; i < 4; i++) {
    const eventDate = events[yearOffset][i];
    const intercalaryEnd = addDays(intercalaries[i].start, intercalaries[i].weeks * 7 - 1);
    if (eventDate >= intercalaries[i].start && eventDate <= intercalaryEnd) {
      score++;
    }
  }

  return score;
}

/**
 * Compute the 400-year perpetual pattern for leap weeks
 *
 * The algorithm:
 * 1. Pre-computes all 1600 astronomical events (4 per year x 400 years)
 * 2. Uses DP with state (year, cumulative_leaps) to find optimal placement
 * 3. For each leap year, tries all 4 seasons to find best alignment
 * 4. Reconstructs the optimal solution via backtracking
 *
 * Complexity: O(400 x 72 x 8 x 4) ~ O(1M) operations, runs in < 1 second
 */
export function computePerpetual400YearPattern(): Array<{ yearOffset: number; season: Season }> {
  const EPOCH_YEAR = 2020;
  const EPOCH_START = new Date(2020, 2, 30); // March 30, 2020 (Monday)
  const TOTAL_YEARS = 400;
  const REQUIRED_LEAPS = 71;

  // Pre-compute all astronomical events (1600 total)
  const events: Date[][] = []; // events[year][0-3] = summer, autumn, winter, spring(+1)
  for (let y = 0; y < TOTAL_YEARS; y++) {
    const year = EPOCH_YEAR + y;
    events[y] = [
      getSummerSolstice(year),
      getAutumnEquinox(year),
      getWinterSolstice(year),
      getSpringEquinox(year + 1),
    ];
  }

  // DP arrays
  const dp: number[][] = Array.from({ length: TOTAL_YEARS + 1 }, () =>
    Array(REQUIRED_LEAPS + 1).fill(-Infinity)
  );
  const backpointer: Array<Array<{ fromLeaps: number; hasLeap: boolean; season?: Season } | null>> =
    Array.from({ length: TOTAL_YEARS + 1 }, () => Array(REQUIRED_LEAPS + 1).fill(null));

  dp[0][0] = 0; // Base case

  // Fill DP table
  for (let year = 0; year < TOTAL_YEARS; year++) {
    for (let leaps = 0; leaps <= REQUIRED_LEAPS; leaps++) {
      if (dp[year][leaps] === -Infinity) continue;

      // Option 1: No leap week this year
      const scoreNoLeap = computeYearScore(year, leaps, false, null, events, EPOCH_START);
      if (dp[year][leaps] + scoreNoLeap > dp[year + 1][leaps]) {
        dp[year + 1][leaps] = dp[year][leaps] + scoreNoLeap;
        backpointer[year + 1][leaps] = { fromLeaps: leaps, hasLeap: false };
      }

      // Option 2: Leap week this year (try all 4 seasons)
      if (leaps < REQUIRED_LEAPS) {
        let bestSeason: Season = 'spring';
        let bestScore = -1;
        for (const season of ['spring', 'summer', 'autumn', 'winter'] as Season[]) {
          const score = computeYearScore(year, leaps, true, season, events, EPOCH_START);
          if (score > bestScore) {
            bestScore = score;
            bestSeason = season;
          }
        }
        if (dp[year][leaps] + bestScore > dp[year + 1][leaps + 1]) {
          dp[year + 1][leaps + 1] = dp[year][leaps] + bestScore;
          backpointer[year + 1][leaps + 1] = { fromLeaps: leaps, hasLeap: true, season: bestSeason };
        }
      }
    }
  }

  // Reconstruct solution by backtracking from final state
  const result: Array<{ yearOffset: number; season: Season }> = [];
  let currentYear = TOTAL_YEARS;
  let currentLeaps = REQUIRED_LEAPS;

  while (currentYear > 0) {
    const bp = backpointer[currentYear][currentLeaps];
    if (!bp) {
      throw new Error(`No backpointer at (${currentYear}, ${currentLeaps})`);
    }

    if (bp.hasLeap) {
      result.unshift({ yearOffset: currentYear - 1, season: bp.season! });
    }

    currentLeaps = bp.fromLeaps;
    currentYear--;
  }

  return result;
}
