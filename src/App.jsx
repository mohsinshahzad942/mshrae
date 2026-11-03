import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router'
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

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<div className="page-loading" role="status">Loading…</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/apply" element={<Apply />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
    </>
  )
}
