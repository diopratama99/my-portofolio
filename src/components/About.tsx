'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Server, Wifi, GraduationCap, MapPin } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function About() {
  const { t } = useLanguage()
  const ref = useRef(null)
  const inView = useInView(ref, { once: false, margin: '-80px' })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
  }

  const infoItems = [
    { key: 'role',       label: t.about.role,      value: t.about.roleValue,      Icon: Server        },
    { key: 'education',  label: t.about.education, value: t.about.educationValue, Icon: GraduationCap },
    { key: 'focus',      label: t.about.focus,     value: t.about.focusValue,     Icon: MapPin        },
    { key: 'homelab',    label: t.about.homelab,   value: t.about.homelabValue,   Icon: Wifi          },
  ]

  return (
    <section id="about" className="w-full h-full px-6 py-16 flex flex-col justify-center" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {/* Section header */}
          <motion.div variants={itemVariants} className="mb-12 text-center">
            <p className="text-sm tracking-[0.3em] uppercase mb-3" style={{ color: 'var(--accent)' }}>
              {t.about.subtitle}
            </p>
            <h2
              className="text-4xl md:text-5xl font-bold"
              style={{
                background: 'linear-gradient(135deg, #E2E8F0 0%, #60A5FA 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {t.about.title}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div>
              <motion.p variants={itemVariants} className="text-base md:text-lg leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
                {t.about.p1}
              </motion.p>
              <motion.p variants={itemVariants} className="text-base md:text-lg leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {t.about.p2}
              </motion.p>

              <motion.div variants={itemVariants} className="mt-8 flex items-center gap-4">
                <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, var(--accent), transparent)' }} />
                <span className="text-sm tracking-widest" style={{ color: 'var(--accent)' }}>
                  Dio Pratama
                </span>
              </motion.div>
            </div>

            {/* Info cards */}
            <div className="grid grid-cols-1 gap-4">
              {infoItems.map(({ key, label, value, Icon }) => (
                <motion.div
                  key={key}
                  variants={itemVariants}
                  whileHover={{ x: 6 }}
                  className="flex items-center gap-4 p-4 rounded-xl"
                  style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(59,130,246,0.1)' }}>
                    <Icon size={18} style={{ color: 'var(--accent)' }} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--accent)' }}>{label}</p>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{value}</p>
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
