'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { gsap, useGSAP, prefersReducedMotion, isTouchDevice } from '@/lib/gsap'
import { useLanguage } from '@/contexts/LanguageContext'
import { mobileApps, tx } from '@/data/projects'

const SCREENS_PER_APP = 5
const AUTO_MS = 3200

/**
 * A phone that shows real screens from the Flutter apps. Tilts toward the
 * pointer, advances on tap, switches apps from the pills below, and
 * auto-plays while nobody is interacting with it.
 */
export default function PhoneShowcase() {
  const { t, lang } = useLanguage()
  const root = useRef<HTMLDivElement>(null)
  const [appIndex, setAppIndex] = useState(0)
  const [screenIndex, setScreenIndex] = useState(0)
  const [hovered, setHovered] = useState(false)

  const app = mobileApps[appIndex]
  const screens = app.screens.slice(0, SCREENS_PER_APP)
  const screen = screens[screenIndex]

  const next = () => {
    if (screenIndex < screens.length - 1) setScreenIndex(screenIndex + 1)
    else {
      setAppIndex((appIndex + 1) % mobileApps.length)
      setScreenIndex(0)
    }
  }

  const pickApp = (i: number) => {
    setAppIndex(i)
    setScreenIndex(0)
  }

  // Auto-advance while idle
  useEffect(() => {
    if (hovered || prefersReducedMotion()) return
    const id = setTimeout(next, AUTO_MS)
    return () => clearTimeout(id)
  })

  // Tilt toward the pointer
  useGSAP(
    () => {
      if (isTouchDevice() || prefersReducedMotion()) return
      const phone = root.current!.querySelector('.ph-body')
      const rx = gsap.quickTo(phone, 'rotationX', { duration: 1, ease: 'power3' })
      const ry = gsap.quickTo(phone, 'rotationY', { duration: 1, ease: 'power3' })
      const onMove = (e: MouseEvent) => {
        ry((e.clientX / window.innerWidth - 0.5) * 22)
        rx(-(e.clientY / window.innerHeight - 0.5) * 14)
      }
      window.addEventListener('mousemove', onMove)
      return () => window.removeEventListener('mousemove', onMove)
    },
    { scope: root },
  )

  // Wipe the new screen in from below, and swap the caption
  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.fromTo(
        '.ph-screen-current',
        { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.02 },
        { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 0.9, ease: 'expo.out' },
      )
      gsap.fromTo('.ph-caption', { yPercent: 100, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.6, ease: 'expo.out' })
    },
    { scope: root, dependencies: [appIndex, screenIndex] },
  )

  // Story-style progress bars: filled up to the current screen, current one fills over AUTO_MS
  const progress = useRef<gsap.core.Tween | null>(null)
  useGSAP(
    () => {
      const bars = gsap.utils.toArray<HTMLElement>('.ph-bar')
      bars.forEach((bar, i) => gsap.set(bar, { scaleX: i < screenIndex ? 1 : 0, overwrite: true }))
      if (prefersReducedMotion() || !bars[screenIndex]) return
      progress.current = gsap.to(bars[screenIndex], { scaleX: 1, duration: AUTO_MS / 1000, ease: 'none' })
    },
    { scope: root, dependencies: [appIndex, screenIndex] },
  )

  // Hovering holds the current screen; leaving restarts its timer and bar together
  useEffect(() => {
    if (hovered) progress.current?.pause()
    else progress.current?.restart()
  }, [hovered])

  return (
    <div ref={root} className="flex flex-col items-center gap-6" style={{ perspective: '1400px' }}>
      <button
        type="button"
        onClick={next}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label={`${tx(app.title, lang)} — ${tx(screen.label, lang)}. Tap for next screen`}
        className="ph-body relative block"
        style={{ height: 'clamp(380px, 62vh, 640px)', aspectRatio: '560 / 1124' }}
      >
        {/* Soft glow in the app's colour behind the device */}
        <span
          aria-hidden="true"
          className="absolute inset-[10%] rounded-full blur-3xl transition-colors duration-700"
          style={{ background: `${app.color}33` }}
        />
        {/* The screenshots already include a thin device frame, so no extra bezel here */}
        <span className="absolute inset-0" style={{ filter: 'drop-shadow(0 30px 50px rgba(0,0,0,0.6))' }}>
          {/* Keep the previous screen underneath so the wipe reveals over it */}
          {screens.map((s, i) => (
            <span
              key={s.src}
              className={`absolute inset-0 ${i === screenIndex ? 'ph-screen-current z-10' : 'z-0'}`}
              style={{ visibility: i === screenIndex || i === (screenIndex - 1 + screens.length) % screens.length ? 'visible' : 'hidden' }}
            >
              <Image
                src={s.src}
                alt=""
                fill
                sizes="320px"
                priority={appIndex === 0 && i === 0}
                className="object-contain"
              />
            </span>
          ))}
        </span>
      </button>

      {/* Screen progress, like stories */}
      <div className="-mt-2 flex w-40 gap-1" aria-hidden="true">
        {screens.map((s) => (
          <span key={s.src} className="h-[2px] flex-1 overflow-hidden rounded-full bg-line-strong">
            <span className="ph-bar block h-full origin-left rounded-full bg-bone" style={{ transform: 'scaleX(0)' }} />
          </span>
        ))}
      </div>

      <div className="-mt-2 flex h-5 items-center overflow-hidden">
        <p className="ph-caption label">
          <span className="text-bone">{tx(app.title, lang)}</span> · {tx(screen.label, lang)}
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2" role="tablist" aria-label={t.projects.title}>
        {mobileApps.map((a, i) => (
          <button
            key={a.slug}
            role="tab"
            aria-selected={i === appIndex}
            onClick={() => pickApp(i)}
            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-colors duration-300 ${
              i === appIndex ? 'border-bone bg-bone text-ink' : 'border-line-strong text-muted hover:border-bone hover:text-bone'
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: a.color }} />
            {tx(a.title, lang)}
          </button>
        ))}
      </div>
    </div>
  )
}
