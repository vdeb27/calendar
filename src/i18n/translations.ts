export type Language = 'en' | 'nl';

export const translations = {
  en: {
    traditional: 'Traditional',
    olympian: 'Olympian',
    month: 'Month',
    period: 'Period',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    periods: {
      Zeus: 'Zeus',
      Hera: 'Hera',
      Poseidon: 'Poseidon',
      Demeter: 'Demeter',
      Apollo: 'Apollo',
      Artemis: 'Artemis',
      Ares: 'Ares',
      Athena: 'Athena',
      Hephaestus: 'Hephaestus',
      Aphrodite: 'Aphrodite',
      Hermes: 'Hermes',
      Hestia: 'Hestia',
    },
    intercalary: {
      Springjoy: 'Springjoy',
      Summerjoy: 'Summerjoy',
      Autumnjoy: 'Autumnjoy',
      Winterjoy: 'Winterjoy',
    },
    seasons: {
      Spring: 'Spring',
      Summer: 'Summer',
      Autumn: 'Autumn',
      Winter: 'Winter',
    },
    schoolHolidays: {
      herfstvakantie: 'Autumn Break',
      kerstvakantie: 'Christmas Break',
      voorjaarsvakantie: 'Spring Break',
      meivakantie: 'May Break',
      zomervakantie: 'Summer Break',
    },
    settings: 'Settings',
    astronomicalEvents: 'Astronomical events',
    moonPhases: 'Moon phases',
    schoolHolidaysLabel: 'School holidays',
    region: 'Region',
    languageLabel: 'Language',
  },
  nl: {
    traditional: 'Traditioneel',
    olympian: 'Olympisch',
    month: 'Maand',
    period: 'Periode',
    days: ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'],
    months: ['Jan', 'Feb', 'Mrt', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'],
    periods: {
      Zeus: 'Zeus',
      Hera: 'Hera',
      Poseidon: 'Poseidon',
      Demeter: 'Demeter',
      Apollo: 'Apollo',
      Artemis: 'Artemis',
      Ares: 'Ares',
      Athena: 'Athene',
      Hephaestus: 'Hephaistos',
      Aphrodite: 'Aphrodite',
      Hermes: 'Hermes',
      Hestia: 'Hestia',
    },
    intercalary: {
      Springjoy: 'Lentevreugde',
      Summerjoy: 'Zomervreugde',
      Autumnjoy: 'Herfstvreugde',
      Winterjoy: 'Wintervreugde',
    },
    seasons: {
      Spring: 'Lente',
      Summer: 'Zomer',
      Autumn: 'Herfst',
      Winter: 'Winter',
    },
    schoolHolidays: {
      herfstvakantie: 'Herfstvakantie',
      kerstvakantie: 'Kerstvakantie',
      voorjaarsvakantie: 'Voorjaarsvakantie',
      meivakantie: 'Meivakantie',
      zomervakantie: 'Zomervakantie',
    },
    settings: 'Instellingen',
    astronomicalEvents: 'Astronomische events',
    moonPhases: 'Maanfasen',
    schoolHolidaysLabel: 'Schoolvakanties',
    region: 'Regio',
    languageLabel: 'Taal',
  },
};

export interface Translations {
  traditional: string;
  olympian: string;
  month: string;
  period: string;
  days: readonly string[];
  months: readonly string[];
  periods: Record<string, string>;
  intercalary: Record<string, string>;
  seasons: Record<string, string>;
  schoolHolidays: Record<string, string>;
  settings: string;
  astronomicalEvents: string;
  moonPhases: string;
  schoolHolidaysLabel: string;
  region: string;
  languageLabel: string;
}
