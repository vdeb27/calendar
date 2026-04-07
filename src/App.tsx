import { useState } from 'react';
import Calendar from './components/Calendar';
import { ViewMode } from './types/calendar';
import './styles/calendar.css';

function App() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [viewMode, setViewMode] = useState<ViewMode>('olympian');

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
