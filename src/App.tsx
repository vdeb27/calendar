import { useState } from 'react';
import Calendar from './components/Calendar';
import { ViewMode } from './types/calendar';
import { LanguageProvider } from './i18n/LanguageContext';
import { SchoolHolidayProvider } from './context/SchoolHolidayContext';
import { DisplaySettingsProvider } from './context/DisplaySettingsContext';
import './styles/calendar.css';

function App() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [viewMode, setViewMode] = useState<ViewMode>('olympian');

  return (
    <LanguageProvider>
      <SchoolHolidayProvider>
        <DisplaySettingsProvider>
          <Calendar
            year={year}
            viewMode={viewMode}
            onYearChange={setYear}
            onViewModeChange={setViewMode}
          />
        </DisplaySettingsProvider>
      </SchoolHolidayProvider>
    </LanguageProvider>
  );
}

export default App;
