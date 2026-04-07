import { Day, ViewMode } from '../types/calendar';

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

export default function DayCell({ day, viewMode }: DayCellProps) {
  const icon = getAstronomicalIcon(day.astronomicalEvent);

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
      {icon && <div className="astronomical-icon">{icon}</div>}
    </div>
  );
}
