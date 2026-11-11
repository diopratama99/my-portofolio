'use client'

import { useId, useRef, type RefObject } from 'react'
import { gsap, useGSAP, prefersReducedMotion, isTouchDevice } from '@/lib/gsap'

/*
 * bolubi, the companion from Ingatanku, ported from the app's Flutter painter
 * (companion/presentation/widgets/blob_painter.dart + blob_mascot.dart):
 * same body superellipse (with its living wobble), proportions, colours and
 * pose maths, drawn as SVG and driven by one per-frame pose like the original.
 *
 * Motion is physical rather than keyframed, so nothing snaps:
 *  - api.moveTo(x) sets where it wants to be; it gets there on a spring and its
 *    steps are tied to the distance covered, so a fast scroll means quick little
 *    hops, a slow one careful steps, and it brakes (leaning back) when you stop.
 *  - Lean, sprout and arms are springs too: the sprout lags and overshoots,
 *    arms swing with each step, eyes squish on landing.
 * Idle: breathes, blinks, looks at the pointer, now and then looks around, hops
 * or wiggles. Hover: petted (happy eyes, rosier cheeks). Click: a joyful double
 * hop with hearts. api.speak() moves its mouth as if talking.
 */

export type BolubiApi = {
  moveTo: (x: number) => void
  /** Where it currently is, in px from its starting spot */
  x: () => number
  hop: () => void
  speak: (ms?: number) => void
}

// ─── geometry (unit s = 200, ground at y = G) ─────────────────────────────
const S = 200
const G = 192
const CX = 100
const RX = S * 0.42
const RY = S * 0.37

const INK = '#2A2520'
const BASE = '#F2C76E' // BlobColor.honey
const SHADE = '#CFA046'
const LIGHT = '#F6D797' // base lerped 28% toward white

/** Superellipse outline (rounder top n≈2.1, flatter sitting bottom n≈3.2), as unit offsets. */
const OUTLINE = (() => {
  const n = 72
  return Array.from({ length: n + 1 }, (_, i) => {
    const th = (i / n) * Math.PI * 2
    const c = Math.cos(th)
    const sn = Math.sin(th)
    const e = sn > 0 ? 2 / 3.2 : 2 / 2.1
    return { th, x: RX * Math.sign(c) * Math.abs(c) ** e, y: RY * Math.sign(sn) * Math.abs(sn) ** e }
  })
})()

/** The body path at time t, with the app's slow wobble so it never looks like a stone. */
function bodyPath(t: number) {
  let d = ''
  OUTLINE.forEach(({ th, x, y }, i) => {
    const w = 1 + 0.012 * Math.sin(3 * th + 2.1 * t) + 0.007 * Math.sin(5 * th - 1.3 * t)
    d += `${i ? 'L' : 'M'}${(CX + x * w).toFixed(2)} ${(G - RY + y * w).toFixed(2)}`
  })
  return d + 'Z'
}

const FACE_Y = G - RY * 1.08
const EYE_DX = S * 0.12
const EW = S * 0.068
const EH = S * 0.092
const SPROUT_BASE = { x: 104, y: G - 2 * RY + 3 }

/** Screen pixels covered per little hop while walking. */
const STRIDE = 48
/** Walking pace cap (px/s): it falls behind on a fast scroll and catches up after. ~3 hops/s at full pace. */
const MAX_SPEED = 160

/** A hump of height h between start and start+dur (seconds), like the app's _hop. */
const hump = (d: number, start: number, dur: number, h: number) => {
  const q = (d - start) / dur
  return q <= 0 || q >= 1 ? 0 : h * Math.sin(Math.PI * q)
}
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

const happyEye = (cx: number, cy: number) =>
  `M${cx - EW * 0.65} ${cy + EH * 0.12} Q${cx} ${cy - EH * 0.55} ${cx + EW * 0.65} ${cy + EH * 0.12}`
const closedEye = (cx: number, cy: number) =>
  `M${cx - EW * 0.65} ${cy - EH * 0.02} Q${cx} ${cy + EH * 0.42} ${cx + EW * 0.65} ${cy - EH * 0.02}`

function openMouth(mx: number, my: number, open: number) {
  const w = S * 0.075
  const h = S * 0.018 + S * 0.06 * open
  return {
    d: `M${mx - w / 2} ${my} Q${mx} ${my - S * 0.008} ${mx + w / 2} ${my} Q${mx + w * 0.45} ${my + h} ${mx} ${my + h} Q${mx - w * 0.45} ${my + h} ${mx - w / 2} ${my} Z`,
    tongue: { cx: mx, cy: my + h * 0.95, rx: w * 0.31, ry: h * 0.35 },
  }
}

const deg = (rad: number) => ((rad * 180) / Math.PI).toFixed(2)

export function Bolubi({
  message,
  bubbleAlign = 'left',
  apiRef,
  label = 'bolubi',
  className = '',
}: {
  message?: string
  bubbleAlign?: 'left' | 'right'
  apiRef?: RefObject<BolubiApi | null>
  label?: string
  className?: string
}) {
  const root = useRef<HTMLDivElement>(null)
  const id = useId().replace(/[^a-zA-Z0-9-]/g, '')

  useGSAP(
    () => {
      const el = root.current!
      const $ = <T extends Element>(sel: string) => el.querySelector<T>(sel)!
      const rig = $('.b-rig')
      const shadow = $('.b-shadow')
      const bodyFill = $('.b-body-fill')
      const bodyLine = $('.b-body-line')
      const face = $('.b-face')
      const sprout = $('.b-sprout')
      const arms = [$('.b-arm-l'), $('.b-arm-r')]
      const feet = [$('.b-foot-l'), $('.b-foot-r')]
      const eyesOpen = [$('.b-eye-l'), $('.b-eye-r')]
      const eyesCurve = [$<SVGPathElement>('.b-eyec-l'), $<SVGPathElement>('.b-eyec-r')]
      const blush = [$('.b-blush-l'), $('.b-blush-r')]
      const smile = $('.b-smile')
      const mouth = $<SVGPathElement>('.b-mouth')
      const mouthClip = $<SVGPathElement>('.b-mouth-clip')
      const tongue = $<SVGEllipseElement>('.b-tongue')
      const mouthGroup = $('.b-mouth-g')
      const reduced = prefersReducedMotion()

      const st = {
        t: 0,
        // travel
        placed: false,
        x: 0,
        vx: 0,
        targetX: 0,
        walk: 0, // 0..1 how much it's walking
        dir: 1,
        phase: 0,
        // springs
        tilt: 0,
        tiltV: 0,
        sprout: 0,
        sproutV: 0,
        // moods & one-shots
        petting: false,
        hopAt: -10,
        smallHopAt: -10,
        wiggleAt: -10,
        scanAt: -10,
        speakUntil: -1,
        blinkAt: -10,
        nextBlink: 1.5,
        nextIdle: 5,
        look: { x: 0, y: 0 },
        pointer: { x: 0, y: 0 },
      }

      const hearts = (count = 3) => {
        const fx = $('.b-fx')
        for (let i = 0; i < count; i++) {
          const h = document.createElement('span')
          h.textContent = '♥'
          h.className = 'absolute left-1/2 top-[25%] text-base text-[#F08A8A] pointer-events-none'
          fx.appendChild(h)
          gsap.fromTo(
            h,
            { x: 0, y: 0, scale: 0.4, autoAlpha: 1 },
            {
              x: gsap.utils.random(-34, 34),
              y: gsap.utils.random(-64, -40),
              scale: gsap.utils.random(0.9, 1.4),
              autoAlpha: 0,
              duration: 1.1,
              delay: i * 0.08,
              ease: 'power2.out',
              onComplete: () => h.remove(),
            },
          )
        }
      }

      const api: BolubiApi = {
        x: () => st.x,
        moveTo: (x) => {
          st.targetX = x
          if (!st.placed || reduced) {
            st.placed = true
            st.x = x
            el.style.transform = `translate3d(${x}px,0,0)`
          }
        },
        hop: () => {
          st.hopAt = st.t
          hearts()
        },
        speak: (ms = 1200) => {
          st.speakUntil = st.t + ms / 1000
        },
      }
      if (apiRef) apiRef.current = api

      const frame = (dt: number) => {
        st.t += dt
        const t = st.t

        // ── travel: a soft spring toward the target, capped at a walking pace
        const k = 18
        const prevVx = st.vx
        st.vx += (k * (st.targetX - st.x) - 2 * Math.sqrt(k) * st.vx) * dt
        st.vx = clamp(st.vx, -MAX_SPEED, MAX_SPEED)
        st.x += st.vx * dt
        // Actual acceleration (after the cap), for leaning when it sets off or brakes
        const ax = dt > 0 ? (st.vx - prevVx) / dt : 0
        const speed = Math.abs(st.vx)
        if (speed > 4) st.dir = Math.sign(st.vx)
        const walkTarget = clamp(speed / 60, 0, 1)
        st.walk += (walkTarget - st.walk) * Math.min(1, dt * (walkTarget > st.walk ? 10 : 3.5))
        // One hop per STRIDE pixels actually travelled
        st.phase += ((speed * dt) / STRIDE) * Math.PI
        const walk = st.walk
        const stepH = Math.abs(Math.sin(st.phase))

        // ── idle life
        if (t >= st.nextBlink) {
          st.blinkAt = t
          st.nextBlink = t + gsap.utils.random(2.2, 5)
        }
        if (t >= st.nextIdle && walk < 0.05 && !st.petting) {
          const pick = Math.random()
          if (pick < 0.45) st.scanAt = t
          else if (pick < 0.75) st.smallHopAt = t
          else st.wiggleAt = t
          st.nextIdle = t + gsap.utils.random(4, 8)
        }

        let jump = 0
        let squash = Math.sin(t * Math.PI) * 0.02 // breathing, ~0.5 Hz
        let wiggle = 0
        let eyes: 'open' | 'happy' | 'closed' = 'open'
        let mouthOpen = 0

        const bd = t - st.blinkAt
        let eyeOpen = bd >= 0 && bd < 0.16 ? 1 - Math.sin((Math.PI * bd) / 0.16) : 1

        // Walking: little hops, landing with a squash
        jump += stepH * S * 0.06 * walk
        squash += (1 - stepH) ** 3 * 0.07 * walk

        // Idle one-shots
        jump += hump(t - st.smallHopAt, 0, 0.34, S * 0.06)
        const wd = t - st.wiggleAt
        if (wd >= 0 && wd < 1) wiggle = Math.sin(wd * Math.PI * 6) * 0.09 * (1 - wd)

        // Joyful double hop (click)
        const hd = t - st.hopAt
        const hopping = hd >= 0 && hd < 1.4
        if (hopping) {
          eyes = 'happy'
          mouthOpen = 0.8
          if (hd < 0.12) squash += 0.13 * Math.sin((Math.PI * hd) / 0.12)
          jump += hump(hd, 0.12, 0.5, S * 0.3) + hump(hd, 0.72, 0.3, S * 0.1)
          squash -= 0.09 * (hump(hd, 0.12, 0.5, 1) + 0.6 * hump(hd, 0.72, 0.3, 1))
          squash += hump(hd, 0.62, 0.17, 0.13) + hump(hd, 1.02, 0.1, 0.08)
        }
        if (st.petting && !hopping) {
          eyes = 'happy'
          mouthOpen = 0.35
        }
        if (t < st.speakUntil && eyes === 'open') mouthOpen = 0.15 + 0.55 * Math.abs(Math.sin(t * 11))
        if (eyes !== 'open') eyeOpen = 1

        // ── springs: lean into the walk, rock back when braking
        const tiltTarget = st.dir * 0.1 * walk + clamp(-ax * 0.00035, -0.12, 0.12) + wiggle
        st.tiltV += ((tiltTarget - st.tilt) * 140 - st.tiltV * 13) * dt
        st.tilt += st.tiltV * dt

        // Sprout trails behind the motion and overshoots
        const sproutTarget = -st.tilt * 1.3 - clamp(st.vx * 0.0016, -0.5, 0.5) + Math.sin(t * 1.8) * 0.12
        st.sproutV += ((sproutTarget - st.sprout) * 95 - st.sproutV * 5.5) * dt
        st.sprout += st.sproutV * dt

        // Look: where it walks, otherwise the pointer (or a look around)
        const sd = t - st.scanAt
        let lookTarget = st.pointer
        if (sd >= 0 && sd < 1.8 && walk < 0.05) lookTarget = { x: Math.sin((sd / 1.8) * Math.PI * 2), y: -0.2 }
        lookTarget = {
          x: lookTarget.x * (1 - walk) + st.dir * 0.9 * walk,
          y: lookTarget.y * (1 - walk) + 0.05 * walk,
        }
        st.look.x += (lookTarget.x - st.look.x) * Math.min(1, dt * 7)
        st.look.y += (lookTarget.y - st.look.y) * Math.min(1, dt * 7)

        // ── apply
        el.style.transform = `translate3d(${st.x.toFixed(2)}px,0,0)`

        const air = Math.min(1, jump / (S * 0.5))
        rig.setAttribute(
          'transform',
          `translate(${CX} ${(G - jump).toFixed(2)}) rotate(${deg(st.tilt)}) scale(${(1 + squash).toFixed(4)} ${(1 - squash).toFixed(4)}) translate(${-CX} ${-G})`,
        )
        shadow.setAttribute('transform', `translate(${CX} ${G}) scale(${(1 - air * 0.45).toFixed(3)}) translate(${-CX} ${-G})`)
        shadow.setAttribute('opacity', (1 - air * 0.6).toFixed(3))

        const body = bodyPath(t)
        bodyFill.setAttribute('d', body)
        bodyLine.setAttribute('d', body)

        face.setAttribute('transform', `translate(${(st.look.x * S * 0.03).toFixed(2)} ${(st.look.y * S * 0.02).toFixed(2)})`)
        const ex = st.look.x * S * 0.016
        const ey = st.look.y * S * 0.012

        sprout.setAttribute('transform', `rotate(${deg(st.sprout)} ${SPROUT_BASE.x} ${SPROUT_BASE.y})`)

        // Arms swing opposite each other with the steps; a lazy sway at rest
        const swing = Math.sin(st.phase) * 0.55 * walk + Math.sin(t * 1.3) * 0.06
        arms.forEach((a, i) => {
          const dir = i === 0 ? -1 : 1
          a.setAttribute(
            'transform',
            `translate(${(CX + dir * RX * 0.9).toFixed(2)} ${(G - RY * 0.8).toFixed(2)}) rotate(${deg(dir * 0.5 + (i === 0 ? swing : -swing))})`,
          )
        })
        // Feet lift alternately, one per hop
        feet[0].setAttribute('transform', `translate(0 ${(-Math.max(0, Math.sin(st.phase)) * 7 * walk).toFixed(2)})`)
        feet[1].setAttribute('transform', `translate(0 ${(-Math.max(0, -Math.sin(st.phase)) * 7 * walk).toFixed(2)})`)

        blush.forEach((b) => b.setAttribute('fill-opacity', eyes === 'happy' ? '0.55' : '0.34'))

        // Eyes squish a little on every landing
        const squish = clamp(1 - Math.max(0, squash) * 2.2, 0.55, 1)
        ;[-1, 1].forEach((dir, i) => {
          const cx = CX + dir * EYE_DX + ex
          const cy = FACE_Y + ey
          const shut = eyeOpen < 0.2 && eyes === 'open'
          if (eyes === 'open' && !shut) {
            eyesOpen[i].setAttribute('visibility', 'visible')
            eyesCurve[i].setAttribute('visibility', 'hidden')
            eyesOpen[i].setAttribute('transform', `translate(${cx.toFixed(2)} ${cy.toFixed(2)}) scale(1 ${(eyeOpen * squish).toFixed(3)})`)
          } else {
            eyesOpen[i].setAttribute('visibility', 'hidden')
            eyesCurve[i].setAttribute('visibility', 'visible')
            eyesCurve[i].setAttribute('d', eyes === 'happy' ? happyEye(cx, cy) : closedEye(cx, cy))
            eyesCurve[i].setAttribute('stroke-width', String(eyes === 'happy' ? S * 0.022 : S * 0.02))
          }
        })

        const my = FACE_Y + S * 0.085
        if (mouthOpen > 0.05) {
          const m = openMouth(CX, my, mouthOpen)
          smile.setAttribute('visibility', 'hidden')
          mouthGroup.setAttribute('visibility', 'visible')
          mouth.setAttribute('d', m.d)
          mouthClip.setAttribute('d', m.d)
          tongue.setAttribute('cx', String(m.tongue.cx))
          tongue.setAttribute('cy', String(m.tongue.cy))
          tongue.setAttribute('rx', String(m.tongue.rx))
          tongue.setAttribute('ry', String(m.tongue.ry))
          tongue.setAttribute('visibility', mouthOpen > 0.3 ? 'visible' : 'hidden')
        } else {
          smile.setAttribute('visibility', 'visible')
          mouthGroup.setAttribute('visibility', 'hidden')
        }
      }

      const onMove = (e: MouseEvent) => {
        const r = el.getBoundingClientRect()
        const dx = e.clientX - (r.left + r.width / 2)
        const dy = e.clientY - (r.top + r.height * 0.5)
        const d = Math.hypot(dx, dy) || 1
        const pull = Math.min(d / 260, 1)
        st.pointer = { x: (dx / d) * pull, y: (dy / d) * pull }
      }

      const hit = $('.b-hit')
      const enter = () => (st.petting = true)
      const leave = () => (st.petting = false)
      const click = () => api.hop()
      hit.addEventListener('mouseenter', enter)
      hit.addEventListener('mouseleave', leave)
      hit.addEventListener('click', click)
      if (!isTouchDevice()) window.addEventListener('mousemove', onMove)

      // dt in seconds, capped so a backgrounded tab doesn't fling it across the screen
      const tick = () => frame(Math.min(gsap.ticker.deltaRatio(60) / 60, 1 / 20))
      frame(0)
      // Animate only while on screen. IntersectionObserver reads where it is actually
      // drawn, so it stays right inside the pinned (translated) projects section,
      // where a ScrollTrigger would think it had already scrolled away.
      let running = false
      const io = reduced
        ? null
        : new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !running) gsap.ticker.add(tick)
            if (!entry.isIntersecting && running) gsap.ticker.remove(tick)
            running = entry.isIntersecting
          })
      io?.observe(el)

      return () => {
        io?.disconnect()
        gsap.ticker.remove(tick)
        hit.removeEventListener('mouseenter', enter)
        hit.removeEventListener('mouseleave', leave)
        hit.removeEventListener('click', click)
        window.removeEventListener('mousemove', onMove)
        if (apiRef) apiRef.current = null
      }
    },
    { scope: root },
  )

  // Pop the speech bubble whenever the line changes
  useGSAP(
    () => {
      if (!message || prefersReducedMotion()) return
      gsap.fromTo(
        root.current!.querySelector('.b-bubble'),
        { scale: 0.7, autoAlpha: 0, y: 6 },
        { scale: 1, autoAlpha: 1, y: 0, duration: 0.5, ease: 'back.out(2.2)' },
      )
    },
    { scope: root, dependencies: [message] },
  )

  const coat = `bcoat-${id}`
  const clip = `bmouth-${id}`
  const restBody = bodyPath(0)

  return (
    <div ref={root} className={`relative select-none will-change-transform ${className}`}>
      {message && (
        <div
          className={`b-bubble pointer-events-none absolute bottom-[calc(100%+4px)] z-10 rounded-2xl bg-bone px-3.5 py-2 text-xs font-medium text-ink shadow-lg ${
            bubbleAlign === 'left' ? 'left-0 origin-bottom-left' : 'right-0 origin-bottom-right'
          }`}
          style={{ whiteSpace: 'nowrap' }}
        >
          {message}
          <span
            className={`absolute top-full h-2.5 w-2.5 -translate-y-1/2 rotate-45 bg-bone ${bubbleAlign === 'left' ? 'left-7' : 'right-7'}`}
          />
        </div>
      )}

      <button type="button" className="b-hit block w-full" aria-label={label}>
        <svg viewBox="0 0 200 200" className="block w-full overflow-visible" aria-hidden="true">
          <defs>
            <radialGradient id={coat} cx="0.325" cy="0.25" r="0.75">
              <stop offset="0" stopColor={LIGHT} />
              <stop offset="0.55" stopColor={BASE} />
              <stop offset="1" stopColor={SHADE} />
            </radialGradient>
            <clipPath id={clip}>
              <path className="b-mouth-clip" />
            </clipPath>
          </defs>

          <ellipse className="b-shadow" cx={CX} cy={G} rx={RX * 0.95} ry={S * 0.045} fill="rgba(0,0,0,0.38)" />

          <g className="b-rig">
            {/* Arms peek out from behind */}
            {(['l', 'r'] as const).map((side) => {
              const dir = side === 'l' ? -1 : 1
              return (
                <g key={side} className={`b-arm-${side}`} transform={`translate(${CX + dir * RX * 0.9} ${G - RY * 0.8}) rotate(${dir * 28.6})`}>
                  <ellipse cx={dir * S * 0.03} cy="0" rx={S * 0.065} ry={S * 0.0425} fill={SHADE} />
                </g>
              )
            })}
            {/* Feet */}
            <ellipse className="b-foot-l" cx={CX - RX * 0.42} cy={G - S * 0.012} rx={S * 0.085} ry={S * 0.0375} fill={SHADE} />
            <ellipse className="b-foot-r" cx={CX + RX * 0.42} cy={G - S * 0.012} rx={S * 0.085} ry={S * 0.0375} fill={SHADE} />

            {/* Body */}
            <path className="b-body-fill" d={restBody} fill={`url(#${coat})`} />
            <path className="b-body-line" d={restBody} fill="none" stroke={SHADE} strokeOpacity="0.55" strokeWidth={RX * 0.028} />
            <ellipse
              cx="0"
              cy="0"
              rx={RX * 0.21}
              ry={RY * 0.1}
              fill="#FFFFFF"
              fillOpacity="0.42"
              transform={`translate(${CX - RX * 0.42} ${G - RY * 1.58}) rotate(-31.5)`}
            />

            {/* Sprout */}
            <g className="b-sprout">
              <g transform={`translate(${SPROUT_BASE.x} ${SPROUT_BASE.y})`}>
                <path d={`M0 0 Q${-S * 0.01} ${-S * 0.06} ${S * 0.005} ${-S * 0.11}`} fill="none" stroke="#5E8C4A" strokeWidth={S * 0.02} strokeLinecap="round" />
                <g transform={`translate(${S * 0.005} ${-S * 0.11}) rotate(-34.4)`}>
                  <path d={`M0 0 Q${S * 0.05} ${-S * 0.042} ${S * 0.1} 0 Q${S * 0.05} ${S * 0.042} 0 0 Z`} fill="#7DB765" />
                </g>
                <g transform={`translate(${S * 0.005} ${-S * 0.11}) rotate(208.6)`}>
                  <path d={`M0 0 Q${S * 0.0425} ${-S * 0.0357} ${S * 0.085} 0 Q${S * 0.0425} ${S * 0.0357} 0 0 Z`} fill="#94C97C" />
                </g>
              </g>
            </g>

            {/* Face */}
            <g className="b-face">
              <ellipse className="b-blush-l" cx={CX - S * 0.2} cy={FACE_Y + S * 0.07} rx={S * 0.045} ry={S * 0.026} fill="#F08A8A" fillOpacity="0.34" />
              <ellipse className="b-blush-r" cx={CX + S * 0.2} cy={FACE_Y + S * 0.07} rx={S * 0.045} ry={S * 0.026} fill="#F08A8A" fillOpacity="0.34" />

              {(['l', 'r'] as const).map((side) => (
                <g key={side} className={`b-eye-${side}`} transform={`translate(${CX + (side === 'l' ? -1 : 1) * EYE_DX} ${FACE_Y})`}>
                  <ellipse cx="0" cy="0" rx={EW / 2} ry={EH / 2} fill={INK} />
                  <circle cx={-EW * 0.18} cy={-EH * 0.22} r={EW * 0.22} fill="#FFFFFF" />
                  <circle cx={EW * 0.16} cy={EH * 0.2} r={EW * 0.09} fill="#FFFFFF" />
                </g>
              ))}
              <path className="b-eyec-l" fill="none" stroke={INK} strokeLinecap="round" visibility="hidden" />
              <path className="b-eyec-r" fill="none" stroke={INK} strokeLinecap="round" visibility="hidden" />

              <path
                className="b-smile"
                d={`M${CX - S * 0.032} ${FACE_Y + S * 0.085} Q${CX} ${FACE_Y + S * 0.115} ${CX + S * 0.032} ${FACE_Y + S * 0.085}`}
                fill="none"
                stroke={INK}
                strokeWidth={S * 0.016}
                strokeLinecap="round"
              />
              <g className="b-mouth-g" visibility="hidden">
                <path className="b-mouth" fill={INK} />
                <ellipse className="b-tongue" fill="#E8737A" clipPath={`url(#${clip})`} />
              </g>
            </g>
          </g>
        </svg>
      </button>

      <div className="b-fx pointer-events-none absolute inset-0" aria-hidden="true" />
    </div>
  )
}
