import { useCallback, useRef, useState } from 'react'
import { About } from './components/About'
import { Backdrop } from './components/Backdrop'
import { Contact } from './components/Contact'
import { Experience } from './components/Experience'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { Highlights } from './components/Highlights'
import { Intro } from './components/Intro'
import { Marquee } from './components/Marquee'
import { Nav } from './components/Nav'
import { ParticleField } from './components/ParticleField'
import { useActiveSection } from './hooks/useActiveSection'
import { useReducedMotion } from './hooks/useReducedMotion'
import { useScrollTheme } from './hooks/useScrollTheme'

export default function App() {
  const reduced = useReducedMotion()
  const animate = !reduced
  const [introDone, setIntroDone] = useState(false)
  const finishIntro = useCallback(() => setIntroDone(true), [])
  const showIntro = animate && !introDone

  const dimRef = useRef(null)
  useScrollTheme(dimRef)
  const active = useActiveSection()

  return (
    <>
      <ParticleField animate={animate} />
      {showIntro && <Intro onDone={finishIntro} />}
      <Backdrop dimRef={dimRef} />
      <Nav active={active} />
      <main>
        <div className="pin">
          <Hero animate={animate} />
          {showIntro && <div className="pin-space" aria-hidden="true" />}
        </div>
        <Marquee />
        <About animate={animate} />
        <Experience />
        <Highlights animate={animate} />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
