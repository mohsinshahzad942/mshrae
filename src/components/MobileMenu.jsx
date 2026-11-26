import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Link } from 'react-router'
import { navLinks, profile } from '../data/site'
import { IconClose, IconMenu } from './ui/icons'

/** Phone-sized menu: the nav links are hidden under 680px, so this button opens them full-screen. */
export function MobileMenu({ animate = true }) {
  const [open, setOpen] = useState(false)
  const btnRef = useRef(null)
  const firstRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.documentElement.classList.add('menu-open')
    addEventListener('keydown', onKey)
    firstRef.current?.focus()
    return () => {
      removeEventListener('keydown', onKey)
      document.documentElement.classList.remove('menu-open')
    }
  }, [open])

  const close = () => {
    setOpen(false)
    btnRef.current?.focus()
  }
  const t = (i) => (animate ? { delay: 0.05 + i * 0.05, type: 'spring', stiffness: 260, damping: 24 } : { duration: 0 })

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className="menu-btn"
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(true)}
      >
        <IconMenu />
      </button>
      {/* Rendered into <body>: inside the blurred nav bar, a fixed overlay would be clipped to the bar. */}
      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-menu"
              className="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              data-lenis-prevent
              initial={animate ? { clipPath: 'circle(0% at calc(100% - 36px) 34px)' } : { opacity: 0 }}
              animate={animate ? { clipPath: 'circle(150% at calc(100% - 36px) 34px)' } : { opacity: 1 }}
              exit={animate ? { clipPath: 'circle(0% at calc(100% - 36px) 34px)' } : { opacity: 0 }}
              transition={{ duration: animate ? 0.55 : 0, ease: [0.76, 0, 0.24, 1] }}
            >
              <button type="button" className="menu-btn close" aria-label="Close menu" onClick={close}>
                <IconClose />
              </button>
              <nav aria-label="Mobile">
                <ul>
                  {navLinks.map(({ id, label }, i) => (
                    <motion.li
                      key={id}
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={t(i)}
                    >
                      <a ref={i === 0 ? firstRef : undefined} href={`#${id}`} onClick={() => setOpen(false)}>
                        <span>{String(i + 1).padStart(2, '0')}</span>
                        {label}
                      </a>
                    </motion.li>
                  ))}
                  <motion.li
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={t(navLinks.length)}
                  >
                    <Link to="/apply" onClick={() => setOpen(false)}>
                      <span>→</span>Apply for a job
                    </Link>
                  </motion.li>
                </ul>
              </nav>
              <p className="mobile-menu-foot">
                {profile.name} · {profile.shortLocation}
              </p>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  )
}
