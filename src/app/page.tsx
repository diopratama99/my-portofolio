'use client'

import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import OpeningScreen from '@/components/OpeningScreen'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Skills from '@/components/Skills'
import Experience from '@/components/Experience'
import Projects from '@/components/Projects'
import Contact from '@/components/Contact'
import PageTransition from '@/components/PageTransition'
import ScrollProgress from '@/components/ScrollProgress'
import CustomCursor from '@/components/CustomCursor'

export default function Home() {
  const [showOpening, setShowOpening] = useState(true)

  return (
    <>
      <AnimatePresence>
        {showOpening && <OpeningScreen onDone={() => setShowOpening(false)} />}
      </AnimatePresence>

      {!showOpening && (
        <>
          <ScrollProgress />
          <CustomCursor />
          <Navbar />
          <PageTransition />
          <div id="scroll-container">
            <div className="snap-page">
              <Hero />
            </div>
            <div className="snap-page">
              <About />
            </div>
            <div className="snap-page">
              <Experience />
            </div>
            <div className="snap-page">
              <Skills />
            </div>
            <div className="snap-page">
              <Projects />
            </div>
            <div className="snap-page">
              <Contact />
            </div>
          </div>
        </>
      )}
    </>
  )
}
