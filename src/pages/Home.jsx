import { useCallback, useRef, useState } from 'react'
import { About } from '../components/About'
import { Backdrop } from '../components/Backdrop'
import { Contact } from '../components/Contact'
import { Experience } from '../components/Experience'
import { Footer } from '../components/Footer'
import { Hero } from '../components/Hero'
import { Highlights } from '../components/Highlights'
import { Intro } from '../components/Intro'
import { Marquee } from '../components/Marquee'
import { Nav } from '../components/Nav'
import { ParticleField } from '../components/ParticleField'
import { useActiveSection } from '../hooks/useActiveSection'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useScrollTheme } from '../hooks/useScrollTheme'
import { ApplyButton } from '../components/ApplyButton'
import { QuickDock } from '../components/QuickDock'
import { SHOW_INTRO } from '../data/site'
import { useSmoothScroll } from '../lib/useSmoothScroll'
import { useScrollScenes } from '../hooks/useScrollScenes'

// Play the intro once per visit, not every time someone comes back from /apply.
let introSeen = false

export default function Home() {
  const reduced = useReducedMotion()
  const animate = !reduced
  const [introDone, setIntroDone] = useState(introSeen)
  const finishIntro = useCallback(() => {
    introSeen = true
    setIntroDone(true)
  }, [])
  const showIntro = SHOW_INTRO && animate && !introDone

  const dimRef = useRef(null)
  useScrollTheme(dimRef)
  const active = useActiveSection()
  useSmoothScroll(animate && !showIntro)
  useScrollScenes(animate && !showIntro)

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <ParticleField animate={animate} />
      {showIntro && <Intro onDone={finishIntro} />}
      <Backdrop dimRef={dimRef} />
      <Nav active={active} animate={animate} />
      <main id="main">
        <div className="pin">
          <Hero animate={animate} ready={!showIntro} />
          {showIntro && <div className="pin-space" aria-hidden="true" />}
        </div>
        <Marquee />
        <About animate={animate} />
        <Experience />
        <Highlights animate={animate} />
        <Contact animate={animate} />
      </main>
      <Footer />
      <ApplyButton />
      <QuickDock animate={animate} />
    </>
  )
}
