import { useState } from 'react';
import Calendar from './components/Calendar';
import { ViewMode } from './types/calendar';
import { LanguageProvider } from './i18n/LanguageContext';
import './styles/calendar.css';

function App() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [viewMode, setViewMode] = useState<ViewMode>('olympian');

  return (
    <LanguageProvider>
      <Calendar
        year={year}
        viewMode={viewMode}
        onYearChange={setYear}
        onViewModeChange={setViewMode}
      />
    </LanguageProvider>
  );
}

export default App;
