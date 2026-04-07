import { Week, ViewMode } from '../types/calendar';
import DayCell from './DayCell';

interface WeekRowProps {
  week: Week;
  viewMode: ViewMode;
}

export default function WeekRow({ week, viewMode }: WeekRowProps) {
  return (
    <div className={`week-row ${week.isIntercalary ? 'intercalary' : ''}`}>
      {week.days.map((day, index) => (
        <DayCell key={index} day={day} viewMode={viewMode} />
      ))}
    </div>
  );
}
