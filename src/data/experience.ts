type Localized = { en: string; id: string }

export interface TimelineEntry {
  title: Localized
  org: string
  period: Localized
  desc: Localized
  color: string
}

export const workItems: TimelineEntry[] = [
  {
    title: { en: 'IT Support', id: 'IT Support' },
    org: 'PT. Karangmas Unggul',
    period: { en: '2023 — Present', id: '2023 — Sekarang' },
    desc: {
      en: 'Maintain and troubleshoot company hardware, networks, and software. Manage internal IT infrastructure and provide end-user support.',
      id: 'Memelihara dan menangani masalah hardware, jaringan, dan software perusahaan. Mengelola infrastruktur IT internal dan memberikan dukungan kepada pengguna.',
    },
    color: '#5468FF',
  },
  {
    title: { en: 'Drafter (AutoCAD)', id: 'Drafter (AutoCAD)' },
    org: 'PT. Karangmas Unggul',
    period: { en: '2022 — 2024', id: '2022 — 2024' },
    desc: {
      en: 'Created technical drawings and 2D layouts using AutoCAD for construction and engineering projects.',
      id: 'Membuat gambar teknik dan tata letak 2D menggunakan AutoCAD untuk proyek konstruksi dan rekayasa.',
    },
    color: '#F59E0B',
  },
]

export const eduItems: TimelineEntry[] = [
  {
    title: { en: 'Informatics Engineering (S1)', id: 'Teknik Informatika (S1)' },
    org: 'Universitas Mercubuana',
    period: { en: 'Jan 2025 — Present', id: 'Jan 2025 — Sekarang' },
    desc: {
      en: 'Focus: Data Science program. Working-class student, currently in semester 4 with a 3.95 GPA.',
      id: 'Fokus: Program Studi Data Science. Kelas karyawan, saat ini semester 4 dengan IPK 3.95.',
    },
    color: '#A78BFA',
  },
  {
    title: { en: 'Vocational High School — DPIB', id: 'SMK — Desain Pemodelan dan Informasi Bangunan' },
    org: 'SMK Muhammadiyah 01 Cileungsi',
    period: { en: '2018 — 2021', id: '2018 — 2021' },
    desc: {
      en: 'Majored in Building Design Modeling and Information (DPIB).',
      id: 'Jurusan Desain Pemodelan dan Informasi Bangunan (DPIB).',
    },
    color: '#10B981',
  },
]

/** First year of professional work, used for the experience counter. */
export const CAREER_START_YEAR = 2022
