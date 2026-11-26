import { useEffect, useRef, useState } from 'react'
import { useInView, useMotionValue, useSpring } from 'motion/react'
import { cn } from '@/lib/utils'

/**
 * Number that springs up from 0 the first time it scrolls into view.
 * Adapted from Vengeance UI's StatsCounter (vengenceui.com): with `enabled` false it just shows the value.
 */
export function StatsCounter({ value, duration = 1.6, prefix = '', suffix = '', decimals = 0, enabled = true, className }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const motionValue = useMotionValue(0)
  const spring = useSpring(motionValue, { duration: duration * 1000, bounce: 0 })
  const [shown, setShown] = useState(enabled ? 0 : value)

  useEffect(() => {
    if (enabled && inView) motionValue.set(value)
  }, [enabled, inView, value, motionValue])

  useEffect(() => spring.on('change', (v) => setShown(v)), [spring])

  return (
    <span ref={ref} className={cn('tabular-nums', className)} aria-label={`${prefix}${value}${suffix}`}>
      <span aria-hidden="true">
        {prefix}
        {(enabled ? shown : value).toFixed(decimals)}
        {suffix}
      </span>
    </span>
  )
}
