import { useState } from 'react';
import Calendar from './components/Calendar';
import { ViewMode } from './types/calendar';
import './styles/calendar.css';

function App() {
  const [year, setYear] = useState(2026);
  const [viewMode, setViewMode] = useState<ViewMode>('custom');

  return (
    <Calendar
      year={year}
      viewMode={viewMode}
      onYearChange={setYear}
      onViewModeChange={setViewMode}
    />
  );
}

export default App;
