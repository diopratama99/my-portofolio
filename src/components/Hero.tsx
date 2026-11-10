'use client'

import { useEffect, useRef } from 'react'
import { ArrowDownRight, ArrowUpRight, Download } from 'lucide-react'
import { SiFlutter, SiSupabase, SiDart, SiSqlite } from 'react-icons/si'
import { gsap, useGSAP, prefersReducedMotion, isTouchDevice, scrollToTarget } from '@/lib/gsap'
import { useLanguage } from '@/contexts/LanguageContext'
import { SplitChars } from './ui/Split'
import { Magnetic } from './ui/Magnetic'
import { RollText } from './ui/RollText'
import { LocalClock } from './ui/LocalClock'
import PhoneShowcase from './PhoneShowcase'
import { DotField } from './ui/DotField'

/** The stack, floating around the phone. depth = how far it drifts with the pointer. */
const ORBIT = [
  { Icon: SiFlutter, color: '#54C5F8', label: 'Flutter', pos: 'left-[1%] top-[12%]', depth: 26 },
  { Icon: SiSupabase, color: '#3ECF8E', label: 'Supabase', pos: 'right-[0%] top-[32%]', depth: 42 },
  { Icon: SiDart, color: '#2BB7F6', label: 'Dart', pos: 'left-[0%] bottom-[36%]', depth: 18 },
  { Icon: SiSqlite, color: '#6CC3E8', label: 'SQLite', pos: 'right-[4%] bottom-[22%]', depth: 32 },
]

export default function Hero({ ready }: { ready: boolean }) {
  const { t } = useLanguage()
  const root = useRef<HTMLElement>(null)
  const intro = useRef<gsap.core.Timeline | null>(null)
  const [first, ...rest] = t.hero.name.split(' ')
  const last = rest.join(' ')

  // Intro held until the preloader finishes, plus a gentle parallax on scroll
  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } })
      tl.from('.h-char', { yPercent: 115, duration: 1.4, stagger: 0.04 })
        .from('.h-phone', { y: 120, rotationX: 25, autoAlpha: 0, duration: 1.8 }, 0.2)
        .from('.h-fade', { y: 24, autoAlpha: 0, duration: 1, stagger: 0.05 }, 0.5)
        .from('.h-orbit-in', { scale: 0, autoAlpha: 0, duration: 0.9, ease: 'back.out(2)', stagger: 0.12 }, 1)
      intro.current = tl
      if (ready) tl.play()

      // Stack chips bob gently, each on its own rhythm
      gsap.utils.toArray<HTMLElement>('.h-orbit-bob').forEach((el, i) => {
        gsap.to(el, { y: i % 2 ? 10 : -10, duration: gsap.utils.random(2.2, 3.2), ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * 0.3 })
      })

      // Letters of the name hop and light up when the pointer brushes them
      const chars = gsap.utils.toArray<HTMLElement>('.h-char')
      const cleanups = chars.map((ch) => {
        const enter = () => {
          gsap
            .timeline()
            .to(ch, { yPercent: -9, color: '#a9b3ff', duration: 0.18, ease: 'power2.out', overwrite: 'auto' })
            .to(ch, { yPercent: 0, duration: 0.7, ease: 'elastic.out(1, 0.35)' })
            .to(ch, { color: '#eeece6', duration: 0.8 }, '<0.25')
        }
        ch.addEventListener('mouseenter', enter)
        return () => ch.removeEventListener('mouseenter', enter)
      })

      // Chips drift with the pointer at different depths
      let onMove: ((e: MouseEvent) => void) | null = null
      if (!isTouchDevice()) {
        const orbit = gsap.utils.toArray<HTMLElement>('.h-orbit').map((el) => ({
          depth: Number(el.dataset.depth),
          x: gsap.quickTo(el, 'x', { duration: 1.2, ease: 'power3' }),
          y: gsap.quickTo(el, 'y', { duration: 1.2, ease: 'power3' }),
        }))
        onMove = (e: MouseEvent) => {
          const mx = e.clientX / window.innerWidth - 0.5
          const my = e.clientY / window.innerHeight - 0.5
          orbit.forEach((o) => {
            o.x(mx * o.depth)
            o.y(my * o.depth * 0.6)
          })
        }
        window.addEventListener('mousemove', onMove)
      }

      const out = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true }
      gsap.to('.h-copy', { yPercent: -12, autoAlpha: 0.2, ease: 'none', scrollTrigger: out })
      gsap.to('.h-phone-wrap', { yPercent: 18, ease: 'none', scrollTrigger: out })

      return () => {
        cleanups.forEach((fn) => fn())
        if (onMove) window.removeEventListener('mousemove', onMove)
      }
    },
    { scope: root },
  )

  useEffect(() => {
    if (ready) intro.current?.play()
  }, [ready])

  return (
    <section
      id="hero"
      ref={root}
      className="relative flex min-h-[100svh] flex-col overflow-hidden px-pad pb-6 pt-24 md:pt-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 50% 55% at 78% 50%, rgba(84,104,255,0.14), transparent 70%)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ maskImage: 'radial-gradient(ellipse 80% 70% at 50% 45%, #000 30%, transparent 85%)' }}
      >
        <DotField />
      </div>

      <div className="label relative grid grid-cols-2 items-start gap-4 md:grid-cols-3">
        <span className="h-fade">{t.hero.basedIn}</span>
        <span className="h-fade hidden justify-self-center md:block">
          <LocalClock />
        </span>
        <span className="h-fade flex items-center gap-2 justify-self-end text-bone">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          {t.hero.available}
        </span>
      </div>

      <div className="relative grid flex-1 items-center gap-14 py-10 md:grid-cols-12 md:gap-8">
        <div className="h-copy md:col-span-7 lg:col-span-8">
          <h1
            className="font-display font-bold uppercase leading-[0.82] tracking-[-0.025em]"
            style={{ fontSize: 'clamp(3.5rem, min(12.5vw, 22vh), 13.5rem)' }}
          >
            <span className="sr-only">{t.hero.name}</span>
            <SplitChars text={first} charClass="h-char" className="block" />
            <SplitChars text={last} charClass="h-char" className="block" />
          </h1>

          <p className="h-fade mt-8 max-w-md text-lg leading-snug text-muted md:text-xl">{t.hero.intro}</p>

          <div className="h-fade mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <p className="flex items-center gap-2.5 font-display text-xl font-medium tracking-[-0.02em] md:text-2xl">
              <SiFlutter className="shrink-0 text-[#54C5F8]" size="0.9em" aria-hidden="true" />
              {t.hero.role}
            </p>
            <p className="flex items-center gap-2 text-muted">
              <span className="label">{t.hero.backendLabel}</span>
              <SiSupabase className="shrink-0 text-[#3ECF8E]" size={15} aria-hidden="true" />
              <span className="text-bone">Supabase</span>
            </p>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Magnetic className="h-fade">
              <button onClick={() => scrollToTarget('#projects')} className="btn btn-primary">
                <RollText>{t.hero.cta}</RollText>
                <ArrowDownRight size={16} />
              </button>
            </Magnetic>
            <Magnetic className="h-fade">
              <button onClick={() => scrollToTarget('#contact')} className="btn btn-ghost">
                <RollText>{t.hero.ctaSecondary}</RollText>
                <ArrowUpRight size={16} />
              </button>
            </Magnetic>
            <a href="/cv-dio-pratama.pdf" download className="h-fade btn text-muted hover:text-bone">
              <Download size={15} />
              <RollText>{t.hero.downloadCv}</RollText>
            </a>
          </div>
        </div>

        <div className="h-phone-wrap relative flex justify-center md:col-span-5 lg:col-span-4">
          <div className="h-phone">
            <PhoneShowcase />
          </div>
          {ORBIT.map(({ Icon, color, label, pos, depth }) => (
            <span key={label} className={`h-orbit pointer-events-none absolute z-10 ${pos}`} data-depth={depth} aria-hidden="true">
              <span className="h-orbit-bob block">
                <span className="h-orbit-in flex items-center gap-2 rounded-2xl border border-line-strong bg-ink-2/80 px-3 py-2 text-xs font-medium shadow-xl backdrop-blur-md">
                  <Icon size={14} style={{ color }} />
                  {label}
                </span>
              </span>
            </span>
          ))}
        </div>
      </div>

      <div className="label relative mt-6 flex items-center justify-between">
        <button onClick={() => scrollToTarget('#about')} className="h-fade hover:text-bone">
          {t.hero.scrollDown} ↓
        </button>
        <span className="h-fade">Portfolio ©{new Date().getFullYear()}</span>
      </div>
    </section>
  )
}
