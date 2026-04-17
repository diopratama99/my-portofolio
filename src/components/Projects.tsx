'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, Smartphone } from 'lucide-react'
import { SiGithub } from 'react-icons/si'
import { useLanguage } from '@/contexts/LanguageContext'

const projects = [
  {
    key: 'temanku' as const,
    color: '#10B981',
    dim: '#064e3b',
    github: 'https://github.com/diopratama99/TemanKu',
    screenshots: [
      '/screenshots/temanku/1_dashboard.png',
      '/screenshots/temanku/2_statistik_ringkasan.png',
      '/screenshots/temanku/3_statistik_detail.png',
      '/screenshots/temanku/4_add_transaction.png',
      '/screenshots/temanku/5_budgeting.png',
      '/screenshots/temanku/6_analisa_tren_keuangan.png',
      '/screenshots/temanku/7_perbandingan_bulanan.png',
      '/screenshots/temanku/8_tabungan.png',
    ],
  },
  {
    key: 'bensinku' as const,
    color: '#0EA5E9',
    dim: '#0c4a6e',
    github: 'https://github.com/diopratama99/BensinKu',
    screenshots: [
      '/screenshots/bensinku/Screenshot_20260414-142803.png',
      '/screenshots/bensinku/Screenshot_20260414-142821.png',
      '/screenshots/bensinku/Screenshot_20260414-142826.png',
      '/screenshots/bensinku/Screenshot_20260414-142830.png',
      '/screenshots/bensinku/Screenshot_20260414-142834.png',
      '/screenshots/bensinku/Screenshot_20260414-142843.png',
      '/screenshots/bensinku/Screenshot_20260414-142858.png',
      '/screenshots/bensinku/Screenshot_20260414-142906.png',
      '/screenshots/bensinku/Screenshot_20260414-142913.png',
      '/screenshots/bensinku/Screenshot_20260414-142923.png',
      '/screenshots/bensinku/Screenshot_20260414-143316.png',
    ],
  },
]

/* ─── Full Gallery Modal ─── */
function GalleryModal({ screenshots, initialIndex = 0, onClose }: {
  screenshots: string[]
  initialIndex?: number
  onClose: () => void
}) {
  const [idx, setIdx] = useState(initialIndex)
  const prev = () => setIdx(i => (i - 1 + screenshots.length) % screenshots.length)
  const next = () => setIdx(i => (i + 1) % screenshots.length)

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(10px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.88, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.88, opacity: 0 }} transition={{ duration: 0.25 }}
        className="relative flex flex-col items-center"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute -top-12 right-0 p-2 rounded-full cursor-pointer"
          style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}>
          <X size={18} />
        </button>
        <div className="relative" style={{ width: 280, height: 560 }}>
          <Image src={screenshots[idx]} alt={`ss-${idx}`} fill className="object-contain rounded-2xl" sizes="280px" />
        </div>
        <div className="flex items-center gap-6 mt-4">
          <button onClick={prev} className="p-3 rounded-full cursor-pointer" style={{ background: 'rgba(59,130,246,0.2)', color: '#60A5FA' }}>
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm tabular-nums" style={{ color: 'rgba(255,255,255,0.45)' }}>{idx + 1} / {screenshots.length}</span>
          <button onClick={next} className="p-3 rounded-full cursor-pointer" style={{ background: 'rgba(59,130,246,0.2)', color: '#60A5FA' }}>
            <ChevronRight size={20} />
          </button>
        </div>
        <div className="flex gap-1.5 mt-3">
          {screenshots.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} className="rounded-full transition-all cursor-pointer"
              style={{ width: i === idx ? 20 : 6, height: 6, background: i === idx ? '#3B82F6' : 'rgba(255,255,255,0.2)' }} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ─── Main ─── */
export default function Projects() {
  const { t } = useLanguage()
  const ref = useRef(null)
  const inView = useInView(ref, { once: false, margin: '-80px' })

  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)
  const [gallery, setGallery] = useState<{ screenshots: string[]; index: number } | null>(null)

  const go = (dir: number) => {
    setDirection(dir)
    setCurrent(c => (c + dir + projects.length) % projects.length)
  }

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? '45%' : '-45%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:  (dir: number) => ({ x: dir > 0 ? '-45%' : '45%', opacity: 0 }),
  }

  const proj = projects[current]
  const info = t.projects[proj.key]

  return (
    <section id="projects" className="w-full h-full flex flex-col justify-center overflow-hidden" ref={ref}>

      {/* Section label — top-left */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.4 }}
        className="px-8 md:px-16 pt-8 pb-4"
      >
        <p className="text-xs tracking-[0.3em] uppercase" style={{ color: 'var(--accent)' }}>
          {t.projects.subtitle}
        </p>
        <h2 className="text-4xl md:text-5xl font-bold mt-1"
          style={{
            background: 'linear-gradient(135deg, #E2E8F0 0%, #60A5FA 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
          {t.projects.title}
        </h2>
      </motion.div>

      {/* Carousel */}
      <div className="flex-1 px-8 md:px-16 overflow-hidden flex flex-col justify-center">
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={slideVariants}
              initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.42, ease: [0.32, 0.72, 0, 1] }}
            >
              {/* Card */}
              <div
                className="rounded-3xl p-8 md:p-10 flex flex-col md:flex-row gap-10 md:gap-16 items-center"
                style={{
                  background: `linear-gradient(135deg, ${proj.dim}55 0%, rgba(11,20,38,0.8) 100%)`,
                  border: `1px solid ${proj.color}30`,
                  boxShadow: `0 0 80px ${proj.color}12, inset 0 1px 0 rgba(255,255,255,0.05)`,
                }}
              >
                {/* ── Screenshots ── */}
                <div className="relative shrink-0 self-center">
                  {/* Glow blob */}
                  <div className="absolute inset-0 -m-8 rounded-full blur-3xl opacity-25"
                    style={{ background: proj.color }} />

                  <div className="relative flex gap-4 items-end">
                    {proj.screenshots.slice(0, 3).map((src, si) => {
                      const isCenter = si === 1
                      return (
                        <motion.div
                          key={si}
                          whileHover={{ y: -10, scale: 1.03 }}
                          transition={{ duration: 0.22 }}
                          className="relative cursor-pointer rounded-[20px] overflow-hidden shadow-2xl"
                          style={{
                            width: isCenter ? 175 : 145,
                            height: isCenter ? 350 : 290,
                            border: `2px solid ${proj.color}40`,
                            boxShadow: isCenter
                              ? `0 24px 64px rgba(0,0,0,0.6), 0 0 40px ${proj.color}20`
                              : `0 16px 40px rgba(0,0,0,0.5)`,
                            flexShrink: 0,
                          }}
                          onClick={() => setGallery({ screenshots: proj.screenshots, index: si })}
                        >
                          <Image src={src} alt={`${proj.key}-${si}`} fill className="object-cover" sizes="175px" />
                          <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
                            style={{ background: 'rgba(0,0,0,0.35)' }}>
                            <Smartphone size={28} style={{ color: '#fff' }} />
                          </div>
                        </motion.div>
                      )
                    })}

                    {/* +N badge */}
                    {proj.screenshots.length > 3 && (
                      <div className="absolute -bottom-3 -right-3 w-11 h-11 rounded-full flex items-center justify-center text-xs font-bold shadow-lg"
                        style={{ background: proj.color, color: '#fff', boxShadow: `0 0 20px ${proj.color}60` }}>
                        +{proj.screenshots.length - 3}
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Info ── */}
                <div className="flex-1 min-w-0">
                  {/* Project number */}
                  <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: proj.color + '90' }}>
                    {String(current + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
                  </p>

                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-1 h-10 rounded-full" style={{ background: proj.color, boxShadow: `0 0 12px ${proj.color}` }} />
                    <h3 className="text-4xl md:text-5xl font-bold" style={{ color: proj.color }}>
                      {info.name}
                    </h3>
                  </div>

                  <p className="text-base font-semibold tracking-wide mb-5" style={{ color: proj.color + 'cc' }}>
                    {info.tagline}
                  </p>

                  <p className="text-sm md:text-base leading-relaxed mb-5" style={{ color: 'var(--text-muted)', maxWidth: '480px' }}>
                    {info.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-5">
                    {info.tags.map(tag => (
                      <span key={tag} className="px-4 py-1.5 rounded-full text-xs font-semibold"
                        style={{ background: `${proj.color}18`, border: `1px solid ${proj.color}45`, color: proj.color }}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Feature highlights */}
                  <div
                    className="flex flex-col gap-2 mb-6 pt-5"
                    style={{ borderTop: `1px solid ${proj.color}20` }}
                  >
                    {info.features.map((feat, fi) => (
                      <div key={fi} className="flex items-center gap-2.5">
                        <div
                          className="w-1 h-1 rounded-full shrink-0"
                          style={{ background: proj.color, boxShadow: `0 0 4px ${proj.color}` }}
                        />
                        <span className="text-xs" style={{ color: 'rgba(148,163,184,0.65)' }}>{feat}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <motion.button
                      whileHover={{ scale: 1.04, x: 4 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setGallery({ screenshots: proj.screenshots, index: 0 })}
                      className="flex items-center gap-3 px-6 py-3 rounded-full text-sm font-bold cursor-pointer"
                      style={{
                        background: `${proj.color}22`,
                        border: `1px solid ${proj.color}55`,
                        color: proj.color,
                        boxShadow: `0 0 20px ${proj.color}18`,
                      }}
                    >
                      <Smartphone size={16} />
                      {t.projects.viewMore}
                    </motion.button>

                    <motion.a
                      href={proj.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.04, x: 4 }}
                      whileTap={{ scale: 0.96 }}
                      className="flex items-center gap-3 px-6 py-3 rounded-full text-sm font-bold cursor-pointer"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: 'rgba(226,232,240,0.8)',
                        textDecoration: 'none',
                      }}
                    >
                      <SiGithub size={16} />
                      GitHub
                    </motion.a>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel nav */}
        <div className="flex items-center justify-center gap-6 mt-6">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => go(-1)}
            className="p-3 rounded-full cursor-pointer"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
            <ChevronLeft size={20} />
          </motion.button>

          <div className="flex gap-2">
            {projects.map((p, i) => (
              <button key={i} onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i) }}
                className="rounded-full transition-all duration-300 cursor-pointer"
                style={{ width: i === current ? 32 : 8, height: 8, background: i === current ? p.color : 'rgba(255,255,255,0.15)' }} />
            ))}
          </div>

          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => go(1)}
            className="p-3 rounded-full cursor-pointer"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
            <ChevronRight size={20} />
          </motion.button>
        </div>
      </div>

      {/* Gallery Modal */}
      <AnimatePresence>
        {gallery && (
          <GalleryModal screenshots={gallery.screenshots} initialIndex={gallery.index} onClose={() => setGallery(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}
