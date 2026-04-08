import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useSchoolHoliday } from '../context/SchoolHolidayContext';
import { useDisplaySettings } from '../context/DisplaySettingsContext';

export default function SettingsDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { language, setLanguage, t } = useLanguage();
  const { region, setRegion, showHolidays, setShowHolidays } = useSchoolHoliday();
  const { showAstronomical, setShowAstronomical, showMoonPhases, setShowMoonPhases } = useDisplaySettings();

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  return (
    <div className="settings-dropdown" ref={ref}>
      <button
        className="settings-gear-button"
        onClick={() => setOpen(!open)}
        aria-label={t.settings}
        aria-expanded={open}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 13a3 3 0 100-6 3 3 0 000 6z" />
          <path fillRule="evenodd" d="M8.94 1.5a1.06 1.06 0 00-1.02.78L7.53 4.07a6.47 6.47 0 00-1.5.87L4.3 4.3a1.06 1.06 0 00-1.22.37L1.82 6.83a1.06 1.06 0 00.2 1.28l1.44 1.22a6.5 6.5 0 000 1.74L2.02 12.3a1.06 1.06 0 00-.2 1.28l1.26 2.18a1.06 1.06 0 001.22.37l1.73-.64a6.47 6.47 0 001.5.87l.39 1.79a1.06 1.06 0 001.02.78h2.12a1.06 1.06 0 001.02-.78l.39-1.79a6.47 6.47 0 001.5-.87l1.73.64a1.06 1.06 0 001.22-.37l1.26-2.18a1.06 1.06 0 00-.2-1.28l-1.44-1.22a6.5 6.5 0 000-1.74l1.44-1.22a1.06 1.06 0 00.2-1.28l-1.26-2.18a1.06 1.06 0 00-1.22-.37l-1.73.64a6.47 6.47 0 00-1.5-.87l-.39-1.79a1.06 1.06 0 00-1.02-.78H8.94zM10 8a2 2 0 100 4 2 2 0 000-4z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <div className="settings-menu">
          <div className="settings-item">
            <span className="settings-label">☀️ {t.astronomicalEvents}</span>
            <button
              className={`settings-toggle ${showAstronomical ? 'on' : ''}`}
              onClick={() => setShowAstronomical(!showAstronomical)}
              aria-label={t.astronomicalEvents}
            >
              <span className="settings-toggle-knob" />
            </button>
          </div>

          <div className="settings-item">
            <span className="settings-label">🌙 {t.moonPhases}</span>
            <button
              className={`settings-toggle ${showMoonPhases ? 'on' : ''}`}
              onClick={() => setShowMoonPhases(!showMoonPhases)}
              aria-label={t.moonPhases}
            >
              <span className="settings-toggle-knob" />
            </button>
          </div>

          <div className="settings-item">
            <span className="settings-label">🏫 {t.schoolHolidaysLabel}</span>
            <button
              className={`settings-toggle ${showHolidays ? 'on' : ''}`}
              onClick={() => setShowHolidays(!showHolidays)}
              aria-label={t.schoolHolidaysLabel}
            >
              <span className="settings-toggle-knob" />
            </button>
          </div>

          <div className={`settings-item sub-item ${!showHolidays ? 'disabled' : ''}`}>
            <span className="settings-label">{t.region}</span>
            <div className="settings-region-toggle">
              <div className={`region-toggle-slider ${region}`} />
              {(['noord', 'midden', 'zuid'] as const).map(r => (
                <button
                  key={r}
                  className={`region-toggle-button ${region === r ? 'active' : ''}`}
                  onClick={() => setRegion(r)}
                  disabled={!showHolidays}
                >
                  {r === 'noord' ? 'N' : r === 'midden' ? 'M' : 'Z'}
                </button>
              ))}
            </div>
          </div>

          <div className="settings-divider" />

          <div className="settings-item">
            <span className="settings-label">{t.languageLabel}</span>
            <div className="settings-lang-toggle">
              <div className={`lang-toggle-slider ${language === 'en' ? 'en' : ''}`} />
              <button
                className={`lang-toggle-button ${language === 'nl' ? 'active' : ''}`}
                onClick={() => setLanguage('nl')}
              >
                NL
              </button>
              <button
                className={`lang-toggle-button ${language === 'en' ? 'active' : ''}`}
                onClick={() => setLanguage('en')}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
