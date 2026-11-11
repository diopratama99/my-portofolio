'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { AlertCircle, ArrowLeft, CheckCircle, Loader, Send } from 'lucide-react'
import { gsap, useGSAP, prefersReducedMotion, navState } from '@/lib/gsap'
import { useLanguage } from '@/contexts/LanguageContext'
import { Magnetic } from './ui/Magnetic'
import { RollText } from './ui/RollText'

const WEB3FORMS_KEY = '3b519b1d-27fe-45ac-b73b-4fa59cc18e60'

export default function ContactForm() {
  const { t } = useLanguage()
  const root = useRef<HTMLElement>(null)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.from('.cf-in', { y: 30, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.07 })
    },
    { scope: root },
  )

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

  return (
    <main ref={root} className="theme-light flex min-h-[100svh] flex-col px-pad py-8">
      <Link
        href="/"
        onClick={() => {
          navState.scrollTo = '#contact'
        }}
        className="cf-in label flex items-center gap-2 self-start hover:text-bone"
      >
        <ArrowLeft size={15} />
        <RollText>{t.contact.back}</RollText>
      </Link>

      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center py-12">
        <h1 className="cf-in font-display text-[clamp(2.5rem,6vw,4.5rem)] font-bold uppercase leading-[0.9] tracking-[-0.025em]">
          {t.contact.formTitle}
        </h1>
        <p className="cf-in mt-4 text-muted">{t.contact.sub}</p>

        <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-8">
          <div className="cf-in grid gap-8 sm:grid-cols-2">
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
          <label className="cf-in flex flex-col gap-1">
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

          <Magnetic className="cf-in self-start">
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
    </main>
  )
}
