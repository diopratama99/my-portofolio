'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Download } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import ParticleBackground from './ParticleBackground'

export default function Hero() {
  const { t } = useLanguage()
  const [roleIndex, setRoleIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const roles = t.hero.roles
    const current = roles[roleIndex]
    const speed = isDeleting ? 60 : 100

    const timeout = setTimeout(() => {
      if (!isDeleting && displayText === current) {
        setTimeout(() => setIsDeleting(true), 1200)
        return
      }
      if (isDeleting && displayText === '') {
        setIsDeleting(false)
        setRoleIndex((i) => (i + 1) % roles.length)
        return
      }
      setDisplayText((prev) =>
        isDeleting ? prev.slice(0, -1) : current.slice(0, prev.length + 1)
      )
    }, speed)

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, roleIndex, t.hero.roles])

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
    >
      <ParticleBackground />

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 z-10"
        style={{
          background: 'linear-gradient(to bottom, transparent, var(--bg-primary))',
        }}
      />

      {/* Corner index — brutalist accent */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        className="absolute top-8 right-6 md:right-12 lg:right-20 z-10 font-mono text-xs tracking-widest select-none"
        style={{ color: 'rgba(59,130,246,0.35)' }}
      >
        01 / PORTFOLIO
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 w-full px-6 md:px-12 lg:px-20 pt-24 pb-16">

        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center gap-4 mb-10"
        >
          <div
            className="h-px w-12"
            style={{ background: 'rgba(59,130,246,0.5)' }}
          />
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold tracking-widest uppercase"
            style={{
              background: 'rgba(16,185,129,0.08)',
              border: '1px solid rgba(16,185,129,0.3)',
              color: '#34D399',
              borderRadius: '4px',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: '#10B981', boxShadow: '0 0 6px #10B981' }}
            />
            Available for Work
          </div>
        </motion.div>

        {/* Giant name — 1 line: "Dio" outline + "Pratama" gradient */}
        <div className="overflow-hidden leading-none">
          <motion.h1
            initial={{ y: '105%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
            className="font-display font-bold uppercase leading-none whitespace-nowrap"
            style={{ fontSize: 'clamp(2.4rem, 7.5vw, 8.5rem)', letterSpacing: '-0.02em' }}
          >
            <span style={{
              WebkitTextStroke: '2px rgba(226,232,240,0.75)',
              WebkitTextFillColor: 'transparent',
            }}>Dio&nbsp;</span>
            <span style={{
              background: 'linear-gradient(135deg, #E2E8F0 0%, #60A5FA 45%, #818CF8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Pratama</span>
          </motion.h1>
        </div>

        {/* Horizontal divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-px mt-8 mb-8 origin-left"
          style={{
            background:
              'linear-gradient(to right, rgba(59,130,246,0.7), rgba(99,102,241,0.4), transparent)',
          }}
        />

        {/* Bottom row: role (left) + CTAs (right) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-8"
        >
          {/* Typewriter role */}
          <div className="flex flex-col gap-1.5">
            <span
              className="text-xs tracking-widest uppercase font-medium"
              style={{ color: 'var(--text-muted)' }}
            >
              {t.hero.greeting}
            </span>
            <div className="flex items-center gap-3">
              <div
                className="w-6 h-px flex-shrink-0"
                style={{ background: 'rgba(59,130,246,0.6)' }}
              />
              <span
                className="text-xl md:text-2xl font-mono font-medium"
                style={{ color: 'var(--accent-light)' }}
              >
                {displayText}
                <span className="animate-pulse ml-0.5" style={{ color: 'var(--accent)' }}>
                  |
                </span>
              </span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() =>
                document.getElementById('scroll-container')?.scrollTo({
                  top: 4 * window.innerHeight,
                  behavior: 'smooth',
                })
              }
              className="flex items-center gap-2 px-7 py-3 font-semibold text-white cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
                boxShadow: '0 0 28px rgba(59,130,246,0.4)',
                borderRadius: '6px',
              }}
            >
              {t.hero.cta}
              <ArrowRight size={16} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() =>
                document.getElementById('scroll-container')?.scrollTo({
                  top: 5 * window.innerHeight,
                  behavior: 'smooth',
                })
              }
              className="flex items-center gap-2 px-7 py-3 font-semibold cursor-pointer"
              style={{
                background: 'transparent',
                border: '1px solid rgba(59,130,246,0.45)',
                color: 'var(--accent-light)',
                borderRadius: '6px',
              }}
            >
              {t.hero.ctaSecondary}
              <ArrowUpRight size={16} />
            </motion.button>

            <motion.a
              href="/cv-dio-pratama.pdf"
              download
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-7 py-3 font-semibold cursor-pointer"
              style={{
                background: 'transparent',
                border: '1px solid rgba(148,163,184,0.2)',
                color: 'rgba(148,163,184,0.6)',
                textDecoration: 'none',
                borderRadius: '6px',
              }}
            >
              <Download size={15} />
              {t.hero.downloadCv}
            </motion.a>
          </div>
        </motion.div>

        {/* Tech stack badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="flex flex-wrap items-center gap-2 mt-10"
        >
          {['Flutter', 'React', 'Laravel', 'Python', 'Three.js'].map((tech, i) => (
            <motion.span
              key={tech}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + i * 0.07 }}
              className="px-3 py-1 text-xs font-medium tracking-widest uppercase"
              style={{
                background: 'rgba(17,34,64,0.55)',
                border: '1px solid rgba(59,130,246,0.18)',
                color: 'var(--text-muted)',
                borderRadius: '4px',
              }}
            >
              {tech}
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator — vertical line on right */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-10 right-6 md:right-12 lg:right-20 flex flex-col items-center gap-2 cursor-pointer z-10"
        onClick={() =>
          document.getElementById('scroll-container')?.scrollTo({
            top: 1 * window.innerHeight,
            behavior: 'smooth',
          })
        }
      >
        <span
          className="text-xs tracking-widest uppercase"
          style={{
            color: 'var(--text-muted)',
            writingMode: 'vertical-rl',
            letterSpacing: '0.18em',
          }}
        >
          {t.hero.scrollDown}
        </span>
        <motion.div
          animate={{ scaleY: [0.4, 1, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-14 origin-bottom"
          style={{ background: 'linear-gradient(to bottom, var(--accent), transparent)' }}
        />
      </motion.div>
    </section>
  )
}
