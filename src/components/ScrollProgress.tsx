'use client'

import { useEffect, useState } from 'react'
import { motion, useSpring } from 'framer-motion'

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  const spring = useSpring(0, { stiffness: 200, damping: 40 })

  useEffect(() => {
    const container = document.getElementById('scroll-container')
    if (!container) return
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      const total = scrollHeight - clientHeight
      const pct = total > 0 ? scrollTop / total : 0
      setProgress(pct)
      spring.set(pct)
    }
    container.addEventListener('scroll', onScroll, { passive: true })
    return () => container.removeEventListener('scroll', onScroll)
  }, [spring])

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 h-[2px] pointer-events-none"
      style={{ background: 'rgba(59,130,246,0.12)' }}
    >
      <motion.div
        className="h-full origin-left"
        style={{
          scaleX: spring,
          background: 'linear-gradient(to right, #3B82F6, #6366F1)',
          boxShadow: '0 0 8px rgba(99,102,241,0.7)',
        }}
      />
    </div>
  )
}
