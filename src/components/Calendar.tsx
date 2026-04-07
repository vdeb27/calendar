import { useMemo, useRef } from 'react';
import { buildCustomYear } from '../utils/customCalendar';
import { buildTraditionalYear } from '../utils/traditionalCalendar';
import { getTraditionalWeekNumber } from '../utils/dateUtils';
import { WeekRowData, ViewMode } from '../types/calendar';
import { useLanguage } from '../i18n/LanguageContext';
import { useSwipe } from '../hooks/useSwipe';
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
        const monthIndex = currentMonth !== lastMonth ? currentMonth : null;
        lastMonth = currentMonth;

        weeks.push({
          week,
          monthIndex,
          traditionalWeekNumber: getTraditionalWeekNumber(firstDay.date),
          periodName: weekIndexInPeriod === 0 ? period.name : null,
          customWeekNumber: week.customWeekNumber,
          isIntercalary: false,
          periodIndex,
          isLastWeekOfPeriod: weekIndexInPeriod === 3,
          isLastWeekOfSeason: false,
          seasonTint: season.tint,
          seasonName: periodIndex === 0 && weekIndexInPeriod === 0 ? season.name : null,
        });
      });
    });

    season.intercalaryWeeks.forEach((intercalaryWeek, intercalaryIdx) => {
      const intercalaryFirstDay = intercalaryWeek.days[0];
      const intercalaryMonth = intercalaryFirstDay.date.getMonth();
      const monthIndex = intercalaryMonth !== lastMonth ? intercalaryMonth : null;
      lastMonth = intercalaryMonth;

      weeks.push({
        week: intercalaryWeek,
        monthIndex,
        traditionalWeekNumber: getTraditionalWeekNumber(intercalaryFirstDay.date),
        periodName: intercalaryIdx === 0 ? (intercalaryWeek.intercalaryName || '—') : null,
        customWeekNumber: intercalaryWeek.customWeekNumber,
        isIntercalary: true,
        periodIndex: 3,
        isLastWeekOfPeriod: false,
        isLastWeekOfSeason: intercalaryIdx === season.intercalaryWeeks.length - 1,
        seasonTint: season.tint,
        seasonName: null,
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
  let lastSeasonName: string | null = null;

  traditionalYear.weeks.forEach((week, weekIndex) => {
    const firstDay = week.days[0];
    const currentMonth = firstDay.date.getMonth();
    const monthIndex = currentMonth !== lastMonth ? currentMonth : null;
    lastMonth = currentMonth;

    // Get custom calendar info for this date
    const customInfo = traditionalYear.customYearMapping.get(firstDay.date.toDateString());

    // Only show period name when it changes (first week of period or intercalary)
    const currentPeriodName = customInfo?.isIntercalary
      ? (customInfo?.intercalaryName || '—')
      : customInfo?.periodName || null;
    const showPeriodName = currentPeriodName !== lastPeriodName ? currentPeriodName : null;
    lastPeriodName = currentPeriodName;

    // Only show season name when it changes
    const currentSeasonName = customInfo?.seasonName || null;
    const showSeasonName = currentSeasonName !== lastSeasonName ? currentSeasonName : null;
    lastSeasonName = currentSeasonName;

    weeks.push({
      week,
      monthIndex,
      traditionalWeekNumber: getTraditionalWeekNumber(firstDay.date),
      periodName: showPeriodName,
      customWeekNumber: customInfo?.customWeekNumber || weekIndex + 1,
      isIntercalary: customInfo?.isIntercalary || false,
      periodIndex: customInfo?.periodIndex || 0,
      isLastWeekOfPeriod: false,
      isLastWeekOfSeason: false,
      seasonTint: customInfo?.seasonTint || '#ffffff',
      seasonName: showSeasonName,
    });
  });

  return weeks;
}

function translatePeriodName(
  name: string,
  isIntercalary: boolean,
  t: ReturnType<typeof useLanguage>['t']
): string {
  if (name === '—') return name;
  if (isIntercalary) {
    return (t.intercalary as Record<string, string>)[name] || name;
  }
  return (t.periods as Record<string, string>)[name] || name;
}

export default function Calendar({ year, viewMode, onYearChange, onViewModeChange }: CalendarProps) {
  const { language, setLanguage, t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const customYear = useMemo(() => buildCustomYear(year), [year]);
  const traditionalYear = useMemo(() => buildTraditionalYear(year), [year]);

  const swipeHandlers = useMemo(() => ({
    onSwipeLeft: () => onYearChange(year + 1),
    onSwipeRight: () => onYearChange(year - 1),
  }), [year, onYearChange]);

  const { yearIndicator, indicatorKey, isSwiping, offsetX } = useSwipe(containerRef, contentRef, swipeHandlers);

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
    <div className="calendar-container" ref={containerRef}>
      <div className="calendar-header">
        <div className="header-toggles">
          <div className="view-toggle">
            <div className={`view-toggle-slider ${viewMode === 'olympian' ? 'olympian' : ''}`} />
            <button
              className={`view-toggle-button ${viewMode === 'traditional' ? 'active' : ''}`}
              onClick={() => onViewModeChange('traditional')}
            >
              {t.traditional}
            </button>
            <button
              className={`view-toggle-button ${viewMode === 'olympian' ? 'active' : ''}`}
              onClick={() => onViewModeChange('olympian')}
            >
              {t.olympian}
            </button>
          </div>
          <div className="lang-toggle">
            <div className={`lang-toggle-slider ${language === 'en' ? 'en' : ''}`} />
            <button
              className={`lang-toggle-button ${language === 'nl' ? 'active' : ''}`}
              onClick={() => setLanguage('nl')}
            >
              NL
            </button>
            <button
              className={`lang-toggle-button ${language === 'en' ? 'active' : ''}`}
              onClick={() => setLanguage('en')}
            >
              EN
            </button>
          </div>
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

      {yearIndicator && (
        <div className="year-indicator" key={indicatorKey}>
          <span>{yearDisplay}</span>
        </div>
      )}

      <div className="swipe-viewport">
        {isSwiping && offsetX !== 0 && (
          <div className={`swipe-peek-label ${offsetX > 0 ? 'left' : 'right'}`}>
            <div className="swipe-peek-arrow">{offsetX > 0 ? '◀' : '▶'}</div>
            <div className="swipe-peek-year">{offsetX > 0 ? year - 1 : year + 1}</div>
            {viewMode === 'olympian' && (
              <>
                <div className="swipe-peek-separator">–</div>
                <div className="swipe-peek-year">{offsetX > 0 ? year : year + 2}</div>
              </>
            )}
          </div>
        )}
      <div className="swipe-strip" ref={contentRef}>
        <div className={`swipe-peek swipe-peek-left${isSwiping && offsetX > 0 ? ' active' : ''}`} />
        <div className={`swipe-peek swipe-peek-right${isSwiping && offsetX < 0 ? ' active' : ''}`} />
      <div className="calendar-content">
        <div className="calendar-header-row">
          <div className="sidebar-header traditional">{t.month}</div>
          <div className="day-headers">
            {t.days.map((day, i) => (
              <div key={i} className={`day-header ${i >= 5 ? 'weekend' : ''}`}>{day}</div>
            ))}
          </div>
          <div className="sidebar-header custom">{t.period}</div>
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
              <div key={`${weekData.customWeekNumber}-${index}`}>
                {viewMode === 'olympian' && weekData.seasonName && (
                  <div className="mobile-season-header" style={{ backgroundColor: weekData.seasonTint }}>
                    {t.seasons[weekData.seasonName]}
                  </div>
                )}
                {viewMode === 'olympian' && weekData.periodName && (
                  <div className={`mobile-period-header ${weekData.isIntercalary ? 'intercalary' : ''}`} style={{ backgroundColor: weekData.seasonTint }}>
                    {translatePeriodName(weekData.periodName, weekData.isIntercalary, t)}
                  </div>
                )}
                {viewMode === 'traditional' && weekData.monthIndex !== null && (
                  <div className="mobile-month-header">
                    {t.months[weekData.monthIndex]}
                  </div>
                )}
                <div
                  className={rowClasses}
                  style={{ backgroundColor: weekData.seasonTint }}
                >
                  <div className="traditional-sidebar-cell">
                    {weekData.monthIndex !== null && (
                      <div className="month-name">{t.months[weekData.monthIndex]}</div>
                    )}
                    <div className="week-number">{weekData.traditionalWeekNumber}</div>
                  </div>

                  <div className="mobile-week-number">
                    {viewMode === 'olympian' ? weekData.customWeekNumber : weekData.traditionalWeekNumber}
                  </div>

                  <div className={`week-row-wrapper period-shade-${periodShade}`}>
                    <WeekRow week={weekData.week} viewMode={viewMode} />
                  </div>

                  <div className="custom-sidebar-cell">
                    {weekData.periodName && (
                      <div className={`period-name ${weekData.isIntercalary ? 'intercalary-label' : ''}`}>
                        {translatePeriodName(weekData.periodName, weekData.isIntercalary, t)}
                      </div>
                    )}
                    <div className="custom-week">{weekData.customWeekNumber}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      </div>
      </div>
    </div>
  );
}
