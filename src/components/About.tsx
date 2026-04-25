'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Server, Wifi, GraduationCap, MapPin } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function About() {
  const { t } = useLanguage()
  const ref = useRef(null)
  const inView = useInView(ref, { once: false, margin: '-80px' })

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  const infoItems = [
    { key: 'role',      label: t.about.role,      value: t.about.roleValue,      Icon: Server        },
    { key: 'education', label: t.about.education, value: t.about.educationValue, Icon: GraduationCap },
    { key: 'focus',     label: t.about.focus,     value: t.about.focusValue,     Icon: MapPin        },
    { key: 'homelab',   label: t.about.homelab,   value: t.about.homelabValue,   Icon: Wifi          },
  ]

  return (
    <section
      id="about"
      className="w-full h-full px-6 md:px-12 lg:px-20 py-16 flex flex-col justify-center"
      ref={ref}
    >
      <div className="max-w-7xl mx-auto w-full">

        {/* Section header — brutalist style */}
        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={{ visible: { transition: { staggerChildren: 0.1 } }, hidden: {} }}
        >
          {/* Section index */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-4 mb-6"
          >
            <span
              className="font-mono text-xs tracking-widest uppercase"
              style={{ color: 'rgba(59,130,246,0.4)' }}
            >
              02 / ABOUT
            </span>
            <div className="h-px flex-1 max-w-16" style={{ background: 'rgba(59,130,246,0.3)' }} />
            <span
              className="text-xs tracking-widest uppercase"
              style={{ color: 'var(--text-muted)' }}
            >
              {t.about.subtitle}
            </span>
          </motion.div>

          {/* Big title — 1 line */}
          <div className="overflow-hidden mb-8">
            <motion.h2
              initial={{ y: '100%' }}
              animate={inView ? { y: 0 } : { y: '100%' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="font-display font-bold uppercase leading-none whitespace-nowrap"
              style={{ fontSize: 'clamp(2.8rem, 8vw, 7rem)', letterSpacing: '-0.02em' }}
            >
              <span style={{ WebkitTextStroke: '1.5px rgba(226,232,240,0.6)', WebkitTextFillColor: 'transparent' }}>About&nbsp;</span>
              <span style={{ background: 'linear-gradient(135deg, #E2E8F0 0%, #60A5FA 45%, #818CF8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Me</span>
            </motion.h2>
          </div>

          {/* Horizontal divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-px mb-10 origin-left"
            style={{
              background: 'linear-gradient(to right, rgba(59,130,246,0.7), rgba(99,102,241,0.35), transparent)',
            }}
          />

          {/* Two-column body */}
          <div className="grid md:grid-cols-5 gap-12 lg:gap-20">

            {/* Bio text — 3 cols */}
            <div className="md:col-span-3 flex flex-col gap-6">
              <motion.p
                variants={itemVariants}
                className="text-base md:text-lg leading-relaxed"
                style={{ color: 'var(--text-muted)' }}
              >
                {t.about.p1}
              </motion.p>
              <motion.p
                variants={itemVariants}
                className="text-base md:text-lg leading-relaxed"
                style={{ color: 'var(--text-muted)' }}
              >
                {t.about.p2}
              </motion.p>

              {/* Signature */}
              <motion.div variants={itemVariants} className="flex items-center gap-4 mt-2">
                <div
                  className="h-px w-10"
                  style={{ background: 'rgba(59,130,246,0.5)' }}
                />
                <span
                  className="text-sm font-mono tracking-widest"
                  style={{ color: 'rgba(59,130,246,0.7)' }}
                >
                  — Dio Pratama
                </span>
              </motion.div>
            </div>

            {/* Info items — 2 cols */}
            <div className="md:col-span-2 flex flex-col gap-0">
              {infoItems.map(({ key, label, value, Icon }, i) => (
                <motion.div
                  key={key}
                  variants={itemVariants}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ x: 6 }}
                  className="flex items-start gap-4 py-5"
                  style={{
                    borderBottom: i < infoItems.length - 1
                      ? '1px solid rgba(59,130,246,0.1)'
                      : 'none',
                  }}
                >
                  {/* Left accent bar */}
                  <div
                    className="w-0.5 self-stretch flex-shrink-0 mt-1"
                    style={{ background: 'linear-gradient(to bottom, #3B82F6, #6366F1)' }}
                  />
                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Icon size={13} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                      <span
                        className="text-xs uppercase tracking-widest font-medium"
                        style={{ color: 'var(--accent)' }}
                      >
                        {label}
                      </span>
                    </div>
                    <span
                      className="text-sm font-semibold leading-snug"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {value}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
