'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, ScrollSmoother, useGSAP, prefersReducedMotion, scrollToTarget } from '@/lib/gsap'
import { useLanguage } from '@/contexts/LanguageContext'
import type { Language } from '@/data/translations'
import { RollText } from './ui/RollText'
import { Magnetic } from './ui/Magnetic'

const SECTIONS = ['hero', 'about', 'projects', 'skills', 'workspace', 'experience', 'contact'] as const
const LINKS = ['about', 'projects', 'skills', 'workspace', 'experience', 'contact'] as const
type SectionId = (typeof SECTIONS)[number]

function LangToggle({
  lang,
  setLang,
  className = '',
}: {
  lang: Language
  setLang: (l: Language) => void
  className?: string
}) {
  return (
    <div className={`label flex items-center gap-1 ${className}`}>
      {(['en', 'id'] as const).map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && <span className="text-dim">/</span>}
          <button
            onClick={() => setLang(l)}
            aria-pressed={lang === l}
            className={`px-1 py-1 transition-colors ${lang === l ? 'text-bone' : 'text-dim hover:text-muted'}`}
          >
            {l.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  )
}

export default function Navbar({ ready }: { ready: boolean }) {
  const { t, lang, setLang } = useLanguage()
  const root = useRef<HTMLElement>(null)
  const menuTl = useRef<gsap.core.Timeline | null>(null)
  const [active, setActive] = useState<SectionId>('hero')
  const [open, setOpen] = useState(false)

  // Hide on scroll down, track the active section, build the mobile menu timeline
  useGSAP(
    () => {
      const bar = root.current!.querySelector<HTMLElement>('.nv-bar')!
      let hidden = false

      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          const y = self.scroll()
          bar.classList.toggle('is-scrolled', y > 40)
          const shouldHide = self.direction === 1 && y > window.innerHeight * 0.4
          if (shouldHide !== hidden) {
            hidden = shouldHide
            gsap.to(bar, { yPercent: hidden ? -120 : 0, duration: 0.6, ease: 'expo.out', overwrite: 'auto' })
          }
        },
      })

      SECTIONS.forEach((id) => {
        const el = document.getElementById(id)
        if (!el) return
        ScrollTrigger.create({
          trigger: el,
          start: 'top 45%',
          end: 'bottom 45%',
          onToggle: (self) => self.isActive && setActive(id),
        })
      })

      const menu = root.current!.querySelector<HTMLElement>('.nv-menu')!
      menuTl.current = gsap
        .timeline({
          paused: true,
          onStart: () => gsap.set(menu, { visibility: 'visible' }),
          onReverseComplete: () => gsap.set(menu, { visibility: 'hidden' }),
        })
        .fromTo(menu, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, ease: 'expo.inOut' })
        .from('.nv-menu-link', { yPercent: 110, duration: 0.8, ease: 'expo.out', stagger: 0.06 }, '-=0.35')
        .from('.nv-menu-foot', { autoAlpha: 0, y: 20, duration: 0.5 }, '-=0.5')
    },
    { scope: root },
  )

  // Entrance once the preloader clears
  useGSAP(
    () => {
      if (!ready || prefersReducedMotion()) return
      gsap.from('.nv-item', { yPercent: -150, autoAlpha: 0, duration: 1.2, ease: 'expo.out', stagger: 0.06, delay: 0.5 })
    },
    { scope: root, dependencies: [ready] },
  )

  // Slide the active pill under the current link
  useGSAP(
    () => {
      const pill = root.current!.querySelector<HTMLElement>('.nv-pill')
      const link = root.current!.querySelector<HTMLElement>(`[data-link="${active}"]`)
      if (!pill) return
      if (!link) {
        gsap.to(pill, { autoAlpha: 0, duration: 0.3 })
        return
      }
      gsap.to(pill, {
        x: link.offsetLeft,
        width: link.offsetWidth,
        autoAlpha: 1,
        duration: 0.7,
        ease: 'expo.out',
      })
    },
    { scope: root, dependencies: [active, lang] },
  )

  useEffect(() => {
    if (open) menuTl.current?.play()
    else menuTl.current?.reverse()
    ScrollSmoother.get()?.paused(open)
  }, [open])

  const go = (id: SectionId) => {
    if (open) {
      setOpen(false)
      ScrollSmoother.get()?.paused(false)
    }
    scrollToTarget(id === 'hero' ? 0 : `#${id}`)
  }

  return (
    <header ref={root} className="pointer-events-none fixed inset-x-0 top-0 z-50">
      {/* Mobile fullscreen menu */}
      <div
        className="nv-menu pointer-events-auto fixed inset-0 flex flex-col justify-between bg-accent px-pad pb-10 pt-28 md:hidden"
        style={{ clipPath: 'inset(0% 0% 100% 0%)', visibility: 'hidden' }}
      >
        <nav className="flex flex-col gap-1">
          {LINKS.map((id) => (
            <span key={id} className="mask">
              <button
                onClick={() => go(id)}
                className="nv-menu-link flex items-baseline gap-4 font-display text-[clamp(2.75rem,13vw,4.5rem)] font-semibold uppercase leading-[0.95] tracking-[-0.04em] text-white"
              >
                {t.nav[id]}
              </button>
            </span>
          ))}
        </nav>
        <div className="nv-menu-foot flex items-end justify-between text-white">
          <LangToggle lang={lang} setLang={setLang} className="!text-white" />
        </div>
      </div>

      <div className="nv-bar theme-tokens pointer-events-auto relative flex items-center justify-between px-pad py-4 md:grid md:grid-cols-[1fr_auto_1fr] transition-[background-color,backdrop-filter,border-color] duration-500 [&.is-scrolled]:border-b [&.is-scrolled]:border-line [&.is-scrolled]:bg-ink/70 [&.is-scrolled]:backdrop-blur-xl md:py-5">
        <button
          onClick={() => go('hero')}
          className="nv-item flex items-start gap-0.5 justify-self-start font-display text-lg font-semibold tracking-tight"
          aria-label="Dio Pratama, home"
        >
          <RollText>Dio Pratama</RollText>
        </button>

        <nav className="relative hidden items-center rounded-full border border-line bg-ink/50 p-1 backdrop-blur-md md:flex">
          <span
            aria-hidden="true"
            className="nv-pill absolute left-0 top-1 h-[calc(100%-0.5rem)] rounded-full bg-bone opacity-0"
          />
          {LINKS.map((id) => (
            <button
              key={id}
              data-link={id}
              onClick={() => go(id)}
              className={`nv-item relative z-10 rounded-full px-4 py-2 text-sm transition-colors duration-500 ${
                active === id ? 'text-ink' : 'text-muted hover:text-bone'
              }`}
            >
              <RollText>{t.nav[id]}</RollText>
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4 md:justify-self-end">
          <LangToggle lang={lang} setLang={setLang} className="nv-item hidden md:flex" />
          <div className="hidden md:block">
            <Magnetic className="nv-item">
              <button onClick={() => go('contact')} className="btn btn-primary !py-3">
                <RollText>{t.nav.talk}</RollText>
              </button>
            </Magnetic>
          </div>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className="nv-item label flex items-center gap-2 !text-bone md:hidden"
          >
            <span className="relative flex h-3 w-5 flex-col justify-between">
              <span
                className={`h-px w-full bg-current transition-transform duration-500 ${open ? 'translate-y-[5.5px] rotate-45' : ''}`}
              />
              <span
                className={`h-px w-full bg-current transition-transform duration-500 ${open ? '-translate-y-[5.5px] -rotate-45' : ''}`}
              />
            </span>
            {open ? t.nav.close : t.nav.menu}
          </button>
        </div>
      </div>
    </header>
  )
}
