'use client'

import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered]   = useState(false)
  const [clicking, setClicking] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || window.matchMedia('(pointer: coarse)').matches) return

    document.body.style.cursor = 'none'

    let mx = -200, my = -200
    let rx = -200, ry = -200
    let raf: number

    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY }

    // Delegation — works on dynamic elements too
    const onOver  = (e: MouseEvent) => {
      const t = e.target as Element
      setHovered(!!t.closest('a, button, [role="button"], input, textarea, label, select, [tabindex]'))
    }
    const onDown  = () => setClicking(true)
    const onUp    = () => setClicking(false)

    const tick = () => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`
      }
      rx += (mx - rx) * 0.1
      ry += (my - ry) * 0.1
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)

    return () => {
      document.body.style.cursor = ''
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      cancelAnimationFrame(raf)
    }
  }, [])

  const dotSize  = clicking ? 5  : 8
  const ringSize = hovered  ? 52 : 36

  return (
    <>
      {/* Inner dot — snaps to cursor */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full"
        style={{
          width: dotSize, height: dotSize,
          background: hovered ? '#fff' : '#60A5FA',
          boxShadow: `0 0 ${hovered ? 10 : 6}px ${hovered ? 'rgba(255,255,255,0.8)' : '#3B82F6'}`,
          transition: 'width 0.15s ease, height 0.15s ease, background 0.2s ease, box-shadow 0.2s ease',
          willChange: 'transform',
        }}
      />
      {/* Outer ring — lags behind */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none rounded-full"
        style={{
          width: ringSize, height: ringSize,
          border: `1.5px solid ${hovered ? 'rgba(96,165,250,0.75)' : 'rgba(99,102,241,0.4)'}`,
          boxShadow: hovered ? '0 0 14px rgba(59,130,246,0.25)' : 'none',
          transition: 'width 0.22s ease, height 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease',
          willChange: 'transform',
        }}
      />
    </>
  )
}
