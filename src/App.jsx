import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import Home from './pages/Home'

// The form and admin pages pull in the database client, so they load only when visited.
const Apply = lazy(() => import('./pages/Apply'))
const Admin = lazy(() => import('./pages/Admin'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    if (!location.hash) window.scrollTo(0, 0)
  }, [pathname])
  return null
}

// Moving between the site and the job pages: the old page fades out, a gradient curtain sweeps across
// the screen, and the new page fades in behind it. Only opacity is animated on the page itself, because a
// transform or filter on it would break the fixed and sticky layers inside (nav, particles, pinned sections).
const PAGE = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5, delay: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
}

function Curtain() {
  return (
    <motion.div
      className="curtain"
      aria-hidden="true"
      initial={{ scaleX: 1, transformOrigin: '100% 50%' }}
      animate={{ scaleX: 0, transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1], delay: 0.05 } }}
    />
  )
}

export default function App() {
  const location = useLocation()
  const reduced = useReducedMotion()
  const motionProps = reduced ? {} : PAGE

  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <motion.div key={location.pathname} className="route" {...motionProps}>
          <Suspense
            fallback={
              <div className="page-loading" role="status">
                Loading…
              </div>
            }
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/apply" element={<Apply />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </Suspense>
        </motion.div>
      </AnimatePresence>
      {!reduced && <Curtain key={location.pathname} />}
    </>
  )
}
