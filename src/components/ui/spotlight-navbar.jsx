import { useEffect, useRef } from 'react'
import { animate } from 'motion/react'
import { cn } from '@/lib/utils'

/**
 * Glass pill of links with a light that follows the pointer and a glowing bar under the active link.
 * Adapted from Vengeance UI's SpotlightNavbar (vengenceui.com): the active link comes from the page
 * (scroll position) instead of clicks, links keep their normal anchor behaviour, and colours use the site palette.
 */
export function SpotlightNavbar({ items, activeId, className, animated = true }) {
  const navRef = useRef(null)
  const spot = useRef(0)
  const amb = useRef(0)

  const centreOf = (id) => {
    const nav = navRef.current
    const el = nav?.querySelector(`[data-id="${id}"]`)
    if (!el) return null
    const n = nav.getBoundingClientRect()
    const r = el.getBoundingClientRect()
    return r.left - n.left + r.width / 2
  }

  // Slide the active glow to the current section.
  useEffect(() => {
    const nav = navRef.current
    const x = centreOf(activeId)
    if (!nav || x == null) {
      nav?.style.setProperty('--amb-o', '0')
      return
    }
    nav.style.setProperty('--amb-o', '1')
    if (!animated) {
      amb.current = x
      nav.style.setProperty('--ambience-x', `${x}px`)
      return
    }
    const a = animate(amb.current, x, {
      type: 'spring',
      stiffness: 200,
      damping: 22,
      onUpdate: (v) => {
        amb.current = v
        nav.style.setProperty('--ambience-x', `${v}px`)
      },
    })
    return () => a.stop()
  }, [activeId, animated])

  // Spotlight follows the pointer; on leave it springs back to the active link.
  useEffect(() => {
    const nav = navRef.current
    if (!nav) return
    const move = (e) => {
      const x = e.clientX - nav.getBoundingClientRect().left
      spot.current = x
      nav.style.setProperty('--spotlight-x', `${x}px`)
      nav.style.setProperty('--spot-o', '1')
    }
    const leave = () => {
      nav.style.setProperty('--spot-o', '0')
      const x = centreOf(activeId)
      if (x == null || !animated) return
      animate(spot.current, x, {
        type: 'spring',
        stiffness: 200,
        damping: 20,
        onUpdate: (v) => {
          spot.current = v
          nav.style.setProperty('--spotlight-x', `${v}px`)
        },
      })
    }
    nav.addEventListener('pointermove', move)
    nav.addEventListener('pointerleave', leave)
    return () => {
      nav.removeEventListener('pointermove', move)
      nav.removeEventListener('pointerleave', leave)
    }
  }, [activeId, animated])

  return (
    <div ref={navRef} className={cn('spotlight-nav relative h-11 overflow-hidden rounded-full', className)}>
      <ul className="relative z-10 m-0 flex h-full list-none items-center gap-0 px-1.5">
        {items.map(({ id, label }) => (
          <li key={id} className="flex h-full items-center">
            <a
              href={`#${id}`}
              data-id={id}
              className={id === activeId ? 'on' : undefined}
              aria-current={id === activeId ? 'location' : undefined}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] transition-opacity duration-300"
        style={{
          opacity: 'var(--spot-o, 0)',
          background:
            'radial-gradient(120px circle at var(--spotlight-x) 100%, color-mix(in srgb, var(--c1) 22%, transparent) 0%, transparent 55%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 z-[2] h-[2px] w-full transition-opacity duration-300"
        style={{
          opacity: 'var(--amb-o, 0)',
          background: 'radial-gradient(60px circle at var(--ambience-x) 0%, var(--c1) 0%, transparent 100%)',
        }}
      />
    </div>
  )
}
