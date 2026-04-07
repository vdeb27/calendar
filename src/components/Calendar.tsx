import { useMemo } from 'react';
import { buildCustomYear } from '../utils/customCalendar';
import { buildTraditionalYear } from '../utils/traditionalCalendar';
import { getMonthName, getTraditionalWeekNumber } from '../utils/dateUtils';
import { WeekRowData, ViewMode } from '../types/calendar';
import WeekRow from './WeekRow';

interface CalendarProps {
  year: number;
  viewMode: ViewMode;
  onYearChange: (year: number) => void;
  onViewModeChange: (mode: ViewMode) => void;
}

function buildCustomViewWeeks(customYear: ReturnType<typeof buildCustomYear>): WeekRowData[] {
  const weeks: WeekRowData[] = [];
  let lastMonth = -1;

  customYear.seasons.forEach((season) => {
    season.periods.forEach((period, periodIndex) => {
      period.weeks.forEach((week, weekIndexInPeriod) => {
        const firstDay = week.days[0];
        const currentMonth = firstDay.date.getMonth();
        const monthName = currentMonth !== lastMonth ? getMonthName(currentMonth) : null;
        lastMonth = currentMonth;

        weeks.push({
          week,
          monthName,
          traditionalWeekNumber: getTraditionalWeekNumber(firstDay.date),
          periodName: weekIndexInPeriod === 0 ? period.name : null,
          customWeekNumber: week.customWeekNumber,
          isIntercalary: false,
          periodIndex,
          isLastWeekOfPeriod: weekIndexInPeriod === 3,
          isLastWeekOfSeason: false,
          seasonTint: season.tint,
        });
      });
    });

    season.intercalaryWeeks.forEach((intercalaryWeek, intercalaryIdx) => {
      const intercalaryFirstDay = intercalaryWeek.days[0];
      const intercalaryMonth = intercalaryFirstDay.date.getMonth();
      const monthName = intercalaryMonth !== lastMonth ? getMonthName(intercalaryMonth) : null;
      lastMonth = intercalaryMonth;

      weeks.push({
        week: intercalaryWeek,
        monthName,
        traditionalWeekNumber: getTraditionalWeekNumber(intercalaryFirstDay.date),
        periodName: intercalaryIdx === 0 ? (intercalaryWeek.intercalaryName || '—') : null,
        customWeekNumber: intercalaryWeek.customWeekNumber,
        isIntercalary: true,
        periodIndex: 3,
        isLastWeekOfPeriod: false,
        isLastWeekOfSeason: intercalaryIdx === season.intercalaryWeeks.length - 1,
        seasonTint: season.tint,
      });
    });
  });

  return weeks;
}

function buildTraditionalViewWeeks(
  traditionalYear: ReturnType<typeof buildTraditionalYear>
): WeekRowData[] {
  const weeks: WeekRowData[] = [];
  let lastMonth = -1;
  let lastPeriodName: string | null = null;

  traditionalYear.weeks.forEach((week, weekIndex) => {
    const firstDay = week.days[0];
    const currentMonth = firstDay.date.getMonth();
    const monthName = currentMonth !== lastMonth ? getMonthName(currentMonth) : null;
    lastMonth = currentMonth;

    // Get custom calendar info for this date
    const customInfo = traditionalYear.customYearMapping.get(firstDay.date.toDateString());

    // Only show period name when it changes (first week of period or intercalary)
    const currentPeriodName = customInfo?.isIntercalary
      ? (customInfo?.intercalaryName || '—')
      : customInfo?.periodName || null;
    const showPeriodName = currentPeriodName !== lastPeriodName ? currentPeriodName : null;
    lastPeriodName = currentPeriodName;

    weeks.push({
      week,
      monthName,
      traditionalWeekNumber: getTraditionalWeekNumber(firstDay.date),
      periodName: showPeriodName,
      customWeekNumber: customInfo?.customWeekNumber || weekIndex + 1,
      isIntercalary: customInfo?.isIntercalary || false,
      periodIndex: customInfo?.periodIndex || 0,
      isLastWeekOfPeriod: false,
      isLastWeekOfSeason: false,
      seasonTint: customInfo?.seasonTint || '#ffffff',
    });
  });

  return weeks;
}

export default function Calendar({ year, viewMode, onYearChange, onViewModeChange }: CalendarProps) {
  const customYear = useMemo(() => buildCustomYear(year), [year]);
  const traditionalYear = useMemo(() => buildTraditionalYear(year), [year]);

  const allWeeks = useMemo(() => {
    if (viewMode === 'traditional') {
      return buildTraditionalViewWeeks(traditionalYear);
    }
    return buildCustomViewWeeks(customYear);
  }, [viewMode, customYear, traditionalYear]);

  const yearDisplay = useMemo(() => {
    if (viewMode === 'traditional') {
      return `${year}`;
    } else {
      return `${year}–${year + 1}`;
    }
  }, [viewMode, year]);

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <div className="view-toggle">
          <div className={`view-toggle-slider ${viewMode === 'olympian' ? 'olympian' : ''}`} />
          <button
            className={`view-toggle-button ${viewMode === 'traditional' ? 'active' : ''}`}
            onClick={() => onViewModeChange('traditional')}
          >
            Traditional
          </button>
          <button
            className={`view-toggle-button ${viewMode === 'olympian' ? 'active' : ''}`}
            onClick={() => onViewModeChange('olympian')}
          >
            Olympian
          </button>
        </div>
        <div className="year-navigation">
          <button
            className="year-nav-button"
            onClick={() => onYearChange(year - 1)}
            aria-label="Previous year"
          >
            &lt;
          </button>
          <h1>{yearDisplay}</h1>
          <button
            className="year-nav-button"
            onClick={() => onYearChange(year + 1)}
            aria-label="Next year"
          >
            &gt;
          </button>
        </div>
      </div>

      <div className="calendar-content">
        <div className="calendar-header-row">
          <div className="sidebar-header traditional">Month</div>
          <div className="day-headers">
            <div className="day-header">Mon</div>
            <div className="day-header">Tue</div>
            <div className="day-header">Wed</div>
            <div className="day-header">Thu</div>
            <div className="day-header">Fri</div>
            <div className="day-header weekend">Sat</div>
            <div className="day-header weekend">Sun</div>
          </div>
          <div className="sidebar-header custom">Period</div>
        </div>

        <div className="weeks-container">
          {allWeeks.map((weekData, index) => {
            const periodShade = weekData.periodIndex % 4;
            const rowClasses = [
              'calendar-row',
              weekData.isLastWeekOfPeriod ? 'last-week-of-period' : '',
              weekData.isLastWeekOfSeason ? 'last-week-of-season' : '',
            ].filter(Boolean).join(' ');

            return (
              <div
                key={`${weekData.customWeekNumber}-${index}`}
                className={rowClasses}
                style={{ backgroundColor: weekData.seasonTint }}
              >
                <div className="traditional-sidebar-cell">
                  {weekData.monthName && (
                    <div className="month-name">{weekData.monthName}</div>
                  )}
                  <div className="week-number">{weekData.traditionalWeekNumber}</div>
                </div>

                <div className={`week-row-wrapper period-shade-${periodShade}`}>
                  <WeekRow week={weekData.week} viewMode={viewMode} />
                </div>

                <div className="custom-sidebar-cell">
                  {weekData.periodName && (
                    <div className={`period-name ${weekData.isIntercalary ? 'intercalary-label' : ''}`}>
                      {weekData.periodName}
                    </div>
                  )}
                  <div className="custom-week">{weekData.customWeekNumber}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
