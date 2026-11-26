import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring, AnimatePresence } from 'motion/react'
import { profile } from '../data/site'
import { Dock, DockItem } from './ui/dock'
import { IconArrowUp, IconLinkedIn, IconMail, IconPhone, IconWhatsApp } from './ui/icons'

/**
 * Floating quick-contact dock. It appears once the hero's own buttons have scrolled away, so a visitor
 * can reach Mohsin from anywhere on the page, and its last button jumps back to the top while a ring
 * shows how far down the page they are. While you scroll down to read it tucks away so it never covers
 * text; scrolling up, pausing, or reaching the end brings it back.
 */
export function QuickDock({ animate = true }) {
  const [shown, setShown] = useState(false)
  const { scrollYProgress } = useScroll()
  const ring = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })

  useEffect(() => {
    let lastY = scrollY
    let idle
    const update = () => {
      const y = scrollY
      const pastHero = y > innerHeight * 0.7
      const atEnd = y + innerHeight >= document.documentElement.scrollHeight - 120
      const goingDown = y > lastY + 2
      lastY = y
      setShown(pastHero && (!goingDown || atEnd))
      clearTimeout(idle)
      // Reappear shortly after the visitor stops scrolling.
      if (pastHero) idle = setTimeout(() => setShown(true), 900)
    }
    update()
    addEventListener('scroll', update, { passive: true })
    return () => {
      clearTimeout(idle)
      removeEventListener('scroll', update)
    }
  }, [])

  const toTop = () => scrollTo({ top: 0, behavior: animate ? 'smooth' : 'auto' })
  const fine = typeof matchMedia !== 'undefined' && matchMedia('(pointer: fine)').matches

  return (
    <AnimatePresence>
      {shown && (
        <motion.div
          className="dock-wrap"
          initial={animate ? { y: 90, opacity: 0 } : false}
          animate={{ y: 0, opacity: 1 }}
          exit={animate ? { y: 90, opacity: 0 } : { opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        >
          <Dock label="Quick contact" magnify={animate && fine}>
            {(mouseX, magnify) => (
              <>
                <DockItem mouseX={mouseX} magnify={magnify} href={profile.linkedin} external label="LinkedIn">
                  <IconLinkedIn />
                </DockItem>
                <DockItem mouseX={mouseX} magnify={magnify} href={`mailto:${profile.email}`} label="Email">
                  <IconMail />
                </DockItem>
                <DockItem mouseX={mouseX} magnify={magnify} href={profile.whatsapp} external label="WhatsApp">
                  <IconWhatsApp />
                </DockItem>
                <DockItem
                  mouseX={mouseX}
                  magnify={magnify}
                  href={`tel:${profile.phone.replace(/\s/g, '')}`}
                  label="Call"
                >
                  <IconPhone />
                </DockItem>
                <span className="dock-sep" aria-hidden="true" />
                <DockItem mouseX={mouseX} magnify={magnify} onClick={toTop} label="Back to top">
                  <svg className="dock-ring" viewBox="0 0 40 40" aria-hidden="true">
                    <circle cx="20" cy="20" r="18" pathLength="1" className="track" />
                    <motion.circle cx="20" cy="20" r="18" pathLength="1" className="bar" style={{ pathLength: ring }} />
                  </svg>
                  <IconArrowUp />
                </DockItem>
              </>
            )}
          </Dock>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
