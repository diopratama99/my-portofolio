'use client'

import { useRef } from 'react'
import { Briefcase, GraduationCap } from 'lucide-react'
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap'
import { useLanguage } from '@/contexts/LanguageContext'
import { SectionLabel } from './ui/SectionLabel'
import { RevealChars } from './ui/Split'
import { workItems, eduItems, type TimelineEntry } from '@/data/experience'

export default function Experience() {
  const { t, lang } = useLanguage()
  const root = useRef<HTMLElement>(null)

  const groups: { title: string; Icon: typeof Briefcase; items: TimelineEntry[] }[] = [
    { title: t.experience.workTitle, Icon: Briefcase, items: workItems },
    { title: t.experience.eduTitle, Icon: GraduationCap, items: eduItems },
  ]

  useGSAP(
    () => {
      if (prefersReducedMotion()) return

      gsap.utils.toArray<HTMLElement>('.xp-group-head').forEach((head) => {
        gsap.from(head.children, {
          yPercent: 100,
          autoAlpha: 0,
          duration: 0.9,
          ease: 'expo.out',
          stagger: 0.1,
          scrollTrigger: { trigger: head, start: 'top 90%' },
        })
      })

      gsap.utils.toArray<HTMLElement>('.xp-row').forEach((row) => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: row, start: 'top 88%', toggleActions: 'play none none reverse' },
        })
        tl.from(row.querySelector('.xp-line'), { scaleX: 0, transformOrigin: 'left center', duration: 1.4, ease: 'expo.inOut' })
          .from(row.querySelector('.xp-dot'), { scale: 0, duration: 0.6, ease: 'back.out(3)' }, 0.3)
          .from(row.querySelectorAll('.xp-cell'), { y: 50, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: 0.08 }, 0.3)
      })
    },
    { scope: root },
  )

  return (
    <section id="experience" ref={root} className="relative px-pad py-[clamp(6rem,12vw,10rem)]">
      <SectionLabel index="06" title={t.experience.title} note={t.experience.subtitle} />

      <RevealChars
        text={t.experience.title}
        className="mt-10 font-display text-[clamp(3rem,11.5vw,12rem)] font-bold uppercase leading-[0.85] tracking-[-0.025em]"
      />

      {groups.map(({ title, Icon, items }) => (
        <div key={title} className="mt-16 md:mt-24">
          <div className="xp-group-head label mb-4 flex items-center justify-between overflow-hidden">
            <span className="flex items-center gap-2 text-bone">
              <Icon size={13} className="text-accent-soft" />
              {title}
            </span>
            <span>({String(items.length).padStart(2, '0')})</span>
          </div>

          <ol>
            {items.map((item) => (
              <li
                key={item.title.en}
                className="xp-row group relative isolate grid gap-3 py-8 md:grid-cols-12 md:gap-8 md:py-10"
              >
                <span className="xp-line absolute inset-x-0 top-0 h-px bg-line-strong" />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-ink-2 transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-y-100"
                />
                <p className="xp-cell label flex items-center gap-3 md:col-span-3 md:pt-3">
                  <span className="xp-dot h-2 w-2 shrink-0 rounded-full" style={{ background: item.color }} />
                  {item.period[lang]}
                </p>
                <div className="xp-cell md:col-span-4">
                  <h3 className="font-display text-[clamp(1.6rem,2.8vw,2.6rem)] font-medium leading-tight tracking-[-0.03em] transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-3">
                    {item.title[lang]}
                  </h3>
                  <p className="mt-2 text-sm" style={{ color: item.color }}>
                    {item.org}
                  </p>
                </div>
                <p className="xp-cell leading-relaxed text-muted md:col-span-5 md:pt-2">{item.desc[lang]}</p>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </section>
  )
}
