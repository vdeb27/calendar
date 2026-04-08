import { Day, ViewMode, MoonPhase } from '../types/calendar';
import { useLanguage } from '../i18n/LanguageContext';
import { useDisplaySettings } from '../context/DisplaySettingsContext';
import { useSchoolHoliday } from '../context/SchoolHolidayContext';

interface DayCellProps {
  day: Day;
  viewMode: ViewMode;
}

function getAstronomicalIcon(event: string | undefined): string | null {
  if (!event) return null;

  switch (event) {
    case 'spring-equinox':
      return '☀️—';
    case 'summer-solstice':
      return '☀️↑';
    case 'autumn-equinox':
      return '☀️—';
    case 'winter-solstice':
      return '☀️↓';
    default:
      return null;
  }
}

function getMoonPhaseIcon(phase: MoonPhase | undefined): string | null {
  if (!phase) return null;

  switch (phase) {
    case 'new-moon':
      return '🌑';
    case 'first-quarter':
      return '🌓';
    case 'full-moon':
      return '🌕';
    case 'last-quarter':
      return '🌗';
    default:
      return null;
  }
}

export default function DayCell({ day, viewMode }: DayCellProps) {
  const { showAstronomical, showMoonPhases } = useDisplaySettings();
  const { showHolidays } = useSchoolHoliday();
  const astroIcon = showAstronomical ? getAstronomicalIcon(day.astronomicalEvent) : null;
  const moonIcon = showMoonPhases ? getMoonPhaseIcon(day.moonPhase) : null;
  const { t } = useLanguage();

  // Determine which number to show prominently
  const prominentNumber = viewMode === 'traditional' ? day.traditionalDayNumber : day.olympianDayNumber;
  const alternateNumber = viewMode === 'traditional' ? day.olympianDayNumber : day.traditionalDayNumber;

  const hasHoliday = showHolidays && day.schoolHoliday;

  const cellClasses = [
    'day-cell',
    day.isWeekend ? 'weekend' : '',
    day.isToday ? 'today' : '',
    hasHoliday ? 'school-holiday' : '',
  ].filter(Boolean).join(' ');

  const holidayTitle = hasHoliday ? t.schoolHolidays[day.schoolHoliday!] : undefined;

  return (
    <div className={cellClasses} title={holidayTitle}>
      <div className="day-number">{prominentNumber}</div>
      <div className="day-number-alt">{alternateNumber}</div>
      {(astroIcon || moonIcon) && (
        <div className="astronomical-icon">
          {astroIcon}{moonIcon && <span className="moon-phase-icon">{moonIcon}</span>}
        </div>
      )}
    </div>
  );
}
