'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Download } from 'lucide-react'
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Three.js Particle Background */}
      <ParticleBackground />

      {/* Radial gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(59,130,246,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40"
        style={{
          background: 'linear-gradient(to bottom, transparent, var(--bg-primary))',
        }}
      />

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl mx-auto px-6 text-center"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="flex justify-center mb-6">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
            style={{
              background: 'rgba(16,185,129,0.1)',
              border: '1px solid rgba(16,185,129,0.35)',
              color: '#34D399',
            }}
          >
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: '#10B981', boxShadow: '0 0 6px #10B981' }}
            />
            Available for Work
          </div>
        </motion.div>

        {/* Greeting */}
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl mb-2"
          style={{ color: 'var(--text-muted)' }}
        >
          {t.hero.greeting}
        </motion.p>

        {/* Name */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-6xl md:text-8xl font-bold mb-4 leading-tight tracking-tight"
          style={{
            background: 'linear-gradient(135deg, #E2E8F0 0%, #60A5FA 50%, #818CF8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Dio Pratama
        </motion.h1>

        {/* Typewriter role */}
        <motion.div
          variants={itemVariants}
          className="h-10 flex items-center justify-center mb-8"
        >
          <span
            className="text-xl md:text-2xl font-mono"
            style={{ color: 'var(--accent-light)' }}
          >
            {displayText}
            <span
              className="animate-pulse ml-0.5"
              style={{ color: 'var(--accent)' }}
            >
              |
            </span>
          </span>
        </motion.div>

        {/* CTAs */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() =>
              document.getElementById('scroll-container')?.scrollTo({
                top: 4 * window.innerHeight,
                behavior: 'smooth',
              })
            }
            className="px-8 py-3 rounded-full font-semibold text-white cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
              boxShadow: '0 0 30px rgba(59,130,246,0.4)',
            }}
          >
            {t.hero.cta}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() =>
              document.getElementById('scroll-container')?.scrollTo({
                top: 5 * window.innerHeight,
                behavior: 'smooth',
              })
            }
            className="px-8 py-3 rounded-full font-semibold cursor-pointer"
            style={{
              background: 'transparent',
              border: '1px solid rgba(59,130,246,0.5)',
              color: 'var(--accent-light)',
            }}
          >
            {t.hero.ctaSecondary}
          </motion.button>

          <motion.a
            href="/cv-dio-pratama.pdf"
            download
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-8 py-3 rounded-full font-semibold cursor-pointer"
            style={{
              background: 'transparent',
              border: '1px solid rgba(148,163,184,0.25)',
              color: 'rgba(148,163,184,0.7)',
              textDecoration: 'none',
            }}
          >
            <Download size={16} />
            {t.hero.downloadCv}
          </motion.a>
        </motion.div>

        {/* Tech badges */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center justify-center gap-3 mt-12"
        >
          {['Flutter', 'React', 'Laravel', 'Python', 'Three.js'].map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{
                background: 'rgba(17,34,64,0.8)',
                border: '1px solid rgba(59,130,246,0.2)',
                color: 'var(--text-muted)',
              }}
            >
              {tech}
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
        onClick={() =>
          document.getElementById('scroll-container')?.scrollTo({
          top: 1 * window.innerHeight,
          behavior: 'smooth',
        })
        }
      >
        <span className="text-xs tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
          {t.hero.scrollDown}
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ color: 'var(--accent)' }}
        >
          <ChevronDown size={20} />
        </motion.div>
      </motion.div>
    </section>
  )
}
