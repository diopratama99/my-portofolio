'use client'

import { useEffect, type ReactNode } from 'react'
import { ScrollSmoother, ScrollTrigger, useGSAP, prefersReducedMotion, navState } from '@/lib/gsap'
import { useLanguage } from '@/contexts/LanguageContext'

/**
 * Creates the ScrollSmoother. Rendered as the first child of #smooth-content so
 * its layout effect runs before any section creates a ScrollTrigger.
 */
function SmootherInit({ paused }: { paused: boolean }) {
  const { lang } = useLanguage()

  useGSAP(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    if (prefersReducedMotion()) return
    ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1.1,
      effects: true,
      smoothTouch: 0.1,
    })
  }, [])

  // Lock scrolling while the preloader runs
  useEffect(() => {
    const smoother = ScrollSmoother.get()
    if (smoother) smoother.paused(paused)
    else document.documentElement.style.overflow = paused ? 'hidden' : ''

    if (!paused && navState.scrollTo) {
      const target = navState.scrollTo
      navState.scrollTo = null
      requestAnimationFrame(() => {
        ScrollTrigger.refresh()
        const s = ScrollSmoother.get()
        if (s) s.scrollTo(target, false, 'top top')
        else document.querySelector(target)?.scrollIntoView()
      })
    }
  }, [paused])

  // Text length changes with language, and web fonts shift layout once loaded
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      ScrollTrigger.sort()
      ScrollTrigger.refresh()
    })
    return () => cancelAnimationFrame(id)
  }, [lang])

  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
  }, [])

  return null
}

export default function SmoothScroll({ children, paused }: { children: ReactNode; paused: boolean }) {
  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">
        <SmootherInit paused={paused} />
        {children}
      </div>
    </div>
  )
}
