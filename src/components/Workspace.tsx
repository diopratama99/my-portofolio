'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { ArrowRight, Server } from 'lucide-react'
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap'
import { useLanguage } from '@/contexts/LanguageContext'
import { SectionLabel } from './ui/SectionLabel'
import { RevealChars } from './ui/Split'

/** Hotspot positions on /workspace.webp, in percent, matching t.workspace.spots order. */
const SPOTS: { x: number; y: number; side: 'left' | 'right'; up?: boolean }[] = [
  { x: 92, y: 62, side: 'left' }, // main PC
  { x: 46, y: 30, side: 'right' }, // monitors
  { x: 58.5, y: 77, side: 'right', up: true }, // macropad
  { x: 85, y: 74, side: 'left', up: true }, // MacBook, standing behind the vertical monitor
]

export default function Workspace() {
  const { t } = useLanguage()
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState<number | null>(null)
  const spots = t.workspace.spots

  useGSAP(
    () => {
      if (prefersReducedMotion()) return

      gsap.from('.ws-fade', {
        y: 40,
        autoAlpha: 0,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: '.ws-head', start: 'top 80%' },
      })

      gsap
        .timeline({ scrollTrigger: { trigger: '.ws-photo', start: 'top 80%' } })
        .fromTo('.ws-photo', { clipPath: 'inset(12% 8% 12% 8% round 1rem)' }, { clipPath: 'inset(0% 0% 0% 0% round 1rem)', duration: 1.5, ease: 'expo.inOut' })
        .from('.ws-img', { scale: 1.25, duration: 2, ease: 'expo.out' }, 0)
        .from('.ws-dot', { scale: 0, duration: 0.8, ease: 'back.out(3)', stagger: 0.12 }, 0.9)

      // Pulsing rings around each dot, only while the photo is on screen
      gsap.fromTo(
        '.ws-pulse',
        { scale: 1, opacity: 0.6 },
        {
          scale: 2.6,
          opacity: 0,
          duration: 1.8,
          ease: 'power2.out',
          repeat: -1,
          stagger: 0.4,
          scrollTrigger: { trigger: '.ws-photo', start: 'top bottom', end: 'bottom top', toggleActions: 'play pause resume pause' },
        },
      )

      gsap.utils.toArray<HTMLElement>('.ws-step').forEach((step, i) => {
        gsap.from(step, { x: -20, autoAlpha: 0, duration: 0.9, ease: 'expo.out', delay: i * 0.12, scrollTrigger: { trigger: '.ws-flow', start: 'top 85%' } })
      })
    },
    { scope: root },
  )

  // Detail card pops in whenever a different spot becomes active
  useGSAP(
    () => {
      if (active === null || prefersReducedMotion()) return
      gsap.fromTo('.ws-card', { y: 12, autoAlpha: 0, scale: 0.96 }, { y: 0, autoAlpha: 1, scale: 1, duration: 0.5, ease: 'expo.out' })
    },
    { scope: root, dependencies: [active] },
  )

  const spot = active !== null ? SPOTS[active] : null

  return (
    <section id="workspace" ref={root} className="relative px-pad py-[clamp(6rem,12vw,10rem)]">
      <SectionLabel index="05" title={t.workspace.title} note={t.workspace.subtitle} />

      <div className="ws-head mt-10 grid gap-12 md:grid-cols-12">
        <div className="md:col-span-6">
          <RevealChars
            text={t.workspace.heading}
            className="font-display text-[clamp(2.5rem,5.5vw,5.5rem)] font-bold uppercase leading-[0.9] tracking-[-0.03em]"
          />
          <p className="ws-fade mt-6 max-w-md text-lg leading-relaxed text-muted">{t.workspace.intro}</p>
        </div>

        <div className="ws-flow self-end md:col-span-5 md:col-start-8">
          <p className="ws-fade label mb-4">{t.workspace.flowTitle}</p>
          <ol className="flex flex-col gap-3">
            {t.workspace.flow.map((step, i) => (
              <li key={step} className="ws-step flex items-center gap-4">
                <span className="label flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line-strong tabular-nums">
                  {i + 1}
                </span>
                <span className={i === 2 ? 'text-[#3ECF8E]' : 'text-bone'}>{step}</span>
                {i < 2 && <ArrowRight size={14} className="ml-auto shrink-0 text-dim" aria-hidden="true" />}
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Photo with hotspots */}
      <div
        className="ws-photo group relative mt-14 aspect-[16/9] overflow-hidden rounded-2xl bg-ink-2 md:mt-20"
        onMouseLeave={() => setActive(null)}
      >
        {/* Photo and dots share one layer, so the dots always sit on the objects they describe */}
        <div className="ws-img absolute inset-0">
          <Image
            src="/workspace.webp"
            alt="Dio's desk setup: a 24-inch main monitor plus vertical and portable screens, mechanical keyboard, macropad and the main PC"
            fill
            sizes="100vw"
            unoptimized // already a tuned WebP; re-encoding at q75 visibly softened it
            className={`object-cover transition-[filter] duration-700 ${
              active !== null ? 'brightness-[0.55]' : 'brightness-[0.85] group-hover:brightness-100'
            }`}
          />

        {SPOTS.map((s, i) => (
          <button
            key={i}
            type="button"
            aria-label={spots[i].title}
            aria-pressed={active === i}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(active === i ? null : i)}
            className="ws-dot absolute z-10 -ml-3 -mt-3 flex h-6 w-6 items-center justify-center md:-ml-4 md:-mt-4 md:h-8 md:w-8"
            style={{ left: `${s.x}%`, top: `${s.y}%` }}
          >
            <span className="ws-pulse absolute inset-0 rounded-full bg-bone/60" />
            <span
              className={`relative h-3 w-3 rounded-full border-2 border-ink transition-colors duration-300 md:h-4 md:w-4 ${
                active === i ? 'bg-accent' : 'bg-bone'
              }`}
            />
          </button>
        ))}
        </div>

        <p className="label pointer-events-none absolute left-4 top-4 rounded-full bg-ink/70 px-3 py-1.5 !text-bone backdrop-blur md:left-6 md:top-6">
          {t.workspace.hint}
        </p>

        {/* Floating card on larger screens */}
        {spot && active !== null && (
          <div
            className="ws-card pointer-events-none absolute z-20 hidden w-72 rounded-xl border border-line-strong bg-ink/90 p-5 backdrop-blur-md md:block"
            style={{
              ...(spot.side === 'right' ? { left: `calc(${spot.x}% + 28px)` } : { right: `calc(${100 - spot.x}% + 28px)` }),
              ...(spot.up ? { bottom: `calc(${100 - spot.y}% - 20px)` } : { top: `calc(${spot.y}% - 20px)` }),
            }}
          >
            <p className="font-display text-lg font-medium">{spots[active].title}</p>
            <p className="label mt-1 !text-accent-soft">{spots[active].meta}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">{spots[active].desc}</p>
          </div>
        )}
      </div>

      {/* On small screens the active spot is described under the photo */}
      <div className="mt-4 min-h-[7rem] rounded-xl border border-line p-5 md:hidden">
        {active !== null ? (
          <div className="ws-card">
            <p className="font-display text-lg font-medium">{spots[active].title}</p>
            <p className="label mt-1 !text-accent-soft">{spots[active].meta}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">{spots[active].desc}</p>
          </div>
        ) : (
          <p className="label">{t.workspace.hint}</p>
        )}
      </div>

      {/* Machines that aren't in the photo */}
      <div className="mt-12 md:mt-16">
        <p className="ws-fade label mb-4">{t.workspace.offPhoto}</p>
        <div className="grid gap-4 md:grid-cols-2">
          {t.workspace.machines.map((m) => (
            <div key={m.title} className="ws-fade flex gap-4 rounded-xl border border-line p-5 transition-colors duration-500 hover:border-line-strong hover:bg-ink-2">
              <Server size={20} className="mt-0.5 shrink-0 text-accent-soft" aria-hidden="true" />
              <div>
                <p className="font-display text-lg font-medium">{m.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
