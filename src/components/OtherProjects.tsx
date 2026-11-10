'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { ArrowRight, ArrowUpRight, Globe } from 'lucide-react'
import { SiGithub } from 'react-icons/si'
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap'
import { useLanguage } from '@/contexts/LanguageContext'
import { otherProjects, tx, categoryLabel, linkText, websiteOf } from '@/data/projects'
import { SectionLabel } from './ui/SectionLabel'
import { RevealChars } from './ui/Split'
import { Magnetic } from './ui/Magnetic'
import { RollText } from './ui/RollText'
import ProjectSheet from './ProjectSheet'

/** Non-Flutter builds, laid out vertically so they read as a separate group from the app carousel. */
export default function OtherProjects() {
  const { t, lang } = useLanguage()
  const root = useRef<HTMLElement>(null)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.utils.toArray<HTMLElement>('.op-card').forEach((card) => {
        gsap
          .timeline({ scrollTrigger: { trigger: card, start: 'top 78%' } })
          .fromTo(
            card.querySelector('.op-cover'),
            { clipPath: 'inset(0% 100% 0% 0% round 1rem)' },
            { clipPath: 'inset(0% 0% 0% 0% round 1rem)', duration: 1.4, ease: 'expo.inOut' },
          )
          .from(card.querySelector('.op-img'), { scale: 1.2, duration: 1.8, ease: 'expo.out' }, 0.1)
          .from(card.querySelectorAll('.op-fade'), { y: 30, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: 0.07 }, 0.4)
      })
    },
    { scope: root },
  )

  return (
    <section id="other-projects" ref={root} className="relative px-pad py-[clamp(6rem,12vw,10rem)]">
      <SectionLabel index="03" title={t.other.title} note={t.other.subtitle} />
      <RevealChars
        text={t.other.heading}
        className="mt-10 font-display text-[clamp(2.75rem,8vw,8rem)] font-bold uppercase leading-[0.88] tracking-[-0.025em]"
      />

      <div className="mt-14 flex flex-col gap-20 md:mt-20">
        {otherProjects.map((p, i) => {
          const github = p.links?.find((l) => l.label === 'GitHub')
          const site = websiteOf(p)
          return (
            <article key={p.slug} className="op-card grid gap-10 md:grid-cols-12 md:gap-12">
              <button
                type="button"
                onClick={() => setOpenIndex(i)}
                aria-label={`${t.projects.viewMore}: ${tx(p.title, lang)}`}
                className="op-cover group relative block aspect-[16/10] overflow-hidden rounded-2xl border border-line bg-ink-2 md:col-span-7"
              >
                <span className="op-img absolute inset-0 block">
                  <Image
                    src={p.cover}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 58vw, 100vw"
                    className="object-cover transition-transform duration-1000 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-[1.04]"
                  />
                </span>
                <span className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-bone px-4 py-2.5 text-sm font-medium text-ink opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  {t.projects.viewMore}
                  <ArrowUpRight size={15} />
                </span>
              </button>

              <div className="flex flex-col md:col-span-5">
                <p className="op-fade label flex items-center gap-3">
                  <span className="rounded-full border border-line-strong px-2.5 py-1 text-bone">{categoryLabel[p.category]}</span>
                  {p.stack.join(' · ')}
                </p>
                <h3 className="op-fade mt-5 font-display text-[clamp(2.25rem,4vw,4rem)] font-bold uppercase leading-[0.9] tracking-[-0.025em]">
                  {tx(p.title, lang)}
                </h3>

                {p.story && (
                  <>
                    <p className="op-fade mt-5 text-xl leading-snug text-bone/90">
                      <span className="text-dim">“</span>
                      {tx(p.story.hook, lang)}
                      <span className="text-dim">”</span>
                    </p>
                    <div className="op-fade mt-8 flex flex-col gap-5 border-l border-line-strong pl-5">
                      <div>
                        <p className="label mb-2 flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                          {t.projects.problem}
                        </p>
                        <p className="leading-relaxed text-muted">{tx(p.story.problem, lang)}</p>
                      </div>
                      <div>
                        <p className="label mb-2 flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full" style={{ background: p.color }} />
                          {t.projects.solution}
                        </p>
                        <p className="leading-relaxed text-bone/85">{tx(p.story.solution, lang)}</p>
                      </div>
                    </div>
                  </>
                )}

                <div className="op-fade mt-10 flex flex-wrap gap-3">
                  <Magnetic>
                    <button onClick={() => setOpenIndex(i)} className="btn btn-primary">
                      <RollText>{t.projects.viewMore}</RollText>
                      <ArrowRight size={15} />
                    </button>
                  </Magnetic>
                  {site && (
                    <Magnetic>
                      <a href={site.href} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                        <Globe size={15} />
                        <RollText>{linkText(site)}</RollText>
                      </a>
                    </Magnetic>
                  )}
                  {github && (
                    <Magnetic>
                      <a href={github.href} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                        <SiGithub size={15} />
                        <RollText>GitHub</RollText>
                      </a>
                    </Magnetic>
                  )}
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {openIndex !== null && <ProjectSheet list={otherProjects} index={openIndex} onClose={() => setOpenIndex(null)} />}
    </section>
  )
}
