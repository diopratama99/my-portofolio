'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import {
  SiFlutter, SiDart, SiReact, SiLaravel, SiPython, SiPhp,
  SiSqlite, SiPostgresql, SiMysql, SiSupabase, SiN8N,
  SiGit, SiLinux, SiTypescript, SiJavascript, SiHtml5,
  SiCss, SiVscodium, SiGithub, SiFigma, SiNextdotjs, SiThreedotjs,
  SiTailwindcss, SiNodedotjs, SiDocker,
} from 'react-icons/si'
import { FaRobot, FaWindows, FaApple } from 'react-icons/fa'
import type { IconType } from 'react-icons'

interface Tech {
  Icon?: IconType
  customIcon?: React.ReactNode
  color: string
  bg?: string   // optional background square (e.g. JS yellow, TS blue)
  label: string
}

const rows: {
  label: { en: string; id: string }
  dot: string
  dir: 'left' | 'right'
  duration: string
  items: Tech[]
}[] = [
  {
    label: { en: 'Languages', id: 'Bahasa Pemrograman' },
    dot: '#F7DF1E',
    dir: 'left',
    duration: '28s',
    items: [
      { Icon: SiJavascript, color: '#000',    bg: '#F7DF1E', label: 'JavaScript' },
      { Icon: SiTypescript, color: '#fff',    bg: '#3178C6', label: 'TypeScript' },
      { Icon: SiPhp,        color: '#777BB4', label: 'PHP' },
      { Icon: SiPython,     color: '#FFD43B', label: 'Python' },
      { Icon: SiDart,       color: '#0175C2', label: 'Dart' },
      { Icon: SiHtml5,      color: '#E34F26', label: 'HTML5' },
      { Icon: SiCss,        color: '#1572B6', label: 'CSS3' },
    ],
  },
  {
    label: { en: 'Frameworks & Libraries', id: 'Framework & Library' },
    dot: '#61DAFB',
    dir: 'right',
    duration: '22s',
    items: [
      { Icon: SiNextdotjs,   color: '#E2E8F0', label: 'Next.js' },
      { Icon: SiReact,       color: '#61DAFB', label: 'React' },
      { Icon: SiTailwindcss, color: '#06B6D4', label: 'Tailwind CSS' },
      { Icon: SiNodedotjs,   color: '#339933', label: 'Node.js' },
      { Icon: SiLaravel,     color: '#FF2D20', label: 'Laravel' },
      { Icon: SiFlutter,     color: '#54C5F8', label: 'Flutter' },
      { Icon: SiThreedotjs,  color: '#6D6D6D', label: 'Three.js' },
    ],
  },
  {
    label: { en: 'Databases', id: 'Database' },
    dot: '#3ECF8E',
    dir: 'left',
    duration: '24s',
    items: [
      { Icon: SiMysql,      color: '#4479A1', label: 'MySQL' },
      { Icon: SiPostgresql, color: '#336791', label: 'PostgreSQL' },
      { Icon: SiSqlite,     color: '#44A6CF', label: 'SQLite' },
      { Icon: SiSupabase,   color: '#3ECF8E', label: 'Supabase' },
    ],
  },
  {
    label: { en: 'AI, Automation & Tools', id: 'AI, Otomasi & Tools' },
    dot: '#A78BFA',
    dir: 'right',
    duration: '30s',
    items: [
      { Icon: SiN8N,      color: '#EA4B71', label: 'n8n' },
      { Icon: FaRobot,    color: '#A78BFA', label: 'OpenClaw' },
      { Icon: SiDocker,   color: '#2496ED', label: 'Docker' },
      { Icon: SiGit,      color: '#F05032', label: 'Git' },
      { Icon: SiGithub,   color: '#E6EDF3', label: 'GitHub' },
      { Icon: SiFigma,    color: '#F24E1E', label: 'Figma' },
      {
        customIcon: (
          <img src="/visio.svg" alt="Visio" width={64} height={64} style={{ flexShrink: 0 }} />
        ),
        color: '#2B7CD3',
        label: 'Visio',
      },
      { Icon: SiLinux,   color: '#FCC624', label: 'Linux' },
      { Icon: FaWindows, color: '#0078D4', label: 'Windows' },
      { Icon: FaApple,   color: '#A2AAAD', label: 'macOS' },
      { Icon: SiVscodium,color: '#2B82D9', label: 'VS Code' },
    ],
  },
]

function IconItem({ tech }: { tech: Tech }) {
  const { Icon, customIcon, color, bg, label } = tech
  return (
    <motion.div
      whileHover={{ scale: 1.15, y: -4 }}
      transition={{ duration: 0.18 }}
      className="flex items-center justify-center mx-5 cursor-default"
      title={label}
      style={{ flexShrink: 0 }}
    >
      {customIcon ? customIcon : bg && Icon ? (
        <div
          style={{
            width: 64, height: 64, background: bg, borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Icon size={42} style={{ color }} />
        </div>
      ) : Icon ? (
        <Icon size={64} style={{ color }} />
      ) : null}
    </motion.div>
  )
}

interface RowProps {
  label: string
  dot: string
  dir: 'left' | 'right'
  duration: string
  items: Tech[]
  delay: number
  inView: boolean
}

function IconRow({ label, dot, dir, duration, items, delay, inView }: RowProps) {
  // Pad to at least 20 unique items so each half covers any screen width (~2080px at 104px/icon)
  const MIN = 20
  const padded: Tech[] = []
  while (padded.length < MIN) padded.push(...items)
  const doubled = [...padded, ...padded]
  const trackClass = dir === 'left' ? 'marquee-track-left' : 'marquee-track-right'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.45, delay }}
      className="flex flex-col gap-3"
    >
      {/* Category label */}
      <div className="flex items-center gap-2 px-6">
        <span
          className="w-1.5 h-1.5 rounded-full inline-block"
          style={{ background: dot, boxShadow: `0 0 6px ${dot}` }}
        />
        <span
          className="text-[10px] tracking-[0.25em] uppercase font-semibold"
          style={{ color: 'rgba(148,163,184,0.6)' }}
        >
          {label}
        </span>
      </div>

      {/* Marquee strip */}
      <div
        className="overflow-hidden marquee-row py-1"
        style={{
          maskImage:
            'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        }}
      >
        <div
          className={trackClass}
          style={{ '--marquee-duration': duration } as React.CSSProperties}
        >
          {doubled.map((tech, i) => (
            <IconItem key={`${tech.label}-${i}`} tech={tech} />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function Skills() {
  const { t, lang } = useLanguage()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section
      id="skills"
      className="w-full h-full flex flex-col justify-center overflow-hidden"
      style={{ background: 'var(--bg-surface)' }}
      ref={ref}
    >
      {/* Header */}
      <div className="px-6 md:px-12 lg:px-20 pt-12 pb-8">

        {/* Section index */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-4 mb-6"
        >
          <span className="font-mono text-xs tracking-widest uppercase" style={{ color: 'rgba(59,130,246,0.4)' }}>04 / SKILLS</span>
          <div className="h-px flex-1 max-w-16" style={{ background: 'rgba(59,130,246,0.3)' }} />
          <span className="text-xs tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>{t.skills.subtitle}</span>
        </motion.div>

        {/* Big title — 1 line */}
        <div className="overflow-hidden mb-6">
          <motion.h2
            initial={{ y: '100%' }}
            animate={inView ? { y: 0 } : { y: '100%' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="font-display font-bold uppercase leading-none whitespace-nowrap"
            style={{ fontSize: 'clamp(2.8rem, 8vw, 7rem)', letterSpacing: '-0.02em' }}
          >
            <span style={{ WebkitTextStroke: '1.5px rgba(226,232,240,0.6)', WebkitTextFillColor: 'transparent' }}>Skills&nbsp;</span>
            <span style={{ background: 'linear-gradient(135deg, #E2E8F0 0%, #60A5FA 45%, #818CF8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>&amp; Stack</span>
          </motion.h2>
        </div>

        {/* Horizontal divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-px origin-left"
          style={{ background: 'linear-gradient(to right, rgba(59,130,246,0.7), rgba(99,102,241,0.35), transparent)' }}
        />
      </div>

      {/* Marquee rows */}
      <div className="flex flex-col gap-8 pb-10">
        {rows.map((row, i) => (
          <IconRow
            key={i}
            label={lang === 'id' ? row.label.id : row.label.en}
            dot={row.dot}
            dir={row.dir}
            duration={row.duration}
            items={row.items}
            delay={i * 0.1}
            inView={inView}
          />
        ))}
      </div>
    </section>
  )
}
