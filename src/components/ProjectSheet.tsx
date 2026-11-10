'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { ArrowRight, ArrowUpRight, X } from 'lucide-react'
import { gsap, ScrollSmoother, useGSAP, prefersReducedMotion } from '@/lib/gsap'
import { useLanguage } from '@/contexts/LanguageContext'
import { tx, categoryLabel, linkText, type Project } from '@/data/projects'
import { RollText } from './ui/RollText'

export default function ProjectSheet({
  list: projects,
  index,
  onClose,
}: {
  /** The set the sheet pages through with "next" */
  list: Project[]
  index: number
  onClose: () => void
}) {
  const { t, lang } = useLanguage()
  const [current, setCurrent] = useState(index)
  const root = useRef<HTMLDivElement>(null)
  const scroller = useRef<HTMLDivElement>(null)
  const [closing, setClosing] = useState(false)
  const close = () => setClosing(true)
  const p = projects[current]
  const next = (current + 1) % projects.length

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .from('.ps-backdrop', { autoAlpha: 0, duration: 0.5, ease: 'power2.out' })
        .from('.ps-panel', { yPercent: 100, duration: 1 }, 0)
    },
    { scope: root },
  )

  // Content entrance, replayed whenever the project changes
  useGSAP(
    () => {
      scroller.current?.scrollTo({ top: 0 })
      if (prefersReducedMotion()) return
      gsap.from('.ps-in', { y: 50, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: 0.06, delay: 0.25 })
    },
    { scope: root, dependencies: [current], revertOnUpdate: true },
  )

  // Exit animation, then unmount
  useGSAP(
    () => {
      if (!closing) return
      if (prefersReducedMotion()) {
        onClose()
        return
      }
      gsap
        .timeline({ onComplete: onClose })
        .to('.ps-panel', { yPercent: 100, duration: 0.7, ease: 'expo.in' })
        .to('.ps-backdrop', { autoAlpha: 0, duration: 0.4 }, '-=0.3')
    },
    { scope: root, dependencies: [closing] },
  )

  useEffect(() => {
    const smoother = ScrollSmoother.get()
    smoother?.paused(true)
    const prevOverflow = document.documentElement.style.overflow
    if (!smoother) document.documentElement.style.overflow = 'hidden'
    root.current?.querySelector<HTMLButtonElement>('.ps-close')?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setClosing(true)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      smoother?.paused(false)
      if (!smoother) document.documentElement.style.overflow = prevOverflow
    }
  }, [])

  const isPhone = p.layout === 'phone'

  return createPortal(
    <div ref={root} className="fixed inset-0 z-[90]" role="dialog" aria-modal="true" aria-label={tx(p.title, lang)}>
      <div className="ps-backdrop absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={close} />

      <div className="ps-panel absolute inset-x-0 bottom-0 top-4 overflow-hidden rounded-t-[1.75rem] border-t border-line bg-ink md:top-8">
        <div ref={scroller} className="h-full overflow-y-auto overscroll-contain">
          {/* Sticky header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-ink/80 px-pad py-4 backdrop-blur-xl">
            <span className="label flex items-center gap-3">
              <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
              {String(current + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')} · {categoryLabel[p.category]}
            </span>
            <button onClick={close} className="ps-close btn btn-ghost !px-4 !py-2.5">
              <X size={14} />
              <RollText>{t.projects.close}</RollText>
            </button>
          </div>

          <div className="px-pad pb-20 pt-10 md:pt-16">
            <h2 className="ps-in font-display text-[clamp(2.75rem,8vw,8rem)] font-bold uppercase leading-[0.88] tracking-[-0.03em]">
              {tx(p.title, lang)}
            </h2>

            {/* The story: why this app exists */}
            {p.story && (
              <div className="mt-8 md:mt-12">
                <p className="ps-in max-w-3xl font-display text-[clamp(1.5rem,3vw,2.5rem)] font-medium leading-tight tracking-[-0.03em]">
                  <span className="text-dim">“</span>
                  {tx(p.story.hook, lang)}
                  <span className="text-dim">”</span>
                </p>

                <div className="relative mt-10 grid gap-4 md:grid-cols-2 md:gap-0">
                  <div className="ps-in rounded-2xl border border-line p-6 md:rounded-r-none md:p-10">
                    <p className="label mb-4 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                      {t.projects.problem}
                    </p>
                    <p className="text-lg leading-relaxed text-bone/80">{tx(p.story.problem, lang)}</p>
                  </div>
                  <div
                    className="ps-in rounded-2xl border border-line p-6 md:rounded-l-none md:border-l-0 md:p-10"
                    style={{ background: `${p.color}12` }}
                  >
                    <p className="label mb-4 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: p.color }} />
                      {t.projects.solution}
                    </p>
                    <p className="text-lg leading-relaxed text-bone">{tx(p.story.solution, lang)}</p>
                  </div>
                  <span
                    aria-hidden="true"
                    className="ps-in absolute left-1/2 top-1/2 hidden h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-line-strong bg-ink md:flex"
                  >
                    <ArrowRight size={18} />
                  </span>
                </div>
              </div>
            )}

            <div className="ps-in mt-12 grid gap-8 md:mt-16 md:grid-cols-12">
              <div className="md:col-span-7">
                <p className="label mb-3">{t.projects.about}</p>
                <p className="leading-relaxed text-muted md:text-lg">{tx(p.desc, lang)}</p>
              </div>
              <div className="flex flex-col gap-6 md:col-span-4 md:col-start-9">
                <div>
                  <p className="label mb-3">{t.projects.stack}</p>
                  <div className="flex flex-wrap gap-2">
                    {p.stack.map((s) => (
                      <span key={s} className="rounded-full border border-line-strong px-3 py-1 text-sm">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                {p.links && (
                  <div className="flex flex-wrap gap-3">
                    {p.links.map((l, i) => (
                      <a
                        key={l.href}
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`btn ${i === 0 ? 'btn-primary' : 'btn-ghost'}`}
                      >
                        <RollText>{linkText(l)}</RollText>
                        <ArrowUpRight size={15} />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Reel or cover */}
            <div className="ps-in relative mt-12 overflow-hidden rounded-2xl border border-line bg-ink-2 md:mt-16">
              {p.video ? (
                <video
                  key={p.video}
                  src={p.video}
                  poster={p.cover}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="aspect-video w-full object-cover"
                />
              ) : (
                <Image src={p.cover} alt="" width={1600} height={900} sizes="100vw" className="h-auto w-full" />
              )}
            </div>

            {/* Highlights */}
            <div className="mt-16 grid gap-8 md:mt-24 md:grid-cols-12">
              <p className="ps-in label md:col-span-3">{t.projects.highlights}</p>
              <ol className="md:col-span-9">
                {p.features.map((f, i) => (
                  <li key={i} className="ps-in flex gap-6 border-t border-line py-5 text-lg md:text-xl">
                    <span className="label pt-1.5 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                    {tx(f, lang)}
                  </li>
                ))}
              </ol>
            </div>

            {/* Screens */}
            <div className="mt-16 md:mt-24">
              <p className="ps-in label mb-6">
                {t.projects.screens} ({String(p.screens.length).padStart(2, '0')})
              </p>
              <div
                className={`grid gap-4 md:gap-6 ${
                  isPhone ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5' : 'grid-cols-1 md:grid-cols-2'
                }`}
              >
                {p.screens.map((s) => (
                  <figure key={s.src} className="ps-in">
                    {/* Phone screens carry their own device frame; only wide screens get a card */}
                    <div className={isPhone ? '' : 'overflow-hidden rounded-xl border border-line bg-ink-2'}>
                      <Image
                        src={s.src}
                        alt={tx(s.label, lang)}
                        width={isPhone ? 560 : 1100}
                        height={isPhone ? 1124 : 688}
                        sizes={isPhone ? '(min-width: 1024px) 20vw, 45vw' : '(min-width: 768px) 50vw, 100vw'}
                        className="h-auto w-full"
                      />
                    </div>
                    <figcaption className="label mt-3">{tx(s.label, lang)}</figcaption>
                  </figure>
                ))}
              </div>
              {p.note && <p className="mt-6 text-sm text-dim">{tx(p.note, lang)}</p>}
            </div>

            {/* Next project (only when there is another one in this list) */}
            {projects.length > 1 && (
              <button
                onClick={() => setCurrent(next)}
                className="group mt-20 flex w-full items-end justify-between gap-6 border-t border-line pt-8 text-left md:mt-28"
              >
                <span>
                  <span className="label block">{t.projects.next}</span>
                  <span className="mt-3 block font-display text-[clamp(2rem,6vw,5.5rem)] font-bold uppercase leading-[0.9] tracking-[-0.03em] transition-colors duration-500 group-hover:text-accent-soft">
                    {tx(projects[next].title, lang)}
                  </span>
                </span>
                <ArrowRight className="mb-2 shrink-0 transition-transform duration-500 group-hover:translate-x-2" size={36} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
