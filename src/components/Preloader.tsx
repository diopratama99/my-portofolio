'use client'

import { Fragment, useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap'

const greetings = [
  'Hello', 'Halo', 'Bonjour', 'こんにちは', 'Hola', '안녕하세요', 'Ciao', 'नमस्ते', 'Olá', '你好', 'Hallo', 'مرحبا',
  'Привет', 'Sampurasun', 'Merhaba', 'สวัสดี', 'Hej', 'Xin chào', 'שלום', 'Aloha', 'Γειά σου', 'Kumusta', 'Sugeng', 'Salve',
  'வணக்கம்', 'Cześć', 'Jambo', 'Ahoj', 'নমস্কার', 'Szia', 'سلام', 'Kia ora', 'Salut', 'Moi', 'Здраво', 'Hei',
  'నమస్తే', 'Sawubona', 'Привіт', 'Bula', 'ನಮಸ್ಕಾರ', 'Tere', 'Labas', 'မင်္ဂလာပါ', 'Sveiki', 'Kaixo', 'നമസ്കാരം', 'Halló',
  'សួស្តី', 'Dia dhuit', 'Здравей', 'Saluton', 'ສະບາຍດີ', 'Talofa', 'გამარჯობა', 'Sannu', 'Բարեւ', 'Bawo', 'ሰላም', 'Сайн уу',
  'Сәлем', 'Salom', 'ආයුබෝවන්', 'Bok', 'Përshëndetje', 'Shwmae', 'નમસ્તે', 'Bonġu', 'नमस्कार', 'Hoi', 'Goeie dag', 'Om Swastiastu',
]

// A repeating rhythm of sizes and tones keeps the wall from looking like a plain list.
const SIZES = ['1em', '0.7em', '1.3em', '0.85em', '0.6em', '1.1em', '0.75em']
const TONES = ['text-bone', 'text-bone/35', 'text-bone/60', 'text-bone/25', 'text-bone/80', 'text-bone/45']

const DURATION = 2.8

const session = { played: false }

export default function Preloader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (session.played || prefersReducedMotion()) {
        gsap.set(root.current, { display: 'none' })
        onDone()
        return
      }

      // Largest font size at which every greeting still fits on one screen
      const wall = root.current!.querySelector<HTMLElement>('.pl-wall')!
      const fit = () => {
        const maxH = window.innerHeight - 16
        const maxW = wall.clientWidth
        let lo = 10
        let hi = 140
        for (let i = 0; i < 9; i++) {
          const mid = (lo + hi) / 2
          wall.style.fontSize = `${mid}px`
          if (wall.scrollHeight <= maxH && wall.scrollWidth <= maxW) lo = mid
          else hi = mid
        }
        wall.style.fontSize = `${lo}px`
      }
      fit()
      document.fonts?.ready.then(fit)

      const words = gsap.utils.toArray<HTMLElement>('.pl-word')

      gsap
        .timeline()
        .fromTo(
          words,
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: { amount: DURATION - 0.5, from: 'random' } },
          0,
        )
        .fromTo('.pl-bar', { scaleX: 0 }, { scaleX: 1, duration: DURATION, ease: 'power1.inOut' }, 0)
        .to(root.current, { yPercent: -100, duration: 1.1, ease: 'expo.inOut' }, '+=0.25')
        .add(() => {
          session.played = true
          onDone()
        }, '-=0.75')
        .set(root.current, { display: 'none' })
    },
    { scope: root },
  )

  return (
    <div ref={root} className="fixed inset-0 z-[100] overflow-hidden bg-ink-2" aria-hidden="true">
      <div className="flex h-full items-center">
        <div className="pl-wall flex w-full flex-wrap items-center justify-center gap-x-[0.7em] gap-y-[0.15em] px-4 font-display font-semibold leading-tight">
        {greetings.map((word, i) => (
          <Fragment key={i}>
            {i === Math.floor(greetings.length / 2) && (
              <div className="flex basis-full justify-center py-[0.45em]">
                <div className="h-1 w-[min(60vw,22rem)] overflow-hidden rounded-full bg-line-strong">
                  <div className="pl-bar h-full origin-left rounded-full bg-bone" style={{ transform: 'scaleX(0)' }} />
                </div>
              </div>
            )}
            <span
              className={`pl-word invisible whitespace-nowrap ${TONES[i % TONES.length]}`}
              style={{ fontSize: SIZES[i % SIZES.length] }}
            >
              {word}
            </span>
          </Fragment>
        ))}
        </div>
      </div>
    </div>
  )
}
