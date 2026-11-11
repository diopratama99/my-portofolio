'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { useGSAP } from '@gsap/react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, useGSAP)
}

export { gsap, ScrollTrigger, ScrollSmoother, useGSAP }

/** Survives client-side navigation: where the home page should land when it remounts. */
export const navState: { scrollTo: string | null } = { scrollTo: null }

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const isTouchDevice = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

/** Scroll to a selector or pixel offset, through ScrollSmoother when it is active. */
export function scrollToTarget(target: string | number) {
  const smoother = ScrollSmoother.get()
  if (smoother) {
    smoother.scrollTo(target, true, 'top top')
    return
  }
  if (typeof target === 'number') window.scrollTo({ top: target, behavior: 'smooth' })
  else document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
}
