'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const greetings = [
  { text: 'Hello',      lang: 'English'   },
  { text: 'Halo',       lang: 'Indonesia' },
  { text: 'Bonjour',    lang: 'Français'  },
  { text: '你好',        lang: '中文'      },
  { text: '안녕하세요',  lang: '한국어'    },
  { text: 'こんにちは',  lang: '日本語'    },
]

const GREETING_DURATION = 700   // ms per greeting
const NAME_DURATION      = 1800  // ms name is shown

interface Props { onDone: () => void }

const TOTAL_MS = greetings.length * GREETING_DURATION + NAME_DURATION

export default function OpeningScreen({ onDone }: Props) {
  const [index, setIndex]   = useState(0)
  const [phase, setPhase]   = useState<'greetings' | 'name' | 'exit'>('greetings')
  const [liveProgress, setLiveProgress] = useState(0)
  const startRef = useRef(Date.now())

  // Continuous real-time progress — update every 30ms
  useEffect(() => {
    const id = setInterval(() => {
      const p = Math.min((Date.now() - startRef.current) / TOTAL_MS, 1)
      setLiveProgress(p)
      if (p >= 1) clearInterval(id)
    }, 30)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (phase !== 'greetings') return
    const t = setTimeout(() => {
      if (index < greetings.length - 1) setIndex(i => i + 1)
      else setPhase('name')
    }, GREETING_DURATION)
    return () => clearTimeout(t)
  }, [index, phase])

  useEffect(() => {
    if (phase !== 'name') return
    const t = setTimeout(() => setPhase('exit'), NAME_DURATION)
    return () => clearTimeout(t)
  }, [phase])

  useEffect(() => {
    if (phase !== 'exit') return
    const t = setTimeout(onDone, 800)
    return () => clearTimeout(t)
  }, [phase, onDone])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'var(--bg-primary)', originY: 0 }}
      animate={phase === 'exit' ? { scaleY: 0 } : { scaleY: 1 }}
      transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* Grid */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'linear-gradient(rgba(59,130,246,0.3) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,0.3) 1px,transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      {/* Radial glow */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 50%,rgba(59,130,246,0.12) 0%,transparent 70%)' }}
      />

      <div className="relative z-10 flex flex-col items-center gap-10">
        <AnimatePresence mode="wait">
          {phase === 'greetings' && (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center"
            >
              <span
                className="font-display font-bold tracking-tight uppercase leading-none"
                style={{
                  fontSize: 'clamp(4rem, 14vw, 10rem)',
                  background: 'linear-gradient(135deg,#E2E8F0 0%,#60A5FA 45%,#818CF8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  letterSpacing: '-0.02em',
                }}
              >
                {greetings[index].text}
              </span>
              <span
                className="mt-4 text-xs tracking-[0.4em] uppercase font-mono"
                style={{ color: 'rgba(148,163,184,0.5)' }}
              >
                {greetings[index].lang}
              </span>
            </motion.div>
          )}

          {phase === 'name' && (
            <motion.div
              key="name"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center text-center gap-3"
            >
              <span
                className="text-xs tracking-[0.5em] uppercase font-mono"
                style={{ color: 'rgba(59,130,246,0.6)' }}
              >
                I&apos;m
              </span>
              {/* 1-line brutalist name: outline + gradient */}
              <div className="overflow-hidden">
                <span
                  className="font-display font-bold uppercase leading-none whitespace-nowrap"
                  style={{
                    fontSize: 'clamp(3rem, 9vw, 7rem)',
                    letterSpacing: '-0.02em',
                    display: 'block',
                  }}
                >
                  <span style={{
                    WebkitTextStroke: '1.5px rgba(226,232,240,0.7)',
                    WebkitTextFillColor: 'transparent',
                  }}>Dio&nbsp;</span>
                  <span style={{
                    background: 'linear-gradient(135deg,#E2E8F0 0%,#60A5FA 45%,#818CF8 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>Pratama</span>
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress bar */}
        <div className="flex flex-col items-center gap-2" style={{ width: 200 }}>
          <div
            className="w-full overflow-hidden"
            style={{ height: 1, background: 'rgba(59,130,246,0.15)' }}
          >
            <motion.div
              className="h-full"
              style={{ background: 'linear-gradient(90deg,#3B82F6,#818CF8)' }}
              animate={{ width: `${liveProgress * 100}%` }}
              transition={{ duration: 0.08, ease: 'linear' }}
            />
          </div>
          <span
            className="text-[10px] tracking-[0.35em] uppercase font-mono"
            style={{ color: 'rgba(148,163,184,0.4)' }}
          >
            {`${Math.round(liveProgress * 100)}%`}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
