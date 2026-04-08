import { createContext, useContext, useState, ReactNode } from 'react';

interface DisplaySettingsContextValue {
  showAstronomical: boolean;
  setShowAstronomical: (show: boolean) => void;
  showMoonPhases: boolean;
  setShowMoonPhases: (show: boolean) => void;
}

const DisplaySettingsContext = createContext<DisplaySettingsContextValue | null>(null);

export function DisplaySettingsProvider({ children }: { children: ReactNode }) {
  const [showAstronomical, setShowAstronomical] = useState(true);
  const [showMoonPhases, setShowMoonPhases] = useState(true);

  return (
    <DisplaySettingsContext.Provider value={{ showAstronomical, setShowAstronomical, showMoonPhases, setShowMoonPhases }}>
      {children}
    </DisplaySettingsContext.Provider>
  );
}

export function useDisplaySettings() {
  const ctx = useContext(DisplaySettingsContext);
  if (!ctx) throw new Error('useDisplaySettings must be used within DisplaySettingsProvider');
  return ctx;
}
