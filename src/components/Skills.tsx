'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { SiFlutter, SiDart, SiSupabase } from 'react-icons/si'
import { gsap, useGSAP, prefersReducedMotion, isTouchDevice } from '@/lib/gsap'
import { useLanguage } from '@/contexts/LanguageContext'
import { RevealChars } from './ui/Split'
import { toolbox, alsoUsed } from '@/data/skills'

/** One real app screen per capability, in the same order as t.skills.capabilities. */
const PREVIEWS = [
  '/works/temanku/screens/beranda.webp', // custom UI
  '/works/bensinku/screens/beranda.webp', // Supabase backend
  '/works/temanku/screens/transaksi.webp', // offline data
  '/works/temanku/screens/analisa.webp', // charts
  '/works/bensinku/screens/perjalanan.webp', // GPS
  '/works/ingatanku/screens/asisten.webp', // AI
]

export default function Skills() {
  const { t } = useLanguage()
  const root = useRef<HTMLElement>(null)
  const active = useRef(-1)
  const previewTo = useRef<{ x: (v: number) => void; y: (v: number) => void } | null>(null)

  // Preview follows the pointer within the section
  useGSAP(
    () => {
      if (isTouchDevice() || prefersReducedMotion()) return
      const section = root.current!
      const preview = section.querySelector<HTMLElement>('.sk-preview')!
      const x = gsap.quickTo(preview, 'x', { duration: 0.7, ease: 'power3' })
      const y = gsap.quickTo(preview, 'y', { duration: 0.7, ease: 'power3' })
      previewTo.current = { x, y }
      const onMove = (e: MouseEvent) => {
        const r = section.getBoundingClientRect()
        x(e.clientX - r.left - preview.offsetWidth / 2)
        y(e.clientY - r.top - preview.offsetHeight / 2)
      }
      section.addEventListener('mousemove', onMove)
      return () => section.removeEventListener('mousemove', onMove)
    },
    { scope: root },
  )

  const showPreview = (i: number) => {
    if (!previewTo.current || i === active.current) return
    const preview = root.current!.querySelector('.sk-preview')
    const imgs = root.current!.querySelectorAll('.sk-preview-img')
    if (i < 0) {
      gsap.to(preview, { scale: 0, opacity: 0, rotate: -8, duration: 0.5, ease: 'expo.out', overwrite: 'auto' })
    } else {
      if (active.current < 0) gsap.to(preview, { scale: 1, opacity: 1, rotate: 0, duration: 0.7, ease: 'expo.out', overwrite: 'auto' })
      imgs.forEach((img, j) => gsap.to(img, { opacity: j === i ? 1 : 0, duration: 0.35, overwrite: 'auto' }))
    }
    active.current = i
  }

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.from('.sk-lead', {
        y: 40,
        autoAlpha: 0,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: '.sk-grid', start: 'top 80%' },
      })
      gsap.utils.toArray<HTMLElement>('.sk-cap').forEach((row) => {
        gsap
          .timeline({ scrollTrigger: { trigger: row, start: 'top 90%' } })
          .from(row.querySelector('.sk-cap-line'), { scaleX: 0, transformOrigin: 'left center', duration: 1.1, ease: 'expo.inOut' })
          .from(row.querySelectorAll('.sk-cap-cell'), { y: 24, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.06 }, 0.25)
      })
      // Toolbox: chips drop in from above in a random order and bounce as they land
      gsap.from('.sk-tool', {
        y: -70,
        rotation: () => gsap.utils.random(-18, 18),
        autoAlpha: 0,
        duration: 1.1,
        ease: 'bounce.out',
        stagger: { each: 0.07, from: 'random' },
        scrollTrigger: { trigger: '.sk-toolbox', start: 'top 85%' },
      })
      gsap.from('.sk-chip', {
        y: 20,
        autoAlpha: 0,
        duration: 0.8,
        ease: 'expo.out',
        delay: 0.6,
        scrollTrigger: { trigger: '.sk-toolbox', start: 'top 85%' },
      })
    },
    { scope: root },
  )

  // Dock magnification: each chip grows and lifts the closer the pointer is
  useGSAP(
    () => {
      if (isTouchDevice() || prefersReducedMotion()) return
      const dock = root.current!.querySelector<HTMLElement>('.sk-dock')!
      const items = Array.from(dock.querySelectorAll<HTMLElement>('.sk-dock-item')).map((el) => {
        // quickTo can't drive the combined `scale`, so scaleX and scaleY move together
        const sx = gsap.quickTo(el, 'scaleX', { duration: 0.35, ease: 'power3' })
        const sy = gsap.quickTo(el, 'scaleY', { duration: 0.35, ease: 'power3' })
        return {
          el,
          scale: (v: number) => (sx(v), sy(v)),
          y: gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3' }),
        }
      })
      const move = (e: MouseEvent) => {
        items.forEach(({ el, scale, y }) => {
          const r = el.getBoundingClientRect()
          // Rows count for more than columns, so only the row under the pointer swells
          const d = Math.hypot(e.clientX - (r.left + r.width / 2), (e.clientY - (r.top + r.height / 2)) * 1.8)
          const f = Math.max(0, 1 - d / 170)
          scale(1 + 0.3 * f * f)
          y(-14 * f)
        })
      }
      const leave = () => items.forEach(({ scale, y }) => (scale(1), y(0)))
      dock.addEventListener('mousemove', move)
      dock.addEventListener('mouseleave', leave)
      return () => {
        dock.removeEventListener('mousemove', move)
        dock.removeEventListener('mouseleave', leave)
      }
    },
    { scope: root },
  )

  return (
    <section id="skills" ref={root} className="relative px-pad py-[clamp(6rem,12vw,10rem)]">
      <RevealChars
        text={t.skills.title}
        className="font-display text-[clamp(2.75rem,8.5vw,8.5rem)] font-bold uppercase leading-[0.88] tracking-[-0.025em]"
      />

      <div className="sk-grid mt-16 grid gap-14 md:mt-24 md:grid-cols-12">
        <div className="md:col-span-4">
          <div className="sk-lead flex items-center gap-4">
            <SiFlutter size={48} className="text-[#54C5F8]" aria-hidden="true" />
            <SiDart size={42} className="text-[#0175C2]" aria-hidden="true" />
            <span className="text-2xl text-dim">+</span>
            <SiSupabase size={42} className="text-[#3ECF8E]" aria-hidden="true" />
          </div>
          <p className="sk-lead mt-6 font-display text-3xl font-medium tracking-[-0.03em]">Flutter, Dart & Supabase</p>
          <p className="sk-lead mt-4 leading-relaxed text-muted">{t.skills.lead}</p>
        </div>

        <div className="md:col-span-7 md:col-start-6">
          <p className="label mb-4">{t.skills.capabilitiesTitle}</p>
          <ol onMouseLeave={() => showPreview(-1)}>
            {t.skills.capabilities.map((c, i) => (
              <li
                key={c.title}
                onMouseEnter={() => showPreview(i)}
                className="sk-cap group relative grid gap-2 py-6 sm:grid-cols-[14rem_1fr] sm:gap-6"
              >
                <span className="sk-cap-line absolute inset-x-0 top-0 h-px bg-line-strong" />
                <span className="sk-cap-cell text-lg font-medium text-bone">
                  {/* Hover nudge lives on an inner span so its CSS transition never fights GSAP's transform */}
                  <span className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-2">
                    {c.title}
                  </span>
                </span>
                <span className="sk-cap-cell leading-relaxed text-muted transition-colors duration-300 group-hover:text-bone/80">
                  {c.desc}
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* Floating app screen that follows the pointer over the capability list */}
        <div
          aria-hidden="true"
          className="sk-preview pointer-events-none absolute left-0 top-0 z-20 hidden w-40 md:block lg:w-48"
          style={{
            aspectRatio: '560 / 1124',
            transform: 'scale(0)',
            opacity: 0,
            filter: 'drop-shadow(0 24px 40px rgba(0,0,0,0.6))',
          }}
        >
          {PREVIEWS.map((src, i) => (
            <Image key={src} src={src} alt="" fill sizes="200px" className="sk-preview-img object-contain" style={{ opacity: i === 0 ? 1 : 0 }} />
          ))}
        </div>
      </div>

      <div className="sk-toolbox mt-20 border-t border-line pt-10 md:mt-28">
        <div className="grid gap-8 md:grid-cols-12">
          <p className="label md:col-span-3">{t.skills.toolbox}</p>
          <div className="md:col-span-9">
            {/* Dock: chips swell toward the pointer like the macOS dock; icons spin on hover */}
            <ul className="sk-dock flex flex-wrap gap-3 py-3">
              {toolbox.map(({ Icon, color, label }) => (
                <li key={label} className="sk-tool">
                  <span className="sk-dock-item group relative flex items-center gap-2.5 rounded-full border border-line-strong bg-ink-2 px-4 py-2.5 text-sm transition-colors duration-300 hover:z-10 hover:border-bone">
                    <span className="inline-flex transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-[360deg]">
                      <Icon size={16} style={{ color }} aria-hidden="true" />
                    </span>
                    {label}
                  </span>
                </li>
              ))}
            </ul>
            <p className="sk-chip mt-8 text-sm text-dim">
              <span className="label mr-3">{t.skills.alsoUsed}</span>
              {alsoUsed.join(' · ')}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
