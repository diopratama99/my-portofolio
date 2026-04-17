'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { Send, CheckCircle, AlertCircle, Loader } from 'lucide-react'

const EMAIL    = 'diodiopratama99@gmail.com'
const GITHUB   = 'https://github.com/diopratama99'
const LINKEDIN = 'https://www.linkedin.com/in/dio-pratama-43a31a235/'
const WEB3FORMS_KEY = '3b519b1d-27fe-45ac-b73b-4fa59cc18e60'

function LocalClock() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const update = () => {
      const t = new Date().toLocaleTimeString('id-ID', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
      })
      setTime(t)
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])
  return <>{time} WIB</>
}

export default function Contact() {
  const { lang } = useLanguage()
  const ref = useRef(null)
  const inView = useInView(ref, { once: false, margin: '-80px' })

  const [form, setForm]     = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const talkLabel = lang === 'id' ? 'Ayo Ngobrol'   : "Let's Talk"
  const subLabel  = lang === 'id'
    ? 'Punya proyek? Ayo buat sesuatu yang membuatmu tampil beda, bersama.'
    : "Have a project? Let's create something that makes you stand out, together."

  const ph = {
    name:    lang === 'id' ? 'Nama kamu'           : 'Your name',
    email:   lang === 'id' ? 'Email kamu'           : 'Your email',
    message: lang === 'id' ? 'Ceritakan proyekmu…' : 'Tell me about your project…',
    send:    lang === 'id' ? 'Kirim Pesan'          : 'Send Message',
    title:   lang === 'id' ? 'Kirim Pesan'          : 'Send a Message',
    success: lang === 'id' ? 'Pesan terkirim! Akan segera saya balas.' : "Message sent! I'll get back to you soon.",
    error:   lang === 'id' ? 'Gagal mengirim. Coba lagi.' : 'Failed to send. Please try again.',
  }

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          name: form.name,
          email: form.email,
          message: form.message,
          subject: `Portfolio contact from ${form.name}`,
        }),
      })
      const data = await res.json()
      setStatus(data.success ? 'success' : 'error')
      if (data.success) setForm({ name: '', email: '', message: '' })
    } catch {
      setStatus('error')
    }
    setTimeout(() => setStatus('idle'), 5000)
  }

  const inputBase: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 0,
    color: '#E2E8F0',
    fontSize: 13,
    padding: '10px 2px',
    outline: 'none',
    width: '100%',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
  }

  return (
    <section
      id="contact"
      className="w-full h-full flex flex-col px-8 md:px-16 py-8 overflow-hidden"
      style={{ background: 'var(--bg-primary)' }}
      ref={ref}
    >
      {/* ── Top: hero text ── */}
      <div className="flex flex-col justify-end" style={{ flex: '0 0 auto' }}>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="text-sm md:text-base mb-3"
          style={{ color: 'var(--text-muted)', maxWidth: 500 }}
        >
          {subLabel}
        </motion.p>

        <motion.a
          href={`mailto:${EMAIL}`}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.07 }}
          whileHover={{ x: 6 }}
          className="group inline-flex items-end gap-3 cursor-pointer"
          style={{ textDecoration: 'none' }}
        >
          <span
            className="font-bold leading-none tracking-tight"
            style={{
              fontSize: 'clamp(3rem, 9vw, 7.5rem)',
              color: '#E2E8F0',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#60A5FA')}
            onMouseLeave={e => (e.currentTarget.style.color = '#E2E8F0')}
          >
            {talkLabel}
          </span>
          <span
            className="font-bold leading-none mb-2 transition-transform duration-200 group-hover:translate-x-2 group-hover:-translate-y-2"
            style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)', color: 'var(--accent)' }}
          >
            ↗
          </span>
        </motion.a>
      </div>

      {/* ── Divider ── */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="my-5 h-px origin-left"
        style={{ background: 'linear-gradient(to right, rgba(59,130,246,0.4), transparent)' }}
      />

      {/* ── Middle: links left + form right ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.45, delay: 0.2 }}
        className="flex flex-col md:flex-row gap-8 md:gap-12 flex-1 min-h-0"
      >
        {/* Left: contact info */}
        <div className="flex flex-col justify-center gap-5 md:w-72 shrink-0">
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase mb-2.5 font-semibold"
              style={{ color: 'rgba(148,163,184,0.4)' }}>
              {lang === 'id' ? 'Kontak' : 'Contact'}
            </p>
            <div className="flex flex-col gap-2">
              {[
                { label: 'Email',    href: `mailto:${EMAIL}`,  display: EMAIL },
                { label: 'GitHub',   href: GITHUB,             display: 'github.com/diopratama99' },
                { label: 'LinkedIn', href: LINKEDIN,           display: 'linkedin.com/in/dio-pratama' },
              ].map(({ label, href, display }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs md:text-sm transition-colors"
                  style={{ color: 'rgba(148,163,184,0.6)', textDecoration: 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#60A5FA')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(148,163,184,0.6)')}
                >
                  <span className="w-14 shrink-0 text-[10px]" style={{ color: 'rgba(148,163,184,0.3)' }}>{label}</span>
                  {display}
                </a>
              ))}
            </div>
          </div>

          <div className="flex gap-6">
            <div>
              <p className="text-[10px] tracking-widest uppercase mb-1" style={{ color: 'rgba(148,163,184,0.35)' }}>
                {lang === 'id' ? 'Lokasi' : 'Location'}
              </p>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Indonesia</p>
              <p className="text-[11px] mt-0.5" style={{ color: 'rgba(148,163,184,0.4)' }}>Remote Ready</p>
            </div>
            <div>
              <p className="text-[10px] tracking-widest uppercase mb-1" style={{ color: 'rgba(148,163,184,0.35)' }}>
                Local Time
              </p>
              <p className="text-sm font-semibold tabular-nums" style={{ color: 'var(--text-primary)' }}>
                <LocalClock />
              </p>
            </div>
          </div>
        </div>

        {/* Right: form */}
        <div className="flex-1 flex flex-col justify-center min-h-0">
          <p className="text-[10px] tracking-[0.25em] uppercase font-semibold mb-6"
            style={{ color: 'rgba(59,130,246,0.55)' }}>
            {ph.title}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex gap-8">
              <div className="flex-1">
                <input
                  type="text" required placeholder={ph.name}
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  style={inputBase}
                  onFocus={e => (e.currentTarget.style.borderBottomColor = '#3B82F6')}
                  onBlur={e  => (e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.1)')}
                />
              </div>
              <div className="flex-1">
                <input
                  type="email" required placeholder={ph.email}
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  style={inputBase}
                  onFocus={e => (e.currentTarget.style.borderBottomColor = '#3B82F6')}
                  onBlur={e  => (e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.1)')}
                />
              </div>
            </div>

            <textarea
              required rows={3} placeholder={ph.message}
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              style={{ ...inputBase, resize: 'none' }}
              onFocus={e => (e.currentTarget.style.borderBottomColor = '#3B82F6')}
              onBlur={e  => (e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.1)')}
            />

            <AnimatePresence>
              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg -mt-2"
                  style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#34D399' }}
                >
                  <CheckCircle size={13} /> {ph.success}
                </motion.div>
              )}
              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg -mt-2"
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#F87171' }}
                >
                  <AlertCircle size={13} /> {ph.error}
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <motion.button
                type="submit"
                disabled={status === 'sending'}
                whileHover={status !== 'sending' ? { scale: 1.04, x: 4 } : {}}
                whileTap={status !== 'sending' ? { scale: 0.96 } : {}}
                className="flex items-center gap-2.5 px-7 py-2.5 rounded-full text-sm font-bold cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
                  color: '#fff',
                  border: 'none',
                  opacity: status === 'sending' ? 0.65 : 1,
                  boxShadow: '0 0 24px rgba(59,130,246,0.3)',
                }}
              >
                {status === 'sending'
                  ? <><Loader size={14} className="animate-spin" /> {lang === 'id' ? 'Mengirim…' : 'Sending…'}</>
                  : <><Send size={14} /> {ph.send}</>
                }
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>

      {/* ── Footer bar ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="pt-4 mt-4 flex flex-col md:flex-row md:items-center justify-between gap-3"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div>
          <p className="text-[10px] tracking-[0.2em] uppercase" style={{ color: 'rgba(148,163,184,0.3)' }}>++ diopratama99</p>
          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Dio Pratama</p>
        </div>
        <p className="text-[11px]" style={{ color: 'rgba(148,163,184,0.22)' }}>
          © 2026 Dio Pratama · Built with Next.js & Three.js
        </p>
      </motion.div>
    </section>
  )
}
