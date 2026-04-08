export type SeasonName = 'Spring' | 'Summer' | 'Autumn' | 'Winter';

export type ViewMode = 'traditional' | 'olympian';

export type AstronomicalEvent =
  | 'spring-equinox'
  | 'summer-solstice'
  | 'autumn-equinox'
  | 'winter-solstice';

export type MoonPhase = 'new-moon' | 'first-quarter' | 'full-moon' | 'last-quarter';

export interface Day {
  date: Date;
  traditionalDayNumber: number;
  olympianDayNumber: number;
  isWeekend: boolean;
  astronomicalEvent?: AstronomicalEvent;
  moonPhase?: MoonPhase;
  isToday?: boolean;
}

export interface Week {
  customWeekNumber: number;
  days: Day[];
  isIntercalary: boolean;
  intercalaryName?: string;
}

export interface Period {
  name: string;
  weeks: Week[];
}

export interface Season {
  name: SeasonName;
  periods: Period[];
  intercalaryWeeks: Week[];
  tint: string;
}

export interface CustomYear {
  startDate: Date;
  endDate: Date;
  seasons: Season[];
}

export interface WeekRowData {
  week: Week;
  monthIndex: number | null;
  traditionalWeekNumber: number;
  periodName: string | null;
  customWeekNumber: number;
  isIntercalary: boolean;
  periodIndex: number;
  isLastWeekOfPeriod: boolean;
  isLastWeekOfSeason: boolean;
  seasonTint: string;
  seasonName: string | null;
}
