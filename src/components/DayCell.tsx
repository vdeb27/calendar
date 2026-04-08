import { Day, ViewMode, MoonPhase } from '../types/calendar';

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
  const astroIcon = getAstronomicalIcon(day.astronomicalEvent);
  const moonIcon = getMoonPhaseIcon(day.moonPhase);

  // Determine which number to show prominently
  const prominentNumber = viewMode === 'traditional' ? day.traditionalDayNumber : day.olympianDayNumber;
  const alternateNumber = viewMode === 'traditional' ? day.olympianDayNumber : day.traditionalDayNumber;

  const cellClasses = [
    'day-cell',
    day.isWeekend ? 'weekend' : '',
    day.isToday ? 'today' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={cellClasses}>
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
