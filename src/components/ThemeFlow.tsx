'use client'

import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'

/** Each section's theme, in page order: 0 is dark, 1 is light. */
const FLOW: [id: string, theme: number][] = [
  ['hero', 0],
  ['about', 0],
  ['projects', 0],
  ['other-projects', 0],
  ['skills', 1],
  ['workspace', 1],
  ['experience', 1],
  ['contact', 1],
]

/**
 * Blends the whole page between dark and light as sections arrive, by moving the
 * single --t variable that the .theme-flow colour tokens are mixed from.
 * Rendered last inside <main> so its ScrollTriggers measure after the pinned section.
 */
export default function ThemeFlow() {
  useGSAP(() => {
    // The page content, plus the navbar, which sits outside it
    const themed = gsap.utils.toArray<HTMLElement>('.theme-flow, .theme-tokens')

    const stops = FLOW.slice(1).map(([id, theme]) => ({
      theme,
      st: ScrollTrigger.create({ trigger: document.getElementById(id), start: 'top 55%' }),
    }))

    // Worked out from the scroll position alone, so jumping around the page can't desync it
    const themeAt = (y: number) => {
      const range = window.innerHeight * 0.4
      // A short last section must still finish its blend before the page runs out
      const latest = ScrollTrigger.maxScroll(window) - range / 2
      let t = FLOW[0][1]
      for (const { theme, st } of stops) {
        const p = gsap.utils.clamp(0, 1, (y - Math.min(st.start, latest) + range / 2) / range)
        t += (theme - t) * p
      }
      return t
    }

    const state = { t: 0 }
    let last = -1
    const apply = () => {
      const v = Number(state.t.toFixed(3))
      if (v !== last) {
        last = v
        themed.forEach((el) => el.style.setProperty('--t', String(v)))
      }
    }

    // quickTo retargets one running tween. Creating a new tween per update would starve:
    // ScrollSmoother fires every frame while scrolling, so each would be replaced before moving.
    const easeTo = gsap.quickTo(state, 't', { duration: 0.5, ease: 'power2.out', onUpdate: apply })

    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => easeTo(themeAt(self.scroll())),
      onRefresh: (self) => {
        const t = themeAt(self.scroll())
        easeTo(t, t)
        state.t = t
        apply()
      },
    })

    return () => themed.forEach((el) => el.style.removeProperty('--t'))
  }, [])

  return null
}
