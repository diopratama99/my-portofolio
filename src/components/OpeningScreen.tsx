'use client'

import { useEffect, useState } from 'react'
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

export default function OpeningScreen({ onDone }: Props) {
  const [index, setIndex]   = useState(0)
  const [phase, setPhase]   = useState<'greetings' | 'name' | 'exit'>('greetings')

  // Progress: 0→1 over greetings, then 1 during name
  const totalSteps = greetings.length + 1  // +1 for name step
  const progress =
    phase === 'greetings' ? (index + 1) / totalSteps
    : phase === 'name'    ? 1
    : 1

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
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: 'var(--bg-primary)' }}
      animate={phase === 'exit' ? { y: '-100%', opacity: 0 } : { y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
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
        style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 50%,rgba(59,130,246,0.1) 0%,transparent 70%)' }}
      />

      <div className="relative z-10 flex flex-col items-center gap-10">
        {/* Greeting text */}
        <AnimatePresence mode="wait">
          {phase === 'greetings' && (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center"
            >
              <span
                className="text-7xl md:text-9xl font-bold tracking-tight"
                style={{
                  background: 'linear-gradient(135deg,#60A5FA 0%,#3B82F6 50%,#818CF8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {greetings[index].text}
              </span>
              <span
                className="mt-3 text-sm tracking-[0.4em] uppercase"
                style={{ color: 'var(--text-muted)' }}
              >
                {greetings[index].lang}
              </span>
            </motion.div>
          )}

          {phase === 'name' && (
            <motion.div
              key="name"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center text-center"
            >
              <span
                className="text-lg md:text-xl tracking-[0.3em] uppercase mb-3"
                style={{ color: 'var(--text-muted)' }}
              >
                I&apos;m
              </span>
              <span
                className="text-5xl md:text-7xl font-bold"
                style={{
                  background: 'linear-gradient(135deg,#60A5FA 0%,#3B82F6 50%,#818CF8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Dio Pratama
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading bar */}
        <div className="flex flex-col items-center gap-2 w-48">
          <div
            className="w-full h-0.5 rounded-full overflow-hidden"
            style={{ background: 'rgba(59,130,246,0.15)' }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg,#3B82F6,#818CF8)' }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
          <span
            className="text-[10px] tracking-[0.3em] uppercase"
            style={{ color: 'rgba(148,163,184,0.5)' }}
          >
            {phase === 'name' ? 'Welcome' : `${index + 1} / ${greetings.length}`}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
