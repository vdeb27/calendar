import { CustomYear, Season, Period, Week, Day, SeasonName, AstronomicalEvent } from '../types/calendar';
import { getCustomYearStart, addDays, addWeeks, customYearNeedsLeapWeek, getLeapSeason, LeapSeason } from './dateUtils';
import { getSolsticesAndEquinoxes } from './astronomicalEvents';
import { WEEKS_PER_YEAR, WEEKS_PER_YEAR_LEAP, WEEKS_PER_SEASON, PERIODS_PER_SEASON, WEEKS_PER_PERIOD, DAYS_PER_WEEK } from '../constants/calendar';

// Map SeasonName to LeapSeason for comparison
const SEASON_NAME_TO_LEAP_SEASON: Record<SeasonName, LeapSeason> = {
  Spring: 'spring',
  Summer: 'summer',
  Autumn: 'autumn',
  Winter: 'winter',
};

const PERIOD_NAMES = {
  Spring: ['Zeus', 'Hera', 'Poseidon'],
  Summer: ['Demeter', 'Apollo', 'Artemis'],
  Autumn: ['Ares', 'Athena', 'Hephaestus'],
  Winter: ['Aphrodite', 'Hermes', 'Hestia'],
};

const SEASON_TINTS = {
  Spring: '#f0fff0',
  Summer: '#fffef0',
  Autumn: '#fff8f0',
  Winter: '#f0f8ff',
};

const INTERCALARY_NAMES = {
  Spring: 'Springjoy',
  Summer: 'Summerjoy',
  Autumn: 'Autumnjoy',
  Winter: 'Winterjoy',
};

function createDay(date: Date, astronomicalEvents: Map<string, AstronomicalEvent>, olympianDayNumber: number): Day {
  const dayOfWeek = date.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const event = astronomicalEvents.get(date.toDateString());

  // Check if this is today
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();

  return {
    date,
    traditionalDayNumber: date.getDate(),
    olympianDayNumber,
    isWeekend,
    astronomicalEvent: event,
    isToday,
  };
}

function createWeek(
  startDate: Date,
  customWeekNumber: number,
  isIntercalary: boolean,
  astronomicalEvents: Map<string, AstronomicalEvent>,
  olympianDayStart: number,
  intercalaryName?: string
): Week {
  const days: Day[] = [];

  for (let i = 0; i < DAYS_PER_WEEK; i++) {
    const date = addDays(startDate, i);
    days.push(createDay(date, astronomicalEvents, olympianDayStart + i));
  }

  return {
    customWeekNumber,
    days,
    isIntercalary,
    intercalaryName,
  };
}

function createPeriod(
  name: string,
  startDate: Date,
  startWeekNumber: number,
  astronomicalEvents: Map<string, AstronomicalEvent>
): Period {
  const weeks: Week[] = [];

  for (let i = 0; i < WEEKS_PER_PERIOD; i++) {
    const weekStart = addWeeks(startDate, i);
    // Olympian day numbering: 1-28 for each period (4 weeks × 7 days)
    const olympianDayStart = i * DAYS_PER_WEEK + 1;
    weeks.push(createWeek(weekStart, startWeekNumber + i, false, astronomicalEvents, olympianDayStart));
  }

  return {
    name,
    weeks,
  };
}

function createSeason(
  seasonName: SeasonName,
  startDate: Date,
  startWeekNumber: number,
  astronomicalEvents: Map<string, AstronomicalEvent>,
  isLeapWeekSeason: boolean = false
): Season {
  const periodNames = PERIOD_NAMES[seasonName];
  const periods: Period[] = [];

  let currentDate = startDate;
  let currentWeekNumber = startWeekNumber;

  for (let i = 0; i < PERIODS_PER_SEASON; i++) {
    periods.push(createPeriod(periodNames[i], currentDate, currentWeekNumber, astronomicalEvents));
    currentDate = addWeeks(currentDate, WEEKS_PER_PERIOD);
    currentWeekNumber += WEEKS_PER_PERIOD;
  }

  const intercalaryWeeks: Week[] = [];
  const intercalaryName = INTERCALARY_NAMES[seasonName];

  // Intercalary weeks use day numbering 1-7 (and 8-14 for leap week)
  intercalaryWeeks.push(createWeek(currentDate, currentWeekNumber, true, astronomicalEvents, 1, intercalaryName));

  if (isLeapWeekSeason) {
    currentDate = addWeeks(currentDate, 1);
    currentWeekNumber += 1;
    intercalaryWeeks.push(createWeek(currentDate, currentWeekNumber, true, astronomicalEvents, 8, intercalaryName));
  }

  return {
    name: seasonName,
    periods,
    intercalaryWeeks,
    tint: SEASON_TINTS[seasonName],
  };
}

export function buildCustomYear(year: number): CustomYear {
  const startDate = getCustomYearStart(year);
  const needsLeapWeek = customYearNeedsLeapWeek(year);
  const leapSeason = getLeapSeason(year);
  const totalWeeks = needsLeapWeek ? WEEKS_PER_YEAR_LEAP : WEEKS_PER_YEAR;
  const endDate = addWeeks(startDate, totalWeeks);

  const astronomicalEvents = getSolsticesAndEquinoxes(year);
  const nextYearEvents = getSolsticesAndEquinoxes(year + 1);
  nextYearEvents.forEach((value, key) => astronomicalEvents.set(key, value));

  const seasonNames: SeasonName[] = ['Spring', 'Summer', 'Autumn', 'Winter'];
  const seasons: Season[] = [];

  let currentDate = startDate;
  let currentWeekNumber = 1;

  for (const seasonName of seasonNames) {
    // Check if this season gets the leap week (based on optimized configuration)
    const isLeapWeekSeason = needsLeapWeek && leapSeason === SEASON_NAME_TO_LEAP_SEASON[seasonName];
    const weeksInSeason = isLeapWeekSeason ? WEEKS_PER_SEASON + 1 : WEEKS_PER_SEASON;

    seasons.push(createSeason(seasonName, currentDate, currentWeekNumber, astronomicalEvents, isLeapWeekSeason));
    currentDate = addWeeks(currentDate, weeksInSeason);
    currentWeekNumber += weeksInSeason;
  }

  return {
    startDate,
    endDate,
    seasons,
  };
}
