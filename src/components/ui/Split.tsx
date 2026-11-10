'use client'

import { Fragment, useRef, type ElementType } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap'

/**
 * Renders text as masked words of individual character spans, so GSAP can
 * animate `.${charClass}` without mutating DOM that React owns.
 * Visual only: pair it with screen-reader text.
 */
export function SplitChars({
  text,
  charClass = 'char',
  className,
}: {
  text: string
  charClass?: string
  className?: string
}) {
  const words = text.split(' ')
  return (
    <span aria-hidden="true" className={className}>
      {words.map((word, wi) => (
        <Fragment key={wi}>
          <span className="mask">
            {Array.from(word).map((ch, ci) => (
              <span key={ci} className={`${charClass} inline-block will-change-transform`}>
                {ch}
              </span>
            ))}
          </span>
          {wi < words.length - 1 && ' '}
        </Fragment>
      ))}
    </span>
  )
}

/** A heading whose characters rise out of their masks when scrolled into view. */
export function RevealChars({
  text,
  as = 'h2',
  className,
  style,
  start = 'top 85%',
  stagger = 0.025,
}: {
  text: string
  as?: ElementType
  className?: string
  style?: React.CSSProperties
  start?: string
  stagger?: number
}) {
  const Tag = as
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return
      gsap.from(ref.current.querySelectorAll('.char'), {
        yPercent: 115,
        rotate: 6,
        duration: 1.2,
        ease: 'expo.out',
        stagger,
        scrollTrigger: {
          trigger: ref.current,
          start,
          toggleActions: 'play none none reverse',
        },
      })
    },
    { scope: ref, dependencies: [text], revertOnUpdate: true },
  )

  return (
    <Tag ref={ref} className={className} style={style}>
      <span className="sr-only">{text}</span>
      <SplitChars text={text} />
    </Tag>
  )
}
