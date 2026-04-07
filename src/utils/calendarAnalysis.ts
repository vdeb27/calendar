/**
 * Calendar Analysis Tool v2
 * Analyzes astronomical event alignment with intercalary weeks
 * - Only tests Monday epoch offsets (weeks must start on Monday)
 * - Tests placing leap weeks in different seasons
 */

import {
  getSpringEquinox,
  getSummerSolstice,
  getAutumnEquinox,
  getWinterSolstice,
} from './astronomicalEvents';

// Astronomical event dates from timeanddate.com
const ASTRONOMICAL_EVENTS: Record<number, {
  springEquinox: string;
  summerSolstice: string;
  autumnEquinox: string;
  winterSolstice: string;
}> = {
  2020: { springEquinox: '2020-03-20', summerSolstice: '2020-06-20', autumnEquinox: '2020-09-22', winterSolstice: '2020-12-21' },
  2021: { springEquinox: '2021-03-20', summerSolstice: '2021-06-21', autumnEquinox: '2021-09-22', winterSolstice: '2021-12-21' },
  2022: { springEquinox: '2022-03-20', summerSolstice: '2022-06-21', autumnEquinox: '2022-09-23', winterSolstice: '2022-12-21' },
  2023: { springEquinox: '2023-03-20', summerSolstice: '2023-06-21', autumnEquinox: '2023-09-23', winterSolstice: '2023-12-22' },
  2024: { springEquinox: '2024-03-20', summerSolstice: '2024-06-20', autumnEquinox: '2024-09-22', winterSolstice: '2024-12-21' },
  2025: { springEquinox: '2025-03-20', summerSolstice: '2025-06-21', autumnEquinox: '2025-09-22', winterSolstice: '2025-12-21' },
  2026: { springEquinox: '2026-03-20', summerSolstice: '2026-06-21', autumnEquinox: '2026-09-23', winterSolstice: '2026-12-21' },
  2027: { springEquinox: '2027-03-20', summerSolstice: '2027-06-21', autumnEquinox: '2027-09-23', winterSolstice: '2027-12-22' },
  2028: { springEquinox: '2028-03-20', summerSolstice: '2028-06-20', autumnEquinox: '2028-09-22', winterSolstice: '2028-12-21' },
  2029: { springEquinox: '2029-03-20', summerSolstice: '2029-06-21', autumnEquinox: '2029-09-22', winterSolstice: '2029-12-21' },
  2030: { springEquinox: '2030-03-20', summerSolstice: '2030-06-21', autumnEquinox: '2030-09-23', winterSolstice: '2030-12-21' },
  2031: { springEquinox: '2031-03-20', summerSolstice: '2031-06-21', autumnEquinox: '2031-09-23', winterSolstice: '2031-12-22' },
  2032: { springEquinox: '2032-03-20', summerSolstice: '2032-06-20', autumnEquinox: '2032-09-22', winterSolstice: '2032-12-21' },
  2033: { springEquinox: '2033-03-20', summerSolstice: '2033-06-21', autumnEquinox: '2033-09-22', winterSolstice: '2033-12-21' },
  2034: { springEquinox: '2034-03-20', summerSolstice: '2034-06-21', autumnEquinox: '2034-09-23', winterSolstice: '2034-12-21' },
  2035: { springEquinox: '2035-03-20', summerSolstice: '2035-06-21', autumnEquinox: '2035-09-23', winterSolstice: '2035-12-22' },
};

type Season = 'spring' | 'summer' | 'autumn' | 'winter';

interface LeapWeekConfig {
  year: number;
  season: Season;  // Which season gets the extra intercalary week
}

function parseDate(dateStr: string): Date {
  return new Date(dateStr + 'T12:00:00');
}

function getMondayOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.getFullYear(), d.getMonth(), diff);
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function daysBetween(date1: Date, date2: Date): number {
  const diffMs = date2.getTime() - date1.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function getDayOfWeek(date: Date): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
}

interface OlympianYear {
  year: number;
  startDate: Date;
  endDate: Date;
  totalWeeks: number;
  leapSeason: Season | null;  // Which season has the leap week, if any
  // Intercalary week ranges (start date and number of weeks)
  springIntercalary: { start: Date; weeks: number };
  summerIntercalary: { start: Date; weeks: number };
  autumnIntercalary: { start: Date; weeks: number };
  winterIntercalary: { start: Date; weeks: number };
}

interface EventAlignment {
  event: string;
  eventDate: Date;
  intercalaryStart: Date;
  intercalaryEnd: Date;
  daysFromIntercalary: number;
  isWithinIntercalary: boolean;
  season: Season;
}

/**
 * Build an Olympian year with flexible leap week placement
 */
function buildOlympianYear(year: number, startDate: Date, leapSeason: Season | null): OlympianYear {
  const hasLeapWeek = leapSeason !== null;
  const totalWeeks = hasLeapWeek ? 53 : 52;

  // Calculate intercalary positions
  // Base: Spring ends week 13, Summer ends week 26, Autumn ends week 39, Winter ends week 52
  // If a season has the leap week, it gets 14 weeks instead of 13

  let springWeeks = 13;
  let summerWeeks = 13;
  let autumnWeeks = 13;
  let winterWeeks = 13;

  if (leapSeason === 'spring') springWeeks = 14;
  else if (leapSeason === 'summer') summerWeeks = 14;
  else if (leapSeason === 'autumn') autumnWeeks = 14;
  else if (leapSeason === 'winter') winterWeeks = 14;

  // Calculate season boundaries
  const springEnd = springWeeks;
  const summerEnd = springEnd + summerWeeks;
  const autumnEnd = summerEnd + autumnWeeks;
  const winterEnd = autumnEnd + winterWeeks;

  // Intercalary weeks are the LAST week(s) of each season
  // Spring intercalary: week(s) ending at springEnd
  // For regular seasons: 1 week; for leap season: 2 weeks
  const springIntercalaryWeeks = leapSeason === 'spring' ? 2 : 1;
  const summerIntercalaryWeeks = leapSeason === 'summer' ? 2 : 1;
  const autumnIntercalaryWeeks = leapSeason === 'autumn' ? 2 : 1;
  const winterIntercalaryWeeks = leapSeason === 'winter' ? 2 : 1;

  const springIntercalaryStart = addDays(startDate, (springEnd - springIntercalaryWeeks) * 7);
  const summerIntercalaryStart = addDays(startDate, (summerEnd - summerIntercalaryWeeks) * 7);
  const autumnIntercalaryStart = addDays(startDate, (autumnEnd - autumnIntercalaryWeeks) * 7);
  const winterIntercalaryStart = addDays(startDate, (winterEnd - winterIntercalaryWeeks) * 7);

  return {
    year,
    startDate,
    endDate: addDays(startDate, totalWeeks * 7),
    totalWeeks,
    leapSeason,
    springIntercalary: { start: springIntercalaryStart, weeks: springIntercalaryWeeks },
    summerIntercalary: { start: summerIntercalaryStart, weeks: summerIntercalaryWeeks },
    autumnIntercalary: { start: autumnIntercalaryStart, weeks: autumnIntercalaryWeeks },
    winterIntercalary: { start: winterIntercalaryStart, weeks: winterIntercalaryWeeks },
  };
}

/**
 * Check if an event falls within an intercalary period
 */
function checkAlignment(
  eventDate: Date,
  intercalaryStart: Date,
  intercalaryWeeks: number
): { daysFromIntercalary: number; isWithin: boolean } {
  const intercalaryEnd = addDays(intercalaryStart, intercalaryWeeks * 7 - 1);

  if (eventDate >= intercalaryStart && eventDate <= intercalaryEnd) {
    return { daysFromIntercalary: 0, isWithin: true };
  }

  if (eventDate < intercalaryStart) {
    const days = daysBetween(eventDate, intercalaryStart);
    return { daysFromIntercalary: -days, isWithin: false };
  } else {
    const days = daysBetween(intercalaryEnd, eventDate);
    return { daysFromIntercalary: days, isWithin: false };
  }
}

/**
 * Simulate calendar with specific leap week configurations
 */
function simulateCalendar(
  startYear: number,
  endYear: number,
  epochStartDate: Date,
  leapConfigs: LeapWeekConfig[]
): { years: OlympianYear[]; alignments: EventAlignment[] } {
  const years: OlympianYear[] = [];
  const alignments: EventAlignment[] = [];

  const leapMap = new Map<number, Season>();
  for (const config of leapConfigs) {
    leapMap.set(config.year, config.season);
  }

  let currentStart = epochStartDate;

  for (let year = startYear; year <= endYear; year++) {
    const leapSeason = leapMap.get(year) || null;
    const olympianYear = buildOlympianYear(year, currentStart, leapSeason);
    years.push(olympianYear);

    const tradYear = year;
    const events = ASTRONOMICAL_EVENTS[tradYear];
    const nextEvents = ASTRONOMICAL_EVENTS[tradYear + 1];

    if (events) {
      // Summer Solstice -> Spring intercalary
      const summerSolstice = parseDate(events.summerSolstice);
      const summerAlign = checkAlignment(
        summerSolstice,
        olympianYear.springIntercalary.start,
        olympianYear.springIntercalary.weeks
      );
      alignments.push({
        event: `Summer Solstice ${tradYear}`,
        eventDate: summerSolstice,
        intercalaryStart: olympianYear.springIntercalary.start,
        intercalaryEnd: addDays(olympianYear.springIntercalary.start, olympianYear.springIntercalary.weeks * 7 - 1),
        daysFromIntercalary: summerAlign.daysFromIntercalary,
        isWithinIntercalary: summerAlign.isWithin,
        season: 'spring',
      });

      // Autumn Equinox -> Summer intercalary
      const autumnEquinox = parseDate(events.autumnEquinox);
      const autumnAlign = checkAlignment(
        autumnEquinox,
        olympianYear.summerIntercalary.start,
        olympianYear.summerIntercalary.weeks
      );
      alignments.push({
        event: `Autumn Equinox ${tradYear}`,
        eventDate: autumnEquinox,
        intercalaryStart: olympianYear.summerIntercalary.start,
        intercalaryEnd: addDays(olympianYear.summerIntercalary.start, olympianYear.summerIntercalary.weeks * 7 - 1),
        daysFromIntercalary: autumnAlign.daysFromIntercalary,
        isWithinIntercalary: autumnAlign.isWithin,
        season: 'summer',
      });

      // Winter Solstice -> Autumn intercalary
      const winterSolstice = parseDate(events.winterSolstice);
      const winterAlign = checkAlignment(
        winterSolstice,
        olympianYear.autumnIntercalary.start,
        olympianYear.autumnIntercalary.weeks
      );
      alignments.push({
        event: `Winter Solstice ${tradYear}`,
        eventDate: winterSolstice,
        intercalaryStart: olympianYear.autumnIntercalary.start,
        intercalaryEnd: addDays(olympianYear.autumnIntercalary.start, olympianYear.autumnIntercalary.weeks * 7 - 1),
        daysFromIntercalary: winterAlign.daysFromIntercalary,
        isWithinIntercalary: winterAlign.isWithin,
        season: 'autumn',
      });
    }

    if (nextEvents) {
      // Spring Equinox (next year) -> Winter intercalary
      const springEquinox = parseDate(nextEvents.springEquinox);
      const springAlign = checkAlignment(
        springEquinox,
        olympianYear.winterIntercalary.start,
        olympianYear.winterIntercalary.weeks
      );
      alignments.push({
        event: `Spring Equinox ${tradYear + 1}`,
        eventDate: springEquinox,
        intercalaryStart: olympianYear.winterIntercalary.start,
        intercalaryEnd: addDays(olympianYear.winterIntercalary.start, olympianYear.winterIntercalary.weeks * 7 - 1),
        daysFromIntercalary: springAlign.daysFromIntercalary,
        isWithinIntercalary: springAlign.isWithin,
        season: 'winter',
      });
    }

    currentStart = olympianYear.endDate;
  }

  return { years, alignments };
}

/**
 * Calculate the standard Monday start (Monday after week containing spring equinox)
 */
function getStandardYearStart(year: number): Date {
  const events = ASTRONOMICAL_EVENTS[year];
  if (!events) throw new Error(`No data for year ${year}`);

  const equinox = parseDate(events.springEquinox);
  const mondayOfEquinoxWeek = getMondayOfWeek(equinox);

  return addDays(mondayOfEquinoxWeek, 7);
}

/**
 * Score alignments
 */
function scoreAlignments(alignments: EventAlignment[]): {
  withinIntercalary: number;
  totalEvents: number;
  totalDrift: number;
} {
  let withinIntercalary = 0;
  let totalDrift = 0;

  for (const alignment of alignments) {
    if (alignment.isWithinIntercalary) withinIntercalary++;
    totalDrift += Math.abs(alignment.daysFromIntercalary);
  }

  return {
    withinIntercalary,
    totalEvents: alignments.length,
    totalDrift,
  };
}

/**
 * Determine which years need leap weeks based on drift from target start dates
 */
function calculateRequiredLeapYears(
  startYear: number,
  endYear: number,
  epochStart: Date
): number[] {
  const leapYears: number[] = [];
  let currentStart = epochStart;

  for (let year = startYear; year < endYear; year++) {
    const nextYearData = ASTRONOMICAL_EVENTS[year + 1];
    if (!nextYearData) break;

    // Where would next year start with 52 weeks?
    const endWith52 = addDays(currentStart, 52 * 7);

    // Where should next year ideally start? (Monday after next equinox)
    const targetStart = getStandardYearStart(year + 1);

    // If 52-week year ends more than 3 days before target, we need a leap week
    const drift = daysBetween(endWith52, targetStart);

    if (drift > 3) {
      leapYears.push(year);
      currentStart = addDays(currentStart, 53 * 7);
    } else {
      currentStart = addDays(currentStart, 52 * 7);
    }
  }

  return leapYears;
}

/**
 * Find optimal season placement for leap weeks
 */
function findOptimalSeasonPlacements(
  startYear: number,
  endYear: number,
  epochStart: Date,
  leapYears: number[]
): { configs: LeapWeekConfig[]; score: ReturnType<typeof scoreAlignments> } {
  const seasons: Season[] = ['spring', 'summer', 'autumn', 'winter'];

  // Generate all combinations of season placements for leap years
  function* generateCombinations(index: number, current: LeapWeekConfig[]): Generator<LeapWeekConfig[]> {
    if (index >= leapYears.length) {
      yield [...current];
      return;
    }

    for (const season of seasons) {
      current.push({ year: leapYears[index], season });
      yield* generateCombinations(index + 1, current);
      current.pop();
    }
  }

  let bestConfigs: LeapWeekConfig[] = [];
  let bestScore = { withinIntercalary: -1, totalEvents: 0, totalDrift: Infinity };

  for (const configs of generateCombinations(0, [])) {
    const { alignments } = simulateCalendar(startYear, endYear, epochStart, configs);
    const score = scoreAlignments(alignments);

    if (score.withinIntercalary > bestScore.withinIntercalary ||
        (score.withinIntercalary === bestScore.withinIntercalary && score.totalDrift < bestScore.totalDrift)) {
      bestScore = score;
      bestConfigs = [...configs];
    }
  }

  return { configs: bestConfigs, score: bestScore };
}

// ============ MAIN ANALYSIS ============

export function runAnalysis() {
  console.log('='.repeat(80));
  console.log('OLYMPIAN CALENDAR ASTRONOMICAL EVENT ALIGNMENT ANALYSIS v2');
  console.log('='.repeat(80));
  console.log();
  console.log('Constraints:');
  console.log('  - Epoch must start on a Monday');
  console.log('  - Leap weeks can be placed in any season');
  console.log();

  const START_YEAR = 2020;
  const END_YEAR = 2034;

  const standardStart = getStandardYearStart(START_YEAR);
  console.log(`Standard epoch: ${formatDate(standardStart)} (${getDayOfWeek(standardStart)})`);
  console.log();

  // Test Monday offsets only: -14, -7, 0, +7, +14 days
  const mondayOffsets = [-14, -7, 0, 7, 14];

  interface EpochResult {
    offsetWeeks: number;
    epochStart: Date;
    leapYears: number[];
    leapConfigs: LeapWeekConfig[];
    score: ReturnType<typeof scoreAlignments>;
    alignments: EventAlignment[];
  }

  const results: EpochResult[] = [];

  console.log('Testing Monday epoch offsets with optimized leap week placements:');
  console.log('-'.repeat(60));
  console.log();

  for (const offsetDays of mondayOffsets) {
    const epochStart = addDays(standardStart, offsetDays);
    const offsetWeeks = offsetDays / 7;

    console.log(`Offset: ${offsetWeeks >= 0 ? '+' : ''}${offsetWeeks} weeks (${formatDate(epochStart)}, ${getDayOfWeek(epochStart)})`);

    // Calculate which years need leap weeks for this epoch
    const leapYears = calculateRequiredLeapYears(START_YEAR, END_YEAR, epochStart);
    console.log(`  Required leap years: [${leapYears.join(', ')}]`);

    // Find optimal season placements for the leap weeks
    const { configs, score } = findOptimalSeasonPlacements(START_YEAR, END_YEAR, epochStart, leapYears);

    const configStr = configs.map(c => `${c.year}:${c.season}`).join(', ');
    console.log(`  Optimal placements: [${configStr}]`);
    console.log(`  Score: ${score.withinIntercalary}/${score.totalEvents} in intercalary, ${score.totalDrift} drift`);
    console.log();

    const { alignments } = simulateCalendar(START_YEAR, END_YEAR, epochStart, configs);
    results.push({
      offsetWeeks,
      epochStart,
      leapYears,
      leapConfigs: configs,
      score,
      alignments,
    });
  }

  // Sort by best score
  results.sort((a, b) => {
    if (a.score.withinIntercalary !== b.score.withinIntercalary) {
      return b.score.withinIntercalary - a.score.withinIntercalary;
    }
    return a.score.totalDrift - b.score.totalDrift;
  });

  const best = results[0];

  console.log('='.repeat(80));
  console.log('BEST CONFIGURATION');
  console.log('='.repeat(80));
  console.log();
  console.log(`Epoch start: ${formatDate(best.epochStart)} (${getDayOfWeek(best.epochStart)})`);
  console.log(`Offset from standard: ${best.offsetWeeks >= 0 ? '+' : ''}${best.offsetWeeks} weeks`);
  console.log(`Leap years: [${best.leapYears.join(', ')}]`);
  console.log(`Leap week placements: [${best.leapConfigs.map(c => `${c.year}:${c.season}`).join(', ')}]`);
  console.log();

  // Show year structure
  console.log('Year Structure:');
  const { years } = simulateCalendar(START_YEAR, END_YEAR, best.epochStart, best.leapConfigs);
  for (const year of years) {
    const leapInfo = year.leapSeason ? ` [LEAP in ${year.leapSeason}]` : '';
    console.log(`  ${year.year}: ${formatDate(year.startDate)} - ${formatDate(addDays(year.endDate, -1))} (${year.totalWeeks} weeks)${leapInfo}`);
  }
  console.log();

  // Show all alignments
  console.log('Event Alignments:');
  console.log();
  for (const alignment of best.alignments) {
    const status = alignment.isWithinIntercalary ? '✓ IN  ' : '✗ OUT ';
    const drift = alignment.daysFromIntercalary === 0 ? '' :
                  `(${alignment.daysFromIntercalary > 0 ? '+' : ''}${alignment.daysFromIntercalary} days)`;
    console.log(`  ${status} ${alignment.event.padEnd(22)} ${formatDate(alignment.eventDate)} | ${alignment.season.padEnd(6)} intercalary: ${formatDate(alignment.intercalaryStart)}-${formatDate(alignment.intercalaryEnd)} ${drift}`);
  }
  console.log();
  console.log(`Final Score: ${best.score.withinIntercalary}/${best.score.totalEvents} within intercalary (${Math.round(100 * best.score.withinIntercalary / best.score.totalEvents)}%)`);
  console.log(`Total drift: ${best.score.totalDrift} days`);

  // Compare all epoch options
  console.log();
  console.log('='.repeat(80));
  console.log('ALL EPOCH OPTIONS COMPARISON');
  console.log('='.repeat(80));
  console.log();
  for (const r of results) {
    const pct = Math.round(100 * r.score.withinIntercalary / r.score.totalEvents);
    console.log(`Offset ${r.offsetWeeks >= 0 ? '+' : ''}${r.offsetWeeks} weeks: ${r.score.withinIntercalary}/${r.score.totalEvents} (${pct}%) in intercalary, ${r.score.totalDrift} drift`);
  }

  return {
    best,
    allResults: results,
  };
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
  // When a season has a leap week, both intercalary weeks start at the same position
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
 * Uses Dynamic Programming to find the optimal placement of exactly 71 leap weeks
 * across 400 years to maximize astronomical event alignment with intercalary weeks.
 *
 * The algorithm:
 * 1. Pre-computes all 1600 astronomical events (4 per year × 400 years)
 * 2. Uses DP with state (year, cumulative_leaps) to find optimal placement
 * 3. For each leap year, tries all 4 seasons to find best alignment
 * 4. Reconstructs the optimal solution via backtracking
 *
 * Complexity: O(400 × 72 × 8 × 4) ≈ O(1M) operations, runs in < 1 second
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
  // Backpointer: for each state (year, leaps), store which previous state and decision led here
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

// Run if executed directly
declare const process: { argv: string[] } | undefined;
if (typeof process !== 'undefined' && process.argv[1]?.includes('calendarAnalysis')) {
  runAnalysis();
}
