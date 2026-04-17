'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, User, Briefcase, Zap, FolderOpen, Mail } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

const navLinks = [
  { icon: Home,       page: 0, labelEn: 'Home',       labelId: 'Home'       },
  { icon: User,       page: 1, labelEn: 'About',      labelId: 'Tentang'    },
  { icon: Briefcase,  page: 2, labelEn: 'Experience', labelId: 'Pengalaman' },
  { icon: Zap,        page: 3, labelEn: 'Skills',     labelId: 'Keahlian'   },
  { icon: FolderOpen, page: 4, labelEn: 'Projects',   labelId: 'Proyek'     },
  { icon: Mail,       page: 5, labelEn: 'Contact',    labelId: 'Kontak'     },
]

export default function Navbar() {
  const { lang, setLang } = useLanguage()
  const [activePage, setActivePage] = useState(0)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // brief delay so it slides in after opening screen
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const container = document.getElementById('scroll-container')
    if (!container) return
    const onScroll = () => {
      const page = Math.round(container.scrollTop / window.innerHeight)
      setActivePage(page)
    }
    container.addEventListener('scroll', onScroll)
    return () => container.removeEventListener('scroll', onScroll)
  }, [])

  const goTo = (page: number) => {
    setMobileOpen(false)
    const container = document.getElementById('scroll-container')
    container?.scrollTo({ top: page * window.innerHeight, behavior: 'smooth' })
  }

  return (
    <>
      {/* Floating pill — desktop */}
      <motion.div
        initial={{ y: -60, opacity: 0, x: '-50%' }}
        animate={visible ? { y: 0, opacity: 1, x: '-50%' } : { y: -60, opacity: 0, x: '-50%' }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="fixed top-4 left-1/2 z-40 hidden md:flex"
      >
        <div
          className="flex items-center gap-1 px-2 py-2 rounded-full"
          style={{
            background: 'rgba(11,20,38,0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(59,130,246,0.1)',
          }}
        >
          {/* Avatar + name */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full mr-1"
            style={{ background: 'rgba(255,255,255,0.04)' }}
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg,#3B82F6,#6366F1)' }}
            >
              D
            </div>
            <span
              className="text-sm font-semibold tracking-wide"
              style={{ color: 'rgba(226,232,240,0.85)' }}
            >
              Dio Pratama
            </span>
          </div>

          {/* Divider */}
          <div className="w-px h-5 mx-1" style={{ background: 'rgba(255,255,255,0.1)' }} />

          {/* Nav icons */}
          {navLinks.map(({ icon: Icon, page, labelEn, labelId }) => {
            const isActive = activePage === page
            const label = lang === 'id' ? labelId : labelEn
            return (
              <motion.button
                key={page}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.93 }}
                onClick={() => goTo(page)}
                title={label}
                className="relative flex items-center gap-1.5 px-3 py-2 rounded-full cursor-pointer text-xs font-semibold transition-all duration-200"
                style={
                  isActive
                    ? { background: 'rgba(59,130,246,0.2)', color: '#60A5FA', border: '1px solid rgba(59,130,246,0.35)' }
                    : { color: 'rgba(148,163,184,0.7)', border: '1px solid transparent' }
                }
              >
                <Icon size={14} />
                {isActive && (
                  <motion.span
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 'auto', opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    {label}
                  </motion.span>
                )}
              </motion.button>
            )
          })}

          {/* Divider */}
          <div className="w-px h-5 mx-1" style={{ background: 'rgba(255,255,255,0.1)' }} />

          {/* Language toggle */}
          <div
            className="flex items-center rounded-full p-0.5 gap-0.5"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          >
            {(['en', 'id'] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all"
                style={
                  lang === l
                    ? { background: 'var(--accent)', color: '#fff' }
                    : { color: 'rgba(148,163,184,0.5)' }
                }
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Mobile — bottom pill */}
      <motion.div
        initial={{ y: 60, opacity: 0, x: '-50%' }}
        animate={visible ? { y: 0, opacity: 1, x: '-50%' } : { y: 60, opacity: 0, x: '-50%' }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="fixed bottom-4 left-1/2 z-40 flex md:hidden"
      >
        <div
          className="flex items-center gap-0.5 px-2 py-2 rounded-full"
          style={{
            background: 'rgba(11,20,38,0.92)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          }}
        >
          {navLinks.map(({ icon: Icon, page }) => {
            const isActive = activePage === page
            return (
              <button
                key={page}
                onClick={() => goTo(page)}
                className="p-3 rounded-full cursor-pointer transition-all"
                style={
                  isActive
                    ? { background: 'rgba(59,130,246,0.2)', color: '#60A5FA' }
                    : { color: 'rgba(148,163,184,0.5)' }
                }
              >
                <Icon size={18} />
              </button>
            )
          })}
          <div className="w-px h-5 mx-0.5" style={{ background: 'rgba(255,255,255,0.1)' }} />
          {(['en', 'id'] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className="px-2 py-1 rounded-full text-[10px] font-bold uppercase cursor-pointer transition-all"
              style={lang === l ? { background: 'var(--accent)', color: '#fff' } : { color: 'rgba(148,163,184,0.4)' }}
            >
              {l}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Mobile label tooltip */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-20 left-1/2 z-40 -translate-x-1/2 px-4 py-2 rounded-xl text-sm"
            style={{ background: 'rgba(11,20,38,0.95)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            Dio Pratama
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
