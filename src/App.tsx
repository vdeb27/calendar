import { useState } from 'react';
import Calendar from './components/Calendar';
import { ViewMode } from './types/calendar';
import { LanguageProvider } from './i18n/LanguageContext';
import { SchoolHolidayProvider } from './context/SchoolHolidayContext';
import './styles/calendar.css';

function App() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [viewMode, setViewMode] = useState<ViewMode>('olympian');

  return (
    <LanguageProvider>
      <SchoolHolidayProvider>
        <Calendar
          year={year}
          viewMode={viewMode}
          onYearChange={setYear}
          onViewModeChange={setViewMode}
        />
      </SchoolHolidayProvider>
    </LanguageProvider>
  );
}

export default App;
