'use client'

import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion, isTouchDevice } from '@/lib/gsap'

/**
 * A faint dot grid on a canvas. Dots near the pointer brighten and drift away
 * from it a little, so empty space quietly responds to the cursor.
 * Only redraws while visible and while the glow is settling.
 */
export function DotField({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useGSAP(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const GAP = 28
    const RADIUS = 170
    const pointer = { x: -9999, y: -9999 }
    const glow = { x: -9999, y: -9999, strength: 0 }
    let w = 0
    let h = 0
    let dpr = 1

    const resize = () => {
      const r = canvas.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = r.width
      h = r.height
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      draw()
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      const offX = (w % GAP) / 2
      const offY = (h % GAP) / 2
      for (let x = offX; x <= w; x += GAP) {
        for (let y = offY; y <= h; y += GAP) {
          const dx = x - glow.x
          const dy = y - glow.y
          const d = Math.hypot(dx, dy)
          const f = d < RADIUS ? (1 - d / RADIUS) ** 2 * glow.strength : 0
          const push = f * 6
          const px = x + (d ? (dx / d) * push : 0)
          const py = y + (d ? (dy / d) * push : 0)
          ctx.fillStyle = f > 0.02 ? `rgba(169,179,255,${0.1 + f * 0.6})` : 'rgba(238,236,230,0.07)'
          ctx.beginPath()
          ctx.arc(px, py, 1 + f * 1.4, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    resize()
    if (prefersReducedMotion() || isTouchDevice()) {
      window.addEventListener('resize', resize)
      return () => window.removeEventListener('resize', resize)
    }

    // Glow eases after the pointer; the ticker only runs while it is catching up
    let active = false
    const tick = () => {
      glow.x += (pointer.x - glow.x) * 0.18
      glow.y += (pointer.y - glow.y) * 0.18
      const target = pointer.x > -9000 ? 1 : 0
      glow.strength += (target - glow.strength) * 0.1
      draw()
      const settled = Math.abs(pointer.x - glow.x) < 0.5 && Math.abs(pointer.y - glow.y) < 0.5 && Math.abs(target - glow.strength) < 0.01
      if (settled) {
        gsap.ticker.remove(tick)
        active = false
      }
    }
    const wake = () => {
      if (!active) {
        active = true
        gsap.ticker.add(tick)
      }
    }

    let visible = true
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(canvas)

    const onMove = (e: MouseEvent) => {
      if (!visible) return
      const r = canvas.getBoundingClientRect()
      const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom
      if (inside) {
        if (glow.strength < 0.01) {
          glow.x = e.clientX - r.left
          glow.y = e.clientY - r.top
        }
        pointer.x = e.clientX - r.left
        pointer.y = e.clientY - r.top
      } else {
        pointer.x = pointer.y = -9999
      }
      wake()
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('resize', resize)
    return () => {
      io.disconnect()
      gsap.ticker.remove(tick)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', resize)
    }
  })

  return <canvas ref={canvasRef} aria-hidden="true" className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />
}
