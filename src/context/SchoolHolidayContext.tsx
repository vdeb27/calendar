import { createContext, useContext, useState, ReactNode } from 'react';
import { SchoolHolidayRegion } from '../types/calendar';

interface SchoolHolidayContextValue {
  region: SchoolHolidayRegion;
  setRegion: (r: SchoolHolidayRegion) => void;
  showHolidays: boolean;
  setShowHolidays: (show: boolean) => void;
}

const SchoolHolidayContext = createContext<SchoolHolidayContextValue | null>(null);

export function SchoolHolidayProvider({ children }: { children: ReactNode }) {
  const [region, setRegion] = useState<SchoolHolidayRegion>('midden');
  const [showHolidays, setShowHolidays] = useState(true);

  return (
    <SchoolHolidayContext.Provider value={{ region, setRegion, showHolidays, setShowHolidays }}>
      {children}
    </SchoolHolidayContext.Provider>
  );
}

export function useSchoolHoliday() {
  const ctx = useContext(SchoolHolidayContext);
  if (!ctx) throw new Error('useSchoolHoliday must be used within SchoolHolidayProvider');
  return ctx;
}
