'use client'

import { useRef } from 'react'
import { Cloud, Laptop, Server } from 'lucide-react'
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap'

const ICONS = [Laptop, Server, Cloud]
const PACKETS_PER_BURST = 3
const REPLY_COLOR = '#2FB57E'

const linkStyle = {
  top: 21,
  height: 2,
  backgroundImage: 'repeating-linear-gradient(90deg, var(--line-strong) 0 6px, transparent 6px 12px)',
}

function Burst({ name, color }: { name: string; color: string }) {
  return (
    <>
      {Array.from({ length: PACKETS_PER_BURST }).map((_, i) => (
        <span
          key={i}
          className={`${name} absolute rounded-full`}
          style={{ top: -2, left: 0, width: 6, height: 6, marginLeft: -3, background: color, opacity: 0 }}
        />
      ))}
    </>
  )
}

/** MacBook <-> home server traffic, then a deploy out to the cloud, drawn as a live network link. */
export function NetworkFlow({ steps }: { steps: string[] }) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const el = root.current!

      const send = (tl: gsap.core.Timeline, selector: string, from: string, to: string, ring: string, at: string | number) => {
        tl.fromTo(
          selector,
          { left: from, opacity: 0 },
          {
            left: to,
            duration: 0.75,
            ease: 'none',
            stagger: 0.11,
            keyframes: { opacity: [0, 1, 1, 1, 0] },
          },
          at,
        ).fromTo(ring, { scale: 1, opacity: 0.7 }, { scale: 1.9, opacity: 0, duration: 0.6, ease: 'power2.out' }, '>-0.15')
      }

      const traffic = gsap.timeline({ repeat: -1, repeatDelay: 0.7, paused: true })
      // Develop: requests to the self-hosted backend and replies back, twice
      for (let i = 0; i < 2; i++) {
        send(traffic, '.nf-req', '0%', '100%', '.nf-ring-1', i === 0 ? 0 : '+=0.15')
        send(traffic, '.nf-res', '100%', '0%', '.nf-ring-0', '+=0.05')
      }
      // Ship: the backend moves out to the cloud
      send(traffic, '.nf-ship', '0%', '100%', '.nf-ring-2', '+=0.3')

      const dashes = gsap.to('.nf-link', { backgroundPositionX: 12, duration: 0.7, ease: 'none', repeat: -1, paused: true })
      const leds = gsap.to('.nf-led', {
        opacity: 0.25,
        duration: 0.5,
        ease: 'steps(1)',
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.23, repeat: -1, yoyo: true },
        paused: true,
      })
      const loops = [traffic, dashes, leds]

      // Only runs while the diagram is on screen
      const io = new IntersectionObserver(([entry]) => loops.forEach((l) => l.paused(!entry.isIntersecting)))
      io.observe(el)
      return () => io.disconnect()
    },
    { scope: root },
  )

  return (
    <div ref={root} className="relative grid grid-cols-3">
      <div className="nf-link absolute" style={{ ...linkStyle, left: '16.66%', width: '33.33%' }}>
        <Burst name="nf-req" color="var(--accent)" />
        <Burst name="nf-res" color={REPLY_COLOR} />
      </div>
      <div className="nf-link absolute" style={{ ...linkStyle, left: '50%', width: '33.33%' }}>
        <Burst name="nf-ship" color="var(--accent)" />
      </div>

      {steps.map((step, i) => {
        const Icon = ICONS[i]
        return (
          <div key={step} className="ws-step relative flex flex-col items-center gap-3 px-1 text-center">
            <span className="relative flex items-center justify-center rounded-full" style={{ width: 44, height: 44 }}>
              <span
                className={`nf-ring-${i} absolute inset-0 rounded-full`}
                style={{ border: '2px solid var(--accent)', opacity: 0 }}
              />
              <span
                className="absolute inset-0 rounded-full"
                style={{ background: 'var(--ink)', border: '1px solid var(--line-strong)' }}
              />
              <Icon size={19} className="relative" aria-hidden="true" />
              <span
                className="nf-led absolute rounded-full"
                style={{ top: 2, right: 2, width: 8, height: 8, background: REPLY_COLOR, border: '1.5px solid var(--ink)' }}
              />
            </span>
            <span className="text-sm leading-snug text-bone">{step}</span>
          </div>
        )
      })}
    </div>
  )
}
