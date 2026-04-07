import { AstronomicalEvent } from '../types/calendar';

// Astronomical event calculation using Jean Meeus's "Astronomical Algorithms"
// Accurate to within ~1 minute for years 1000-3000

/**
 * Convert Julian Ephemeris Day (JDE) to JavaScript Date
 */
function jdeToDate(jde: number): Date {
  // Julian Day Number (JDN) is the integer part
  // The fraction represents the time of day
  const jdn = Math.floor(jde + 0.5);
  const fraction = jde + 0.5 - jdn;

  // Convert JDN to calendar date (Gregorian calendar)
  const a = jdn + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor((146097 * b) / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);

  const day = e - Math.floor((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * Math.floor(m / 10);
  const year = 100 * b + d - 4800 + Math.floor(m / 10);

  // Convert fraction to time
  const hours = fraction * 24;
  const minutes = (hours - Math.floor(hours)) * 60;
  const seconds = (minutes - Math.floor(minutes)) * 60;

  return new Date(Date.UTC(year, month - 1, day, Math.floor(hours), Math.floor(minutes), Math.floor(seconds)));
}

/**
 * Calculate mean JDE for an event (equinox or solstice)
 * @param year - The year to calculate for
 * @param event - 0=spring equinox, 1=summer solstice, 2=autumn equinox, 3=winter solstice
 */
function calculateMeanJDE(year: number, event: number): number {
  // Use different formulas for different time periods
  if (year >= -1000 && year <= 1000) {
    // Formula for years -1000 to +1000
    const Y = year / 1000;
    const terms = [
      [1721139.29189, 365242.13740, 0.06134, 0.00111, -0.00071],
      [1721233.25401, 365241.72562, -0.05323, 0.00907, 0.00025],
      [1721325.70455, 365242.49558, -0.11677, -0.00297, 0.00074],
      [1721414.39987, 365242.88257, -0.00769, -0.00933, -0.00006],
    ];
    const t = terms[event];
    return t[0] + t[1] * Y + t[2] * Y * Y + t[3] * Y * Y * Y + t[4] * Y * Y * Y * Y;
  } else {
    // Formula for years 1000 to 3000
    const Y = (year - 2000) / 1000;
    const terms = [
      [2451623.80984, 365242.37404, 0.05169, -0.00411, -0.00057],
      [2451716.56767, 365241.62603, 0.00325, 0.00888, -0.00030],
      [2451810.21715, 365242.01767, -0.11575, 0.00337, 0.00078],
      [2451900.05952, 365242.74049, -0.06223, -0.00823, 0.00032],
    ];
    const t = terms[event];
    return t[0] + t[1] * Y + t[2] * Y * Y + t[3] * Y * Y * Y + t[4] * Y * Y * Y * Y;
  }
}

/**
 * Apply periodic corrections to the mean JDE
 */
function applyPeriodicCorrections(jde: number): number {
  const T = (jde - 2451545.0) / 36525;

  // Periodic terms for more accurate calculation
  const A = [
    485, 203, 199, 182, 156, 136, 77, 74, 70, 58, 52, 50, 45, 44, 29, 18, 17, 16, 14, 12, 12, 12, 9, 8
  ];
  const B = [
    324.96, 337.23, 342.08, 27.85, 73.14, 171.52, 222.54, 296.72, 243.58, 119.81,
    297.17, 21.02, 247.54, 325.15, 60.93, 155.12, 288.79, 198.04, 199.76, 95.39,
    287.11, 320.81, 227.73, 15.45
  ];
  const C = [
    1934.136, 32964.467, 20.186, 445267.112, 45036.886, 22518.443, 65928.934, 3034.906, 9037.513, 33718.147,
    150.678, 2281.226, 29929.562, 31555.956, 4443.417, 67555.328, 4562.452, 62894.029, 31436.921, 14577.848,
    31931.756, 34777.259, 1222.114, 16859.074
  ];

  let S = 0;
  for (let i = 0; i < 24; i++) {
    S += A[i] * Math.cos((B[i] + C[i] * T) * Math.PI / 180);
  }

  return jde + (0.00001 * S);
}

/**
 * Calculate the date of the spring equinox for a given year
 */
export function getSpringEquinox(year: number): Date {
  const jde0 = calculateMeanJDE(year, 0);
  const jde = applyPeriodicCorrections(jde0);
  return jdeToDate(jde);
}

/**
 * Calculate the date of the summer solstice for a given year
 */
export function getSummerSolstice(year: number): Date {
  const jde0 = calculateMeanJDE(year, 1);
  const jde = applyPeriodicCorrections(jde0);
  return jdeToDate(jde);
}

/**
 * Calculate the date of the autumn equinox for a given year
 */
export function getAutumnEquinox(year: number): Date {
  const jde0 = calculateMeanJDE(year, 2);
  const jde = applyPeriodicCorrections(jde0);
  return jdeToDate(jde);
}

/**
 * Calculate the date of the winter solstice for a given year
 */
export function getWinterSolstice(year: number): Date {
  const jde0 = calculateMeanJDE(year, 3);
  const jde = applyPeriodicCorrections(jde0);
  return jdeToDate(jde);
}

/**
 * Get all solstices and equinoxes for a given year
 */
export function getSolsticesAndEquinoxes(year: number): Map<string, AstronomicalEvent> {
  const events = new Map<string, AstronomicalEvent>();

  const springEquinox = getSpringEquinox(year);
  events.set(springEquinox.toDateString(), 'spring-equinox');

  const summerSolstice = getSummerSolstice(year);
  events.set(summerSolstice.toDateString(), 'summer-solstice');

  const autumnEquinox = getAutumnEquinox(year);
  events.set(autumnEquinox.toDateString(), 'autumn-equinox');

  const winterSolstice = getWinterSolstice(year);
  events.set(winterSolstice.toDateString(), 'winter-solstice');

  return events;
}
