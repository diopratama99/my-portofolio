'use client'

import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap'

// A few greetings, unhurried, ending on the one from home.
const greetings = ['Hello', 'Bonjour', 'こんにちは', 'Halo']
const IN_DURATION = 0.5
const IN_STAGGER = 0.035
const HOLD = 0.18 // how long a greeting rests once fully in
const OUT_DURATION = 0.3
const HOLD_LAST = 0.6

export default function Preloader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  const counter = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set(root.current, { display: 'none' })
        onDone()
        return
      }

      const words = gsap.utils.toArray<HTMLElement>('.pl-word')
      const tl = gsap.timeline()

      // Letters drift up and sharpen one after another, hold, then soften away upward.
      // Laid out one word after the other: a word only starts leaving once its last
      // letter has fully arrived (otherwise that still-running entrance wins and leaves
      // letters stranded on screen), and the next word waits until it's nearly gone.
      let cursor = 0
      let total = 0
      words.forEach((word, i) => {
        const chars = word.querySelectorAll('.pl-char')
        const inEnd = cursor + IN_DURATION + IN_STAGGER * (chars.length - 1)
        tl.set(word, { autoAlpha: 1 }, cursor).fromTo(
          chars,
          { yPercent: 40, autoAlpha: 0, filter: 'blur(10px)' },
          { yPercent: 0, autoAlpha: 1, filter: 'blur(0px)', duration: IN_DURATION, ease: 'power3.out', stagger: IN_STAGGER },
          cursor,
        )
        if (i < words.length - 1) {
          const outStart = inEnd + HOLD
          tl.to(
            chars,
            { yPercent: -30, autoAlpha: 0, filter: 'blur(8px)', duration: OUT_DURATION, ease: 'power2.in', stagger: 0.015 },
            outStart,
          ).set(word, { autoAlpha: 0 }, outStart + OUT_DURATION + 0.015 * chars.length)
          cursor = outStart + OUT_DURATION * 0.7
        } else {
          total = inEnd + HOLD_LAST
        }
      })
      const progress = { v: 0 }
      tl.to(
        progress,
        {
          v: 100,
          duration: total,
          ease: 'power1.inOut',
          onUpdate: () => {
            if (counter.current) counter.current.textContent = String(Math.round(progress.v))
          },
        },
        0,
      )
        .fromTo('.pl-bar', { scaleX: 0 }, { scaleX: 1, duration: total, ease: 'power1.inOut' }, 0)
        .to('.pl-content', { autoAlpha: 0, y: -20, duration: 0.5, ease: 'power2.in' }, total)
        .to(root.current, { yPercent: -100, duration: 1.1, ease: 'expo.inOut' }, '-=0.15')
        .add(onDone, '-=0.75')
        .set(root.current, { display: 'none' })
    },
    { scope: root },
  )

  return (
    <div ref={root} className="fixed inset-0 z-[100] bg-ink-2" aria-hidden="true">
      <div className="pl-content flex h-full flex-col items-center justify-center gap-7 px-pad">
        <div className="relative h-[1.3em] w-full font-display text-[clamp(2.75rem,7vw,5rem)] font-semibold tracking-[-0.04em]">
          {greetings.map((g) => (
            <span key={g} className="pl-word invisible absolute inset-0 flex items-center justify-center leading-none">
              {Array.from(g).map((ch, i) => (
                <span key={i} className="pl-char inline-block will-change-[transform,filter,opacity]">
                  {ch}
                </span>
              ))}
            </span>
          ))}
        </div>
        <div className="h-px w-48 bg-line">
          <div className="pl-bar h-full origin-left bg-bone" style={{ transform: 'scaleX(0)' }} />
        </div>
        <span className="label flex w-48 justify-between">
          <span>Dio Pratama</span>
          <span className="tabular-nums">
            <span ref={counter}>0</span>%
          </span>
        </span>
      </div>
    </div>
  )
}
