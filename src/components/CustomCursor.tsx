'use client'

import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Only enable on non-touch devices
    if (typeof window === 'undefined' || window.matchMedia('(pointer: coarse)').matches) return

    document.body.style.cursor = 'none'

    let mx = -100, my = -100   // mouse pos
    let rx = -100, ry = -100   // ring pos (lerped)
    let raf: number

    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
    }
    window.addEventListener('mousemove', onMove)

    const tick = () => {
      // Dot snaps instantly
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mx - 4}px, ${my - 4}px)`
      }
      // Ring lerps behind with ~0.12 factor
      rx += (mx - rx) * 0.12
      ry += (my - ry) * 0.12
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${rx - 20}px, ${ry - 20}px)`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    // Scale ring on clickable hover
    const onEnter = () => ringRef.current && (ringRef.current.style.transform += ' scale(1.6)')
    const onLeave = () => {}

    const addListeners = () => {
      document.querySelectorAll('a,button,[role="button"]').forEach(el => {
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
      })
    }
    addListeners()

    return () => {
      document.body.style.cursor = ''
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none w-2 h-2 rounded-full"
        style={{ background: '#3B82F6', boxShadow: '0 0 6px #3B82F6' }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none w-10 h-10 rounded-full"
        style={{
          border: '1.5px solid rgba(99,102,241,0.55)',
          transition: 'transform 0.08s ease, opacity 0.2s',
        }}
      />
    </>
  )
}
