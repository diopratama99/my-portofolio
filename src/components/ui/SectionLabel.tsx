'use client'

import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap'

/** "(01) ——— About            Getting to know me" header row that draws itself in. */
export function SectionLabel({ index, title, note }: { index: string; title: string; note?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: 'top 90%', toggleActions: 'play none none reverse' },
      })
      tl.from('.sl-line', { scaleX: 0, transformOrigin: 'left center', duration: 1, ease: 'expo.inOut' })
        .from('.sl-text', { yPercent: 110, duration: 0.8, ease: 'expo.out', stagger: 0.08 }, 0.2)
    },
    { scope: ref },
  )

  return (
    <div ref={ref} className="label flex items-center gap-4 whitespace-nowrap">
      <span className="mask">
        <span className="sl-text block text-accent-soft">({index})</span>
      </span>
      <span className="sl-line h-px w-10 bg-line-strong md:w-16" />
      <span className="mask">
        <span className="sl-text block text-bone">{title}</span>
      </span>
      {note && (
        <span className="mask ml-auto hidden md:inline-block">
          <span className="sl-text block">{note}</span>
        </span>
      )}
    </div>
  )
}
