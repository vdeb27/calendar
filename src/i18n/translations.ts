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
}
