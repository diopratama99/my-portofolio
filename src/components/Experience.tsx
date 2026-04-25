'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { Briefcase, GraduationCap } from 'lucide-react'

const workItems = [
  {
    role:    { en: 'IT Support',        id: 'IT Support' },
    company: 'PT. Karangmas Unggul',
    period:  { en: '2023 – Present',    id: '2023 – Sekarang' },
    desc:    {
      en: 'Maintain and troubleshoot company hardware, networks, and software. Manage internal IT infrastructure and provide end-user support.',
      id: 'Memelihara dan menangani masalah hardware, jaringan, dan software perusahaan. Mengelola infrastruktur IT internal dan memberikan dukungan kepada pengguna.',
    },
    color: '#3B82F6',
  },
  {
    role:    { en: 'Drafter (AutoCAD)', id: 'Drafter (AutoCAD)' },
    company: 'PT. Karangmas Unggul',
    period:  { en: '2022 – 2024',       id: '2022 – 2024' },
    desc:    {
      en: 'Created technical drawings and 2D layouts using AutoCAD for construction and engineering projects.',
      id: 'Membuat gambar teknik dan tata letak 2D menggunakan AutoCAD untuk proyek konstruksi dan rekayasa.',
    },
    color: '#F59E0B',
  },
]

const eduItems = [
  {
    degree:  { en: 'Informatics Engineering (S1)',         id: 'Teknik Informatika (S1)' },
    school:  'Universitas Mercubuana',
    period:  { en: 'Jan 2025 – Present',                   id: 'Jan 2025 – Sekarang' },
    desc:    {
      en: 'Focus: Data Science program. Working-class student, currently in semester 3.',
      id: 'Fokus: Program Studi Data Science. Kelas karyawan, saat ini semester 3.',
    },
    color: '#6366F1',
  },
  {
    degree:  { en: 'Vocational High School – DPIB',        id: 'SMK – Desain Pemodelan dan Informasi Bangunan' },
    school:  'SMK Muhammadiyah 01 Cileungsi',
    period:  { en: '2018 – 2021',                          id: '2018 – 2021' },
    desc:    {
      en: 'Majored in Building Design Modeling and Information (DPIB).',
      id: 'Jurusan Desain Pemodelan dan Informasi Bangunan (DPIB).',
    },
    color: '#10B981',
  },
]

/* ── Single timeline entry ── */
function TimelineItem({
  color, title, subtitle, period, desc, index, inView, isLast,
}: {
  color: string
  icon: React.ElementType
  title: string
  subtitle: string
  period: string
  desc: string
  index: number
  inView: boolean
  isLast: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.2 + index * 0.12 }}
      className="relative flex gap-4"
      style={{ paddingBottom: isLast ? 0 : '2rem' }}
    >
      {/* Left accent line */}
      <div className="flex flex-col items-center pt-1.5 shrink-0" style={{ width: 2 }}>
        <div
          className="w-full flex-1"
          style={{
            background: isLast
              ? `linear-gradient(to bottom, ${color}, transparent)`
              : color,
          }}
        />
      </div>

      {/* Text content */}
      <div className="flex-1 min-w-0 pb-2">
        <div className="flex flex-wrap items-start gap-x-3 gap-y-1 mb-1">
          <h4 className="text-sm font-bold leading-snug" style={{ color: '#E2E8F0' }}>{title}</h4>
          <span
            className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase shrink-0"
            style={{ background: `${color}15`, border: `1px solid ${color}40`, color, borderRadius: '3px' }}
          >
            {period}
          </span>
        </div>
        <p className="text-xs font-semibold mb-2 tracking-wide" style={{ color: `${color}bb` }}>{subtitle}</p>
        <p className="text-xs leading-relaxed" style={{ color: 'rgba(148,163,184,0.65)' }}>{desc}</p>
      </div>
    </motion.div>
  )
}

/* ── Main ── */
export default function Experience() {
  const { t, lang } = useLanguage()
  const ref = useRef(null)
  const inView = useInView(ref, { once: false, margin: '-80px' })

  return (
    <section
      id="experience"
      className="w-full h-full flex flex-col justify-center overflow-hidden relative"
      style={{ background: 'var(--bg-primary)' }}
      ref={ref}
    >
      <div className="relative z-10 w-full px-6 md:px-12 lg:px-20 py-16 flex flex-col justify-center h-full">

        {/* Section index */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-4 mb-6"
        >
          <span className="font-mono text-xs tracking-widest uppercase" style={{ color: 'rgba(59,130,246,0.4)' }}>03 / EXPERIENCE</span>
          <div className="h-px flex-1 max-w-16" style={{ background: 'rgba(59,130,246,0.3)' }} />
          <span className="text-xs tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>{t.experience.subtitle}</span>
        </motion.div>

        {/* Big title */}
        <div className="overflow-hidden mb-1">
          <motion.h2
            initial={{ y: '100%' }}
            animate={inView ? { y: 0 } : { y: '100%' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="font-display font-bold uppercase leading-none"
            style={{
              fontSize: 'clamp(2.8rem, 8vw, 7rem)',
              WebkitTextStroke: '1.5px rgba(226,232,240,0.6)',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em',
            }}
          >
            {lang === 'id' ? 'Pengalaman' : 'Experience'}
          </motion.h2>
        </div>

        {/* Horizontal divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-px mb-10 origin-left"
          style={{ background: 'linear-gradient(to right, rgba(59,130,246,0.7), rgba(99,102,241,0.35), transparent)' }}
        />

        {/* Column labels + timelines */}
        <div className="grid md:grid-cols-2 gap-x-16 gap-y-10">
          {/* Work */}
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex items-center gap-3 mb-6"
            >
              <Briefcase size={13} style={{ color: '#3B82F6' }} />
              <span className="text-xs tracking-widest uppercase font-semibold" style={{ color: 'rgba(148,163,184,0.5)' }}>
                {t.experience.workTitle}
              </span>
            </motion.div>
            {workItems.map((item, i) => (
              <TimelineItem
                key={i}
                color={item.color}
                icon={Briefcase}
                title={lang === 'id' ? item.role.id   : item.role.en}
                subtitle={item.company}
                period={lang === 'id' ? item.period.id : item.period.en}
                desc={lang === 'id'   ? item.desc.id   : item.desc.en}
                index={i}
                inView={inView}
                isLast={i === workItems.length - 1}
              />
            ))}
          </div>

          {/* Education */}
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex items-center gap-3 mb-6"
            >
              <GraduationCap size={13} style={{ color: '#6366F1' }} />
              <span className="text-xs tracking-widest uppercase font-semibold" style={{ color: 'rgba(148,163,184,0.5)' }}>
                {t.experience.eduTitle}
              </span>
            </motion.div>
            {eduItems.map((item, i) => (
              <TimelineItem
                key={i}
                color={item.color}
                icon={GraduationCap}
                title={lang === 'id' ? item.degree.id : item.degree.en}
                subtitle={item.school}
                period={lang === 'id' ? item.period.id : item.period.en}
                desc={lang === 'id'   ? item.desc.id   : item.desc.en}
                index={i}
                inView={inView}
                isLast={i === eduItems.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
