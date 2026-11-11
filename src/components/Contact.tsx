'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { ArrowUp, ArrowUpRight, Mail } from 'lucide-react'
import { SiGithub } from 'react-icons/si'
import { FaLinkedin } from 'react-icons/fa'
import { gsap, useGSAP, prefersReducedMotion, scrollToTarget } from '@/lib/gsap'
import { useLanguage } from '@/contexts/LanguageContext'
import { RevealChars } from './ui/Split'
import { StackPit } from './ui/StackPit'
import { Magnetic } from './ui/Magnetic'
import { RollText } from './ui/RollText'

const SOCIALS = [
  { label: 'Email', href: 'mailto:diodiopratama99@gmail.com', Icon: Mail },
  { label: 'GitHub', href: 'https://github.com/diopratama99', Icon: SiGithub },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/dio-pratama-43a31a235/', Icon: FaLinkedin },
]

export default function Contact() {
  const { t } = useLanguage()
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.from('.ct-fade', {
        y: 30,
        autoAlpha: 0,
        duration: 1,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: root.current, start: 'top 85%' },
      })
    },
    { scope: root },
  )

  return (
    <section id="contact" ref={root} className="relative px-pad pb-6 pt-16">
      <StackPit />

      <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <RevealChars
            text={t.contact.title}
            className="font-display text-[clamp(2.5rem,6vw,5.5rem)] font-bold uppercase leading-[0.9] tracking-[-0.025em]"
          />
          <p className="ct-fade mt-4 max-w-md text-muted">{t.contact.sub}</p>
          <p className="ct-fade mt-1 text-muted">{t.contact.basedIn}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Magnetic className="ct-fade">
            <Link href="/contact" className="btn btn-primary">
              <RollText>{t.contact.cta}</RollText>
              <ArrowUpRight size={16} />
            </Link>
          </Magnetic>
          {SOCIALS.map(({ label, href, Icon }) => (
            <Magnetic key={label} className="ct-fade">
              <a
                href={href}
                target={href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-line-strong transition-colors duration-300 hover:border-bone hover:bg-bone hover:text-ink"
              >
                <Icon size={18} aria-hidden="true" />
              </a>
            </Magnetic>
          ))}
        </div>
      </div>

      <footer className="label mt-14 flex items-center justify-between border-t border-line pt-6 md:mt-20">
        <span>© {new Date().getFullYear()} Dio Pratama</span>
        <button onClick={() => scrollToTarget(0)} className="flex items-center gap-2 text-bone">
          <RollText>{t.contact.backToTop}</RollText>
          <ArrowUp size={14} />
        </button>
      </footer>
    </section>
  )
}
