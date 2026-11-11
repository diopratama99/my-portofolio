'use client'

import { useRef } from 'react'
import { ShapeAvatar } from './ui/ShapeAvatar'
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap'
import { useLanguage } from '@/contexts/LanguageContext'
import { mobileApps } from '@/data/projects'
import { CAREER_START_YEAR } from '@/data/experience'

const BRAND: Record<string, string> = { Flutter: '#54C5F8', Supabase: '#3ECF8E' }

export default function About() {
  const { t, lang } = useLanguage()
  const root = useRef<HTMLElement>(null)

  const stats = [
    { value: String(mobileApps.length), label: t.about.stats.apps },
    { value: '3.95', label: t.about.stats.gpa },
    { value: `${new Date().getFullYear() - CAREER_START_YEAR}+`, label: t.about.stats.years },
  ]

  // Words marked *like this* in the statement get their brand colour
  const words = t.about.statement.split(' ').map((w) => {
    const text = w.replace(/\*/g, '')
    return { text, color: w.startsWith('*') ? (BRAND[text] ?? '#a9b3ff') : undefined }
  })

  // Statement lights up word by word as you scroll
  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.fromTo(
        '.ab-word',
        { opacity: 0.15 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.1,
          scrollTrigger: { trigger: '.ab-statement', start: 'top 80%', end: 'bottom 50%', scrub: true },
        },
      )
    },
    { scope: root, dependencies: [lang], revertOnUpdate: true },
  )

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.from('.ab-fade', {
        y: 40,
        autoAlpha: 0,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: '.ab-body', start: 'top 80%' },
      })
      // Avatar pops in with a little spin
      gsap.from('.ab-avatar', {
        scale: 0,
        rotate: -120,
        duration: 1.4,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.ab-avatar', start: 'top 88%' },
      })

      gsap.utils.toArray<HTMLElement>('.ab-row-line').forEach((line) => {
        gsap.from(line, {
          scaleX: 0,
          transformOrigin: 'left center',
          duration: 1.2,
          ease: 'expo.inOut',
          scrollTrigger: { trigger: line, start: 'top 92%' },
        })
      })
    },
    { scope: root },
  )

  return (
    <section id="about" ref={root} className="relative px-pad py-[clamp(6rem,14vw,11rem)]">
      <h2 className="ab-statement max-w-[24ch] font-display text-[clamp(2rem,4.8vw,4.5rem)] font-medium leading-[1.05] tracking-[-0.035em]">
        {words.map((w, i) => (
          <span key={i} className="ab-word" style={w.color ? { color: w.color } : undefined}>
            {w.text}{' '}
          </span>
        ))}
      </h2>

      <div className="ab-body mt-20 grid gap-16 md:mt-28 md:grid-cols-12">
        <div className="md:col-span-4">
          <figure className="flex items-center gap-6">
            <div className="ab-avatar w-36 shrink-0 md:w-44">
              <ShapeAvatar src="/dio-avatar.webp" alt="Dio Pratama" className="w-full" />
            </div>
            <figcaption className="ab-fade">
              <p className="font-display text-2xl font-medium tracking-[-0.03em]">Dio Pratama</p>
              <p className="label mt-2">{t.hero.role}</p>
            </figcaption>
          </figure>

          <div className="mt-12 grid grid-cols-3 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="ab-fade">
                <p className="font-display text-[clamp(2rem,3.4vw,3.25rem)] font-semibold leading-none tracking-[-0.05em] tabular-nums">
                  {s.value}
                </p>
                <p className="label mt-3">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-7 md:col-start-6">
          <p className="ab-fade text-lg leading-relaxed text-bone/80 md:text-xl">{t.about.p1}</p>
          <p className="ab-fade mt-6 leading-relaxed text-muted md:text-lg">{t.about.p2}</p>

          <dl className="mt-14">
            {t.about.rows.map((row) => (
              <div key={row.label} className="ab-fade relative grid grid-cols-1 gap-1 py-5 sm:grid-cols-[10rem_1fr] sm:gap-6">
                <span className="ab-row-line absolute inset-x-0 top-0 h-px bg-line-strong" />
                <dt className="label">{row.label}</dt>
                <dd className="text-bone">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
