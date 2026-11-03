import { useEffect, useState } from 'react'

/**
 * Tracks the section crossing the middle of the viewport. Also writes it to
 * <body data-scene>, which the CSS uses to shift the aurora colours per section.
 */
export function useActiveSection(selector = 'section[id], header#top') {
  const [active, setActive] = useState('top')

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            document.body.dataset.scene = entry.target.id
            setActive(entry.target.id)
          }
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    document.querySelectorAll(selector).forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [selector])

  return active
}
