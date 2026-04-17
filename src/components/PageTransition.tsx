'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function PageTransition() {
  const [flash, setFlash] = useState(false)

  useEffect(() => {
    const container = document.getElementById('scroll-container')
    if (!container) return

    let prev = 0
    let timer: ReturnType<typeof setTimeout>

    const onScroll = () => {
      const curr = Math.round(container.scrollTop / window.innerHeight)
      if (curr !== prev) {
        prev = curr
        setFlash(true)
        clearTimeout(timer)
        timer = setTimeout(() => setFlash(false), 500)
      }
    }

    container.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      container.removeEventListener('scroll', onScroll)
      clearTimeout(timer)
    }
  }, [])

  return (
    <AnimatePresence>
      {flash && (
        <motion.div
          key="flash"
          initial={{ opacity: 0.25 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="fixed inset-0 z-30 pointer-events-none"
          style={{ background: 'var(--bg-primary)' }}
        />
      )}
    </AnimatePresence>
  )
}
