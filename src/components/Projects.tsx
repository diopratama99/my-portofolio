'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { SiGithub } from 'react-icons/si'
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from '@/lib/gsap'
import { useLanguage } from '@/contexts/LanguageContext'
import { mobileApps as projects, tx, linkText, websiteOf } from '@/data/projects'
import { RollText } from './ui/RollText'
import { RevealChars, SplitChars } from './ui/Split'
import { Magnetic } from './ui/Magnetic'
import ProjectSheet from './ProjectSheet'
import { Bolubi, type BolubiApi } from './ui/Bolubi'

const GITHUB = 'https://github.com/diopratama99'

export default function Projects() {
  const { t, lang } = useLanguage()
  const root = useRef<HTMLElement>(null)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [line, setLine] = useState(0)
  const bolubi = useRef<BolubiApi | null>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const section = root.current!
      const panels = gsap.utils.toArray<HTMLElement>('.pj-panel')
      const mm = gsap.matchMedia()

      // Desktop: pin the section and translate the track sideways
      mm.add('(min-width: 768px)', () => {
        const track = section.querySelector<HTMLElement>('.pj-track')!
        const distance = () => track.scrollWidth - window.innerWidth

        const scroll = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: true,
            invalidateOnRefresh: true,
            refreshPriority: 1,
          },
        })

        gsap.fromTo(
          '.pj-progress',
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: { trigger: section, start: 'top top', end: () => `+=${distance()}`, scrub: true, invalidateOnRefresh: true },
          },
        )


        // bolubi walks along the progress bar: it's told where to be, and works out its own
        // pace, steps and braking. Its line changes when a new panel reaches the middle.
        const walker = section.querySelector<HTMLElement>('.pj-bolubi')!
        const bar = section.querySelector<HTMLElement>('.pj-bar')!
        const stops = Array.from(track.children) as HTMLElement[]
        let current = 0
        ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: () => `+=${distance()}`,
          invalidateOnRefresh: true,
          onRefresh: (self) => bolubi.current?.moveTo(self.progress * (bar.offsetWidth - walker.offsetWidth)),
          onUpdate: (self) => {
            bolubi.current?.moveTo(self.progress * (bar.offsetWidth - walker.offsetWidth))
            // Reference point a bit left of centre, so the intro panel (44vw wide) gets its own line
            const middle = self.progress * distance() + window.innerWidth * 0.35
            const idx = Math.max(0, stops.findIndex((p) => middle < p.offsetLeft + p.offsetWidth))
            if (idx !== current) {
              current = idx
              setLine(idx)
              bolubi.current?.speak()
            }
          },
        })

        panels.forEach((panel) => {
          const inView = { trigger: panel, containerAnimation: scroll }
          const cover = panel.querySelector('.pj-cover')
          const img = panel.querySelector('.pj-img')

          if (cover && img) {
            gsap.fromTo(
              cover,
              { clipPath: 'inset(0% 0% 0% 100%)' },
              { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { ...inView, start: 'left 95%', end: 'left 45%', scrub: true } },
            )
            gsap.fromTo(
              img,
              { xPercent: -10, scale: 1.25 },
              { xPercent: 10, scale: 1.12, ease: 'none', scrollTrigger: { ...inView, start: 'left right', end: 'right left', scrub: true } },
            )
          }
          gsap.from(panel.querySelectorAll('.pj-char'), {
            yPercent: 115,
            duration: 1,
            ease: 'expo.out',
            stagger: 0.02,
            scrollTrigger: { ...inView, start: 'left 70%', toggleActions: 'play none none reverse' },
          })
          gsap.from(panel.querySelectorAll('.pj-fade'), {
            y: 30,
            autoAlpha: 0,
            duration: 0.9,
            ease: 'expo.out',
            stagger: 0.06,
            scrollTrigger: { ...inView, start: 'left 70%', toggleActions: 'play none none reverse' },
          })
        })
      })

      // Pointer devices: a "View app" pill trails the cursor over each cover, which tilts slightly
      mm.add('(min-width: 768px) and (pointer: fine)', () => {
        const cleanups = gsap.utils.toArray<HTMLElement>('.pj-cover').map((cover) => {
          const pill = cover.querySelector<HTMLElement>('.pj-view')!
          const x = gsap.quickTo(pill, 'x', { duration: 0.5, ease: 'power3' })
          const y = gsap.quickTo(pill, 'y', { duration: 0.5, ease: 'power3' })
          const rx = gsap.quickTo(cover, 'rotationX', { duration: 0.8, ease: 'power3' })
          const ry = gsap.quickTo(cover, 'rotationY', { duration: 0.8, ease: 'power3' })
          gsap.set(cover, { transformPerspective: 1200 })

          const move = (e: MouseEvent) => {
            const r = cover.getBoundingClientRect()
            const px = e.clientX - r.left
            const py = e.clientY - r.top
            x(px - pill.offsetWidth / 2)
            y(py - pill.offsetHeight / 2)
            ry((px / r.width - 0.5) * 6)
            rx(-(py / r.height - 0.5) * 6)
          }
          const enter = (e: MouseEvent) => {
            const r = cover.getBoundingClientRect()
            gsap.set(pill, { x: e.clientX - r.left - pill.offsetWidth / 2, y: e.clientY - r.top - pill.offsetHeight / 2 })
            gsap.to(pill, { scale: 1, duration: 0.5, ease: 'back.out(2)', overwrite: 'auto' })
          }
          const leave = () => {
            gsap.to(pill, { scale: 0, duration: 0.35, ease: 'power3.in', overwrite: 'auto' })
            rx(0)
            ry(0)
          }
          cover.addEventListener('mousemove', move)
          cover.addEventListener('mouseenter', enter)
          cover.addEventListener('mouseleave', leave)
          return () => {
            cover.removeEventListener('mousemove', move)
            cover.removeEventListener('mouseenter', enter)
            cover.removeEventListener('mouseleave', leave)
          }
        })
        return () => cleanups.forEach((fn) => fn())
      })

      // Mobile: plain vertical reveals
      mm.add('(max-width: 767px)', () => {
        panels.forEach((panel) => {
          gsap.from(panel.querySelectorAll('.pj-cover, .pj-fade'), {
            y: 50,
            autoAlpha: 0,
            duration: 1,
            ease: 'expo.out',
            stagger: 0.06,
            scrollTrigger: { trigger: panel, start: 'top 85%' },
          })
        })
      })
    },
    { scope: root },
  )

  return (
    <section id="projects" ref={root} className="relative overflow-hidden">
      <div className="pj-track flex flex-col md:h-[100svh] md:w-max md:flex-row">
        {/* Intro panel */}
        <div className="flex shrink-0 flex-col justify-between gap-10 px-pad pb-12 pt-24 md:h-full md:w-[44vw] md:pb-48 md:pt-28">
          <RevealChars
            text={t.projects.selected}
            className="font-display text-[clamp(3rem,5.6vw,7rem)] font-bold uppercase leading-[0.86] tracking-[-0.025em]"
          />
          <div className="mt-14 w-20 md:hidden">
            <Bolubi message={t.projects.bolubi[0]} label={t.projects.bolubiLabel} />
          </div>
          <p className="max-w-xs text-muted">{t.projects.subtitle}</p>
        </div>

        {/* Project panels */}
        {projects.map((p, i) => (
          <article
            key={p.slug}
            className="pj-panel flex shrink-0 flex-col justify-center gap-5 px-pad py-10 md:h-full md:w-[min(70vw,76vh)] md:px-0 md:pb-36 md:pl-[3vw] md:pt-24"
          >
            <button
              onClick={() => setOpenIndex(i)}
              aria-label={`${t.projects.viewMore}: ${tx(p.title, lang)}`}
              className="pj-cover group relative block aspect-video w-full overflow-hidden rounded-2xl border border-line bg-ink-2"
            >
              <span className="pj-img absolute inset-0 block">
                <Image
                  src={p.cover}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 80vw, 100vw"
                  className="object-cover transition-[filter] duration-700 group-hover:brightness-110"
                />
              </span>
              <span
                aria-hidden="true"
                className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                style={{ background: `linear-gradient(to top, ${p.color}55, transparent 60%)` }}
              />
              <span
                aria-hidden="true"
                className="pj-view pointer-events-none absolute left-0 top-0 hidden items-center gap-2 rounded-full bg-bone px-5 py-3 text-sm font-medium text-ink md:flex"
                style={{ transform: 'scale(0)' }}
              >
                {t.projects.viewMore}
                <ArrowUpRight size={15} />
              </span>
            </button>

            <div className="flex items-start justify-between gap-6">
              <div className="min-w-0">
                <h3 className="font-display text-[clamp(2rem,4vw,4.25rem)] font-bold uppercase leading-[0.9] tracking-[-0.025em]">
                  <span className="sr-only">{tx(p.title, lang)}</span>
                  <SplitChars text={tx(p.title, lang)} charClass="pj-char" />
                </h3>
                <p className="pj-fade mt-3 line-clamp-2 max-w-2xl text-lg text-bone/80">
                  {tx(p.story?.hook ?? p.desc, lang)}
                </p>
                {websiteOf(p) && (
                  <a
                    href={websiteOf(p)!.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pj-fade label mt-3 inline-flex items-center gap-1.5 !text-accent-soft hover:!text-bone"
                  >
                    <RollText>{linkText(websiteOf(p)!)}</RollText>
                    <ArrowUpRight size={12} />
                  </a>
                )}
              </div>
              <Magnetic className="pj-fade shrink-0">
                <button
                  onClick={() => setOpenIndex(i)}
                  aria-label={`${t.projects.viewMore}: ${tx(p.title, lang)}`}
                  className="flex h-14 w-14 items-center justify-center rounded-full border border-line-strong transition-colors duration-500 hover:border-transparent hover:bg-bone hover:text-ink md:h-16 md:w-16"
                >
                  <ArrowUpRight size={20} />
                </button>
              </Magnetic>
            </div>
          </article>
        ))}

        {/* Outro panel */}
        <div className="pj-panel flex shrink-0 flex-col justify-center px-pad py-20 md:h-full md:w-[40vw] md:pt-28">
          <p className="pj-fade label">{t.projects.moreDesc}</p>
          <a
            href={GITHUB}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-6 flex items-center gap-5 font-display text-[clamp(2.5rem,5vw,5rem)] font-bold uppercase leading-[0.9] tracking-[-0.03em]"
          >
            <span>
              <span className="sr-only">{t.projects.more}</span>
              <SplitChars text={t.projects.more} charClass="pj-char" />
            </span>
            <span className="pj-fade shrink-0">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-bone text-ink transition-transform duration-500 group-hover:rotate-45 md:h-20 md:w-20">
                <SiGithub size={26} />
              </span>
            </span>
          </a>
        </div>
      </div>

      {/* Horizontal progress */}
      <div className="pj-bar pointer-events-none absolute inset-x-pad bottom-8 hidden h-px bg-line md:block">
        <div className="pj-progress h-full origin-left bg-bone" style={{ transform: 'scaleX(0)' }} />
      </div>
      <div className="pj-bolubi absolute bottom-8 left-pad z-10 hidden w-24 md:block">
        <Bolubi
          message={t.projects.bolubi[Math.min(line, t.projects.bolubi.length - 1)]}
          bubbleAlign={line >= t.projects.bolubi.length - 2 ? 'right' : 'left'}
          apiRef={bolubi}
          label={t.projects.bolubiLabel}
        />
      </div>

      {openIndex !== null && <ProjectSheet list={projects} index={openIndex} onClose={() => setOpenIndex(null)} />}
    </section>
  )
}
