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
  color, icon: Icon, title, subtitle, period, desc, index, inView, isLast,
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
      initial={{ opacity: 0, x: 20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.45, delay: 0.2 + index * 0.14 }}
      className="relative flex gap-5"
    >
      {/* Icon + animated connector line */}
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.35, delay: 0.25 + index * 0.14, type: 'spring', stiffness: 260 }}
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10"
          style={{
            background: `${color}20`,
            border: `1.5px solid ${color}60`,
            boxShadow: `0 0 18px ${color}30`,
          }}
        >
          <Icon size={16} style={{ color }} />
        </motion.div>

        {!isLast && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.45 + index * 0.14, ease: 'easeOut' }}
            className="w-px flex-1 mt-2 origin-top"
            style={{ background: `linear-gradient(to bottom, ${color}50, transparent)` }}
          />
        )}
      </div>

      {/* Text content */}
      <div className="pb-8 flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h4 className="text-base font-bold" style={{ color: '#E2E8F0' }}>{title}</h4>
          <motion.span
            initial={{ opacity: 0, scale: 0.85 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.3, delay: 0.35 + index * 0.14 }}
            className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold"
            style={{ background: `${color}18`, border: `1px solid ${color}45`, color }}
          >
            {period}
          </motion.span>
        </div>
        <p className="text-sm font-medium mb-2" style={{ color: `${color}cc` }}>{subtitle}</p>
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(148,163,184,0.7)' }}>{desc}</p>
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
      {/* ── Decorative background blobs ── */}
      <motion.div
        animate={{ x: [0, 18, -10, 0], y: [0, -14, 20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute pointer-events-none"
        style={{
          width: 480, height: 480,
          top: '-10%', left: '-8%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <motion.div
        animate={{ x: [0, -20, 12, 0], y: [0, 16, -18, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        className="absolute pointer-events-none"
        style={{
          width: 400, height: 400,
          bottom: '-5%', right: '-5%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* ── Subtle dot-grid overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(148,163,184,0.055) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative flex h-full">

        {/* ── Left: hero title + stats ── */}
        <div
          className="hidden md:flex flex-col justify-center px-12 lg:px-16 shrink-0 relative"
          style={{ width: '34%', borderRight: '1px solid rgba(255,255,255,0.06)' }}
        >
          {/* Vertical accent line */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute left-0 top-1/4 bottom-1/4 w-px origin-top"
            style={{ background: 'linear-gradient(to bottom, transparent, #3B82F650, transparent)' }}
          />

          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="text-xs tracking-[0.3em] uppercase mb-3"
            style={{ color: 'var(--accent)' }}
          >
            {t.experience.subtitle}
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.06 }}
            className="font-bold leading-none tracking-tight mb-8"
            style={{
              fontSize: 'clamp(2.8rem, 4vw, 5rem)',
              background: 'linear-gradient(160deg, #E2E8F0 0%, #60A5FA 60%, #818CF8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {t.experience.title}
          </motion.h2>

          {/* Legend */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.45 }}
            className="flex flex-col gap-2"
          >
            {[
              { dot: '#3B82F6', label: t.experience.workTitle },
              { dot: '#6366F1', label: t.experience.eduTitle  },
            ].map(({ dot, label }) => (
              <div key={label} className="flex items-center gap-2.5">
                <motion.div
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: Math.random() * 2 }}
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: dot, boxShadow: `0 0 8px ${dot}` }}
                />
                <span className="text-xs" style={{ color: 'rgba(148,163,184,0.5)' }}>{label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Right: timeline ── */}
        <div className="flex-1 flex flex-col justify-center px-8 md:px-12 py-10 overflow-y-auto">

          {/* Mobile header */}
          <div className="md:hidden mb-8">
            <p className="text-xs tracking-[0.3em] uppercase mb-1" style={{ color: 'var(--accent)' }}>
              {t.experience.subtitle}
            </p>
            <h2
              className="text-4xl font-bold"
              style={{
                background: 'linear-gradient(135deg, #E2E8F0 0%, #60A5FA 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {t.experience.title}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-x-12">
            {/* Work */}
            <div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="text-xs tracking-[0.25em] uppercase font-semibold mb-6"
                style={{ color: 'rgba(148,163,184,0.4)' }}
              >
                {t.experience.workTitle}
              </motion.p>
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
              <motion.p
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="text-xs tracking-[0.25em] uppercase font-semibold mb-6"
                style={{ color: 'rgba(148,163,184,0.4)' }}
              >
                {t.experience.eduTitle}
              </motion.p>
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
      </div>
    </section>
  )
}
