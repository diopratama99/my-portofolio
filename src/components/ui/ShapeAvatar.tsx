'use client'

import { useId, useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from '@/lib/gsap'

/*
 * Photo masked by Material 3 Expressive–style shapes (cookie, clover, flower, squircle).
 * Each shape is sampled as radii at the same fixed angles, so a morph is a plain
 * per-point blend between two arrays. Spinning is an SVG rotate transform, which keeps
 * the per-frame cost to a single attribute write.
 */

const POINTS = 144
const ANGLES = Array.from({ length: POINTS }, (_, i) => (i / POINTS) * Math.PI * 2)
const sample = (r: (a: number) => number) => ANGLES.map(r)

const SHAPES = [
  sample((a) => 0.465 + 0.035 * Math.cos(9 * a)), // cookie
  sample((a) => 0.43 + 0.07 * Math.cos(4 * a)), // clover
  sample((a) => 0.455 + 0.045 * Math.cos(6 * a)), // flower
  sample((a) => 0.42 * Math.pow(Math.abs(Math.cos(a)) ** 4 + Math.abs(Math.sin(a)) ** 4, -1 / 4)), // squircle
]
const CIRCLE = sample(() => 0.5)

function toPath(radii: number[], scale = 1) {
  let d = ''
  for (let i = 0; i < POINTS; i++) {
    const r = radii[i] * scale
    d += `${i ? 'L' : 'M'}${(0.5 + r * Math.cos(ANGLES[i])).toFixed(4)} ${(0.5 + r * Math.sin(ANGLES[i])).toFixed(4)}`
  }
  return d + 'Z'
}

export function ShapeAvatar({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  const root = useRef<HTMLButtonElement>(null)
  const clipId = `avatar-${useId().replace(/[^a-zA-Z0-9-]/g, '')}`

  useGSAP(
    () => {
      const el = root.current!
      const clip = el.querySelector('.av-clip')!
      const back = el.querySelector('.av-back')!
      const img = el.querySelector('.av-img')
      const state = { from: SHAPES[0], to: SHAPES[0], t: 0, rot: 0, index: 0, hovering: false }

      const current = () => state.from.map((r, i) => r + (state.to[i] - r) * state.t)
      const drawShape = () => {
        const radii = current()
        clip.setAttribute('d', toPath(radii))
        back.setAttribute('d', toPath(radii, 1.12))
      }
      const drawRotation = () => {
        const deg = (state.rot * 180) / Math.PI
        clip.setAttribute('transform', `rotate(${deg.toFixed(2)} 0.5 0.5)`)
        back.setAttribute('transform', `rotate(${(-deg * 1.6 + 20).toFixed(2)} 0.5 0.5)`)
      }
      drawShape()
      drawRotation()
      if (prefersReducedMotion()) return

      let morph: gsap.core.Tween | null = null
      const morphTo = (target: number[], duration = 0.9) => {
        state.from = current()
        state.to = target
        state.t = 0
        morph?.kill()
        morph = gsap.to(state, { t: 1, duration, ease: 'expo.inOut', onUpdate: drawShape })
      }
      const nextShape = () => {
        state.index = (state.index + 1) % SHAPES.length
        morphTo(SHAPES[state.index])
      }

      // Slow spin and an automatic shape change, only while the avatar is on screen
      const spin = () => {
        state.rot += state.hovering ? 0.002 : 0.006
        drawRotation()
      }
      const auto = gsap.delayedCall(2.6, () => {
        if (!state.hovering) nextShape()
        auto.restart(true)
      })
      auto.pause()

      let spinning = false
      ScrollTrigger.create({
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => {
          if (self.isActive && !spinning) {
            gsap.ticker.add(spin)
            auto.restart(true)
          } else if (!self.isActive && spinning) {
            gsap.ticker.remove(spin)
            auto.pause()
          }
          spinning = self.isActive
        },
      })

      const enter = () => {
        state.hovering = true
        morphTo(CIRCLE, 0.7)
        gsap.to(img, { scale: 1.06, svgOrigin: '0.5 0.5', duration: 0.8, ease: 'expo.out' })
      }
      const leave = () => {
        state.hovering = false
        morphTo(SHAPES[state.index], 0.9)
        gsap.to(img, { scale: 1, svgOrigin: '0.5 0.5', duration: 0.8, ease: 'expo.out' })
      }
      const click = () => {
        nextShape()
        gsap.fromTo(el, { scale: 0.92 }, { scale: 1, duration: 0.8, ease: 'elastic.out(1, 0.4)' })
      }
      el.addEventListener('mouseenter', enter)
      el.addEventListener('mouseleave', leave)
      el.addEventListener('click', click)

      return () => {
        gsap.ticker.remove(spin)
        el.removeEventListener('mouseenter', enter)
        el.removeEventListener('mouseleave', leave)
        el.removeEventListener('click', click)
      }
    },
    { scope: root },
  )

  return (
    <button ref={root} type="button" aria-label={alt} className={`block aspect-square ${className}`}>
      <svg viewBox="0 0 1 1" className="h-full w-full overflow-visible" aria-hidden="true">
        <defs>
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
            <path className="av-clip" />
          </clipPath>
        </defs>
        <path className="av-back" fill="rgba(84,104,255,0.22)" />
        <g clipPath={`url(#${clipId})`}>
          <image className="av-img" href={src} x="0" y="0" width="1" height="1" preserveAspectRatio="xMidYMid slice" />
        </g>
      </svg>
    </button>
  )
}
