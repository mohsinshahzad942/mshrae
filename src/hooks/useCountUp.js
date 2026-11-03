import { useEffect, useRef, useState } from 'react'

/**
 * Counts from 0 to `end` with an ease-out curve the first time the element is mostly visible.
 * Shows the final value until then, so the number is never wrong if the observer never fires.
 */
export function useCountUp(end, { enabled = true, duration = 1400 } = {}) {
  const ref = useRef(null)
  const [value, setValue] = useState(end)

  useEffect(() => {
    const el = ref.current
    if (!enabled || end == null || !el || !('IntersectionObserver' in window)) return
    let frame
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        const t0 = performance.now()
        const step = (t) => {
          const k = Math.min(1, (t - t0) / duration)
          setValue(Math.round(end * (1 - Math.pow(1 - k, 3))))
          if (k < 1) frame = requestAnimationFrame(step)
        }
        frame = requestAnimationFrame(step)
      },
      { threshold: 0.6 },
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [end, enabled, duration])

  return [ref, value]
}
