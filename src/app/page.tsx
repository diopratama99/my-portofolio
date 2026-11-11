'use client'

import { useCallback, useState } from 'react'
import SmoothScroll from '@/components/SmoothScroll'
import Preloader from '@/components/Preloader'
import Navbar from '@/components/Navbar'
import ScrollProgress from '@/components/ScrollProgress'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Experience from '@/components/Experience'
import Skills from '@/components/Skills'
import Workspace from '@/components/Workspace'
import Projects from '@/components/Projects'
import OtherProjects from '@/components/OtherProjects'
import Contact from '@/components/Contact'
import ThemeFlow from '@/components/ThemeFlow'

export default function Home() {
  const [ready, setReady] = useState(false)
  const handleDone = useCallback(() => setReady(true), [])

  return (
    <>
      {/* Sections first: their ScrollTriggers must exist before the fixed UI reads them */}
      <SmoothScroll paused={!ready}>
        <main className="theme-flow">
          <Hero ready={ready} />
          <About />
          <Projects />
          <OtherProjects />
          <Skills />
          <Workspace />
          <Experience />
          <Contact />
          <ThemeFlow />
        </main>
      </SmoothScroll>

      <Navbar ready={ready} />
      <ScrollProgress />
      <Preloader onDone={handleDone} />
    </>
  )
}
