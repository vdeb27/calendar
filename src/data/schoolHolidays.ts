// Dutch school holiday data 2020-2030
// Sources: opendata.rijksoverheid.nl (2024-2030), wanneerschoolvakantie.nl + educatie-en-school.infonu.nl (2020-2024)

export type SchoolHolidayRegion = 'noord' | 'midden' | 'zuid';

export type SchoolHolidayType =
  | 'herfstvakantie'
  | 'kerstvakantie'
  | 'voorjaarsvakantie'
  | 'meivakantie'
  | 'zomervakantie';

export interface SchoolHolidayEntry {
  schoolYear: string;
  type: SchoolHolidayType;
  regions: SchoolHolidayRegion[];
  startDate: string; // YYYY-MM-DD inclusive
  endDate: string;   // YYYY-MM-DD inclusive
}

export const schoolHolidayData: SchoolHolidayEntry[] = [
  // ── 2020-2021 ──
  { schoolYear: '2020-2021', type: 'herfstvakantie', regions: ['noord'], startDate: '2020-10-10', endDate: '2020-10-18' },
  { schoolYear: '2020-2021', type: 'herfstvakantie', regions: ['midden', 'zuid'], startDate: '2020-10-17', endDate: '2020-10-25' },
  { schoolYear: '2020-2021', type: 'kerstvakantie', regions: ['noord', 'midden', 'zuid'], startDate: '2020-12-19', endDate: '2021-01-03' },
  { schoolYear: '2020-2021', type: 'voorjaarsvakantie', regions: ['noord', 'midden'], startDate: '2021-02-20', endDate: '2021-02-28' },
  { schoolYear: '2020-2021', type: 'voorjaarsvakantie', regions: ['zuid'], startDate: '2021-02-13', endDate: '2021-02-21' },
  { schoolYear: '2020-2021', type: 'meivakantie', regions: ['noord', 'midden', 'zuid'], startDate: '2021-05-01', endDate: '2021-05-09' },
  { schoolYear: '2020-2021', type: 'zomervakantie', regions: ['noord'], startDate: '2021-07-10', endDate: '2021-08-22' },
  { schoolYear: '2020-2021', type: 'zomervakantie', regions: ['midden'], startDate: '2021-07-17', endDate: '2021-08-29' },
  { schoolYear: '2020-2021', type: 'zomervakantie', regions: ['zuid'], startDate: '2021-07-24', endDate: '2021-09-05' },

  // ── 2021-2022 ──
  { schoolYear: '2021-2022', type: 'herfstvakantie', regions: ['noord', 'midden'], startDate: '2021-10-16', endDate: '2021-10-24' },
  { schoolYear: '2021-2022', type: 'herfstvakantie', regions: ['zuid'], startDate: '2021-10-23', endDate: '2021-10-31' },
  { schoolYear: '2021-2022', type: 'kerstvakantie', regions: ['noord', 'midden', 'zuid'], startDate: '2021-12-25', endDate: '2022-01-09' },
  { schoolYear: '2021-2022', type: 'voorjaarsvakantie', regions: ['noord'], startDate: '2022-02-19', endDate: '2022-02-27' },
  { schoolYear: '2021-2022', type: 'voorjaarsvakantie', regions: ['midden', 'zuid'], startDate: '2022-02-26', endDate: '2022-03-06' },
  { schoolYear: '2021-2022', type: 'meivakantie', regions: ['noord', 'midden', 'zuid'], startDate: '2022-04-30', endDate: '2022-05-08' },
  { schoolYear: '2021-2022', type: 'zomervakantie', regions: ['noord'], startDate: '2022-07-16', endDate: '2022-08-28' },
  { schoolYear: '2021-2022', type: 'zomervakantie', regions: ['midden'], startDate: '2022-07-09', endDate: '2022-08-21' },
  { schoolYear: '2021-2022', type: 'zomervakantie', regions: ['zuid'], startDate: '2022-07-23', endDate: '2022-09-04' },

  // ── 2022-2023 ──
  { schoolYear: '2022-2023', type: 'herfstvakantie', regions: ['noord'], startDate: '2022-10-15', endDate: '2022-10-23' },
  { schoolYear: '2022-2023', type: 'herfstvakantie', regions: ['midden', 'zuid'], startDate: '2022-10-22', endDate: '2022-10-30' },
  { schoolYear: '2022-2023', type: 'kerstvakantie', regions: ['noord', 'midden', 'zuid'], startDate: '2022-12-24', endDate: '2023-01-08' },
  { schoolYear: '2022-2023', type: 'voorjaarsvakantie', regions: ['noord', 'midden'], startDate: '2023-02-25', endDate: '2023-03-05' },
  { schoolYear: '2022-2023', type: 'voorjaarsvakantie', regions: ['zuid'], startDate: '2023-02-18', endDate: '2023-02-26' },
  { schoolYear: '2022-2023', type: 'meivakantie', regions: ['noord', 'midden', 'zuid'], startDate: '2023-04-29', endDate: '2023-05-07' },
  { schoolYear: '2022-2023', type: 'zomervakantie', regions: ['noord'], startDate: '2023-07-22', endDate: '2023-09-03' },
  { schoolYear: '2022-2023', type: 'zomervakantie', regions: ['midden'], startDate: '2023-07-08', endDate: '2023-08-20' },
  { schoolYear: '2022-2023', type: 'zomervakantie', regions: ['zuid'], startDate: '2023-07-15', endDate: '2023-08-27' },

  // ── 2023-2024 ──
  { schoolYear: '2023-2024', type: 'herfstvakantie', regions: ['noord'], startDate: '2023-10-21', endDate: '2023-10-29' },
  { schoolYear: '2023-2024', type: 'herfstvakantie', regions: ['midden', 'zuid'], startDate: '2023-10-14', endDate: '2023-10-22' },
  { schoolYear: '2023-2024', type: 'kerstvakantie', regions: ['noord', 'midden', 'zuid'], startDate: '2023-12-23', endDate: '2024-01-07' },
  { schoolYear: '2023-2024', type: 'voorjaarsvakantie', regions: ['noord', 'midden', 'zuid'], startDate: '2024-02-17', endDate: '2024-02-25' },
  { schoolYear: '2023-2024', type: 'meivakantie', regions: ['noord', 'midden', 'zuid'], startDate: '2024-04-27', endDate: '2024-05-05' },
  { schoolYear: '2023-2024', type: 'zomervakantie', regions: ['noord'], startDate: '2024-07-20', endDate: '2024-09-01' },
  { schoolYear: '2023-2024', type: 'zomervakantie', regions: ['midden'], startDate: '2024-07-13', endDate: '2024-08-25' },
  { schoolYear: '2023-2024', type: 'zomervakantie', regions: ['zuid'], startDate: '2024-07-06', endDate: '2024-08-18' },

  // ── 2024-2025 ──
  { schoolYear: '2024-2025', type: 'herfstvakantie', regions: ['noord', 'midden'], startDate: '2024-10-26', endDate: '2024-11-03' },
  { schoolYear: '2024-2025', type: 'herfstvakantie', regions: ['zuid'], startDate: '2024-10-19', endDate: '2024-10-27' },
  { schoolYear: '2024-2025', type: 'kerstvakantie', regions: ['noord', 'midden', 'zuid'], startDate: '2024-12-21', endDate: '2025-01-05' },
  { schoolYear: '2024-2025', type: 'voorjaarsvakantie', regions: ['noord'], startDate: '2025-02-15', endDate: '2025-02-23' },
  { schoolYear: '2024-2025', type: 'voorjaarsvakantie', regions: ['midden', 'zuid'], startDate: '2025-02-22', endDate: '2025-03-02' },
  { schoolYear: '2024-2025', type: 'meivakantie', regions: ['noord', 'midden', 'zuid'], startDate: '2025-04-26', endDate: '2025-05-04' },
  { schoolYear: '2024-2025', type: 'zomervakantie', regions: ['noord'], startDate: '2025-07-12', endDate: '2025-08-24' },
  { schoolYear: '2024-2025', type: 'zomervakantie', regions: ['midden'], startDate: '2025-07-19', endDate: '2025-08-31' },
  { schoolYear: '2024-2025', type: 'zomervakantie', regions: ['zuid'], startDate: '2025-07-05', endDate: '2025-08-17' },

  // ── 2025-2026 ──
  { schoolYear: '2025-2026', type: 'herfstvakantie', regions: ['noord', 'midden'], startDate: '2025-10-18', endDate: '2025-10-26' },
  { schoolYear: '2025-2026', type: 'herfstvakantie', regions: ['zuid'], startDate: '2025-10-11', endDate: '2025-10-19' },
  { schoolYear: '2025-2026', type: 'kerstvakantie', regions: ['noord', 'midden', 'zuid'], startDate: '2025-12-20', endDate: '2026-01-04' },
  { schoolYear: '2025-2026', type: 'voorjaarsvakantie', regions: ['noord'], startDate: '2026-02-21', endDate: '2026-03-01' },
  { schoolYear: '2025-2026', type: 'voorjaarsvakantie', regions: ['midden', 'zuid'], startDate: '2026-02-14', endDate: '2026-02-22' },
  { schoolYear: '2025-2026', type: 'meivakantie', regions: ['noord', 'midden', 'zuid'], startDate: '2026-04-25', endDate: '2026-05-03' },
  { schoolYear: '2025-2026', type: 'zomervakantie', regions: ['noord'], startDate: '2026-07-04', endDate: '2026-08-16' },
  { schoolYear: '2025-2026', type: 'zomervakantie', regions: ['midden'], startDate: '2026-07-18', endDate: '2026-08-30' },
  { schoolYear: '2025-2026', type: 'zomervakantie', regions: ['zuid'], startDate: '2026-07-11', endDate: '2026-08-23' },

  // ── 2026-2027 ──
  { schoolYear: '2026-2027', type: 'herfstvakantie', regions: ['noord'], startDate: '2026-10-10', endDate: '2026-10-18' },
  { schoolYear: '2026-2027', type: 'herfstvakantie', regions: ['midden', 'zuid'], startDate: '2026-10-17', endDate: '2026-10-25' },
  { schoolYear: '2026-2027', type: 'kerstvakantie', regions: ['noord', 'midden', 'zuid'], startDate: '2026-12-19', endDate: '2027-01-03' },
  { schoolYear: '2026-2027', type: 'voorjaarsvakantie', regions: ['noord', 'midden'], startDate: '2027-02-20', endDate: '2027-02-28' },
  { schoolYear: '2026-2027', type: 'voorjaarsvakantie', regions: ['zuid'], startDate: '2027-02-13', endDate: '2027-02-21' },
  { schoolYear: '2026-2027', type: 'meivakantie', regions: ['noord', 'midden', 'zuid'], startDate: '2027-04-24', endDate: '2027-05-02' },
  { schoolYear: '2026-2027', type: 'zomervakantie', regions: ['noord'], startDate: '2027-07-10', endDate: '2027-08-22' },
  { schoolYear: '2026-2027', type: 'zomervakantie', regions: ['midden'], startDate: '2027-07-17', endDate: '2027-08-29' },
  { schoolYear: '2026-2027', type: 'zomervakantie', regions: ['zuid'], startDate: '2027-07-24', endDate: '2027-09-05' },

  // ── 2027-2028 ──
  { schoolYear: '2027-2028', type: 'herfstvakantie', regions: ['noord', 'midden'], startDate: '2027-10-16', endDate: '2027-10-24' },
  { schoolYear: '2027-2028', type: 'herfstvakantie', regions: ['zuid'], startDate: '2027-10-23', endDate: '2027-10-31' },
  { schoolYear: '2027-2028', type: 'kerstvakantie', regions: ['noord', 'midden', 'zuid'], startDate: '2027-12-25', endDate: '2028-01-09' },
  { schoolYear: '2027-2028', type: 'voorjaarsvakantie', regions: ['noord'], startDate: '2028-02-19', endDate: '2028-02-27' },
  { schoolYear: '2027-2028', type: 'voorjaarsvakantie', regions: ['midden', 'zuid'], startDate: '2028-02-26', endDate: '2028-03-05' },
  { schoolYear: '2027-2028', type: 'meivakantie', regions: ['noord', 'midden', 'zuid'], startDate: '2028-04-29', endDate: '2028-05-07' },
  { schoolYear: '2027-2028', type: 'zomervakantie', regions: ['noord'], startDate: '2028-07-15', endDate: '2028-08-27' },
  { schoolYear: '2027-2028', type: 'zomervakantie', regions: ['midden'], startDate: '2028-07-08', endDate: '2028-08-20' },
  { schoolYear: '2027-2028', type: 'zomervakantie', regions: ['zuid'], startDate: '2028-07-22', endDate: '2028-09-03' },

  // ── 2028-2029 ──
  { schoolYear: '2028-2029', type: 'herfstvakantie', regions: ['noord'], startDate: '2028-10-14', endDate: '2028-10-22' },
  { schoolYear: '2028-2029', type: 'herfstvakantie', regions: ['midden', 'zuid'], startDate: '2028-10-21', endDate: '2028-10-29' },
  { schoolYear: '2028-2029', type: 'kerstvakantie', regions: ['noord', 'midden', 'zuid'], startDate: '2028-12-23', endDate: '2029-01-07' },
  { schoolYear: '2028-2029', type: 'voorjaarsvakantie', regions: ['noord', 'midden'], startDate: '2029-02-17', endDate: '2029-02-25' },
  { schoolYear: '2028-2029', type: 'voorjaarsvakantie', regions: ['zuid'], startDate: '2029-02-10', endDate: '2029-02-18' },
  { schoolYear: '2028-2029', type: 'meivakantie', regions: ['noord', 'midden', 'zuid'], startDate: '2029-04-28', endDate: '2029-05-06' },
  { schoolYear: '2028-2029', type: 'zomervakantie', regions: ['noord'], startDate: '2029-07-21', endDate: '2029-09-02' },
  { schoolYear: '2028-2029', type: 'zomervakantie', regions: ['midden'], startDate: '2029-07-07', endDate: '2029-08-19' },
  { schoolYear: '2028-2029', type: 'zomervakantie', regions: ['zuid'], startDate: '2029-07-14', endDate: '2029-08-26' },

  // ── 2029-2030 ──
  { schoolYear: '2029-2030', type: 'herfstvakantie', regions: ['noord', 'midden'], startDate: '2029-10-20', endDate: '2029-10-28' },
  { schoolYear: '2029-2030', type: 'herfstvakantie', regions: ['zuid'], startDate: '2029-10-13', endDate: '2029-10-21' },
  { schoolYear: '2029-2030', type: 'kerstvakantie', regions: ['noord', 'midden', 'zuid'], startDate: '2029-12-22', endDate: '2030-01-06' },
  { schoolYear: '2029-2030', type: 'voorjaarsvakantie', regions: ['noord'], startDate: '2030-02-16', endDate: '2030-02-24' },
  { schoolYear: '2029-2030', type: 'voorjaarsvakantie', regions: ['midden', 'zuid'], startDate: '2030-02-23', endDate: '2030-03-03' },
  { schoolYear: '2029-2030', type: 'meivakantie', regions: ['noord', 'midden', 'zuid'], startDate: '2030-04-27', endDate: '2030-05-05' },
  { schoolYear: '2029-2030', type: 'zomervakantie', regions: ['noord'], startDate: '2030-07-20', endDate: '2030-09-01' },
  { schoolYear: '2029-2030', type: 'zomervakantie', regions: ['midden'], startDate: '2030-07-13', endDate: '2030-08-25' },
  { schoolYear: '2029-2030', type: 'zomervakantie', regions: ['zuid'], startDate: '2030-07-06', endDate: '2030-08-18' },
];
