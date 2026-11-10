'use client'

import { useRef, useState } from 'react'
import { ArrowUp, ArrowUpRight, CheckCircle, AlertCircle, Loader, Send } from 'lucide-react'
import { gsap, useGSAP, prefersReducedMotion, scrollToTarget } from '@/lib/gsap'
import { useLanguage } from '@/contexts/LanguageContext'
import { SectionLabel } from './ui/SectionLabel'
import { SplitChars } from './ui/Split'
import { Magnetic } from './ui/Magnetic'
import { RollText } from './ui/RollText'
import { LocalClock } from './ui/LocalClock'

const EMAIL = 'diodiopratama99@gmail.com'
const GITHUB = 'https://github.com/diopratama99'
const LINKEDIN = 'https://www.linkedin.com/in/dio-pratama-43a31a235/'
const WEB3FORMS_KEY = '3b519b1d-27fe-45ac-b73b-4fa59cc18e60'

export default function Contact() {
  const { t, lang } = useLanguage()
  const root = useRef<HTMLElement>(null)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const links = [
    { label: 'Email', href: `mailto:${EMAIL}`, display: EMAIL },
    { label: 'GitHub', href: GITHUB, display: 'github.com/diopratama99' },
    { label: 'LinkedIn', href: LINKEDIN, display: 'linkedin.com/in/dio-pratama' },
  ]

  // Big title: chars rise in on scroll
  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.from('.ct-char', {
        yPercent: 115,
        rotate: 6,
        duration: 1.3,
        ease: 'expo.out',
        stagger: 0.04,
        scrollTrigger: { trigger: '.ct-title', start: 'top 85%', toggleActions: 'play none none reverse' },
      })
    },
    { scope: root, dependencies: [lang], revertOnUpdate: true },
  )

  const { contextSafe } = useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.from('.ct-fade', {
        y: 60,
        autoAlpha: 0,
        duration: 1.2,
        ease: 'expo.out',
        stagger: 0.1,
        scrollTrigger: { trigger: '.ct-grid', start: 'top 85%' },
      })
      gsap.from('.ct-cta', {
        scale: 0,
        rotate: -90,
        duration: 1.4,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.ct-title', start: 'top 75%' },
      })
      gsap.from('.ft-char', {
        yPercent: 100,
        ease: 'none',
        stagger: 0.04,
        scrollTrigger: { trigger: '.ft-name', start: 'top bottom', end: 'bottom bottom', scrub: true },
      })
    },
    { scope: root },
  )

  const tint = contextSafe((on: boolean) => {
    gsap.to('.ct-char', {
      color: on ? '#a9b3ff' : '#eeece6',
      duration: 0.4,
      stagger: { each: 0.025, from: on ? 'start' : 'end' },
      overwrite: 'auto',
    })
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

  const year = new Date().getFullYear()

  return (
    <section id="contact" ref={root} className="relative overflow-hidden px-pad pb-6 pt-[clamp(6rem,12vw,10rem)]">
      <SectionLabel index="07" title={t.contact.label} note={t.contact.note} />

      <div className="mt-10 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <h2 className="ct-title font-display text-[clamp(4rem,15vw,15rem)] font-bold uppercase leading-[0.82] tracking-[-0.025em]">
          <a
            href={`mailto:${EMAIL}`}
            onMouseEnter={() => tint(true)}
            onMouseLeave={() => tint(false)}
            className="inline-block"
          >
            <span className="sr-only">{t.contact.title}</span>
            <SplitChars text={t.contact.title} charClass="ct-char" />
          </a>
        </h2>
        <Magnetic strength={0.5} className="ct-cta self-start md:mb-6 md:self-auto">
          <a
            href={`mailto:${EMAIL}`}
            className="flex h-32 w-32 flex-col items-center justify-center gap-1 rounded-full bg-accent text-center text-sm font-medium text-white transition-colors duration-500 hover:bg-bone hover:text-ink md:h-40 md:w-40"
          >
            <ArrowUpRight size={22} />
            {t.contact.cta}
          </a>
        </Magnetic>
      </div>

      <p className="mt-10 max-w-xl text-lg text-muted md:text-xl">{t.contact.sub}</p>

      <div className="ct-grid mt-16 grid gap-16 md:mt-24 md:grid-cols-12">
        <div className="flex flex-col gap-12 md:col-span-5">
          <div className="ct-fade">
            <p className="label mb-4">{t.contact.links}</p>
            <ul>
              {links.map((l) => (
                <li key={l.label} className="border-t border-line last:border-b">
                  <a
                    href={l.href}
                    target={l.href.startsWith('mailto') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-4 py-5"
                  >
                    <span className="flex min-w-0 items-baseline gap-4">
                      <span className="label w-20 shrink-0">{l.label}</span>
                      <RollText className="truncate text-base md:text-lg">{l.display}</RollText>
                    </span>
                    <ArrowUpRight size={18} className="shrink-0 text-muted transition-transform duration-500 group-hover:rotate-45 group-hover:text-bone" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="ct-fade grid grid-cols-2 gap-6">
            <div>
              <p className="label mb-2">{t.contact.location}</p>
              <p className="text-lg">{t.contact.locationValue}</p>
              <p className="text-sm text-dim">{t.contact.remote}</p>
            </div>
            <div>
              <p className="label mb-2">{t.contact.localTime}</p>
              <p className="text-lg">
                <LocalClock />
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="ct-fade flex flex-col gap-8 md:col-span-6 md:col-start-7">
          <p className="label !text-accent-soft">{t.contact.formTitle}</p>
          <div className="grid gap-8 sm:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="label">{t.contact.name}</span>
              <input
                type="text"
                required
                placeholder={t.contact.namePh}
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="field"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="label">{t.contact.email}</span>
              <input
                type="email"
                required
                placeholder={t.contact.emailPh}
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="field"
              />
            </label>
          </div>
          <label className="flex flex-col gap-1">
            <span className="label">{t.contact.message}</span>
            <textarea
              required
              rows={4}
              placeholder={t.contact.messagePh}
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              className="field resize-none"
            />
          </label>

          {status === 'success' && (
            <p role="status" className="flex items-center gap-2 text-sm text-emerald-400">
              <CheckCircle size={15} /> {t.contact.success}
            </p>
          )}
          {status === 'error' && (
            <p role="alert" className="flex items-center gap-2 text-sm text-red-400">
              <AlertCircle size={15} /> {t.contact.error}
            </p>
          )}

          <Magnetic className="self-start">
            <button type="submit" disabled={status === 'sending'} className="btn btn-primary disabled:opacity-60">
              {status === 'sending' ? (
                <>
                  <Loader size={15} className="animate-spin" /> {t.contact.sending}
                </>
              ) : (
                <>
                  <RollText>{t.contact.send}</RollText>
                  <Send size={15} />
                </>
              )}
            </button>
          </Magnetic>
        </form>
      </div>

      <footer className="mt-28 border-t border-line pt-8 md:mt-40">
        <div className="label flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <span>© {year} Dio Pratama</span>
          <span>{t.contact.builtWith}</span>
          <button onClick={() => scrollToTarget(0)} className="flex items-center gap-2 self-start text-bone md:self-auto">
            <RollText>{t.contact.backToTop}</RollText>
            <ArrowUp size={14} />
          </button>
        </div>
        <p
          aria-hidden="true"
          className="ft-name mt-10 overflow-hidden whitespace-nowrap text-center font-display text-[clamp(3rem,13.5vw,15rem)] font-bold uppercase leading-[0.8] tracking-[-0.06em] text-bone"
        >
          <SplitChars text="Dio Pratama" charClass="ft-char" />
        </p>
      </footer>
    </section>
  )
}
