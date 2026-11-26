import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'

/**
 * Wraps a button so it leans gently toward the pointer and springs back (a "magnetic button").
 * Off for touch and reduced motion; the wrapped element keeps its own focus and click behaviour.
 */
export function Magnetic({ children, strength = 0.25, enabled = true }) {
  const ref = useRef(null)
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 16, mass: 0.4 })
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 16, mass: 0.4 })
  if (!enabled) return children
  const move = (e) => {
    if (e.pointerType !== 'mouse') return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const leave = () => {
    x.set(0)
    y.set(0)
  }
  return (
    <motion.span ref={ref} className="magnetic" style={{ x, y }} onPointerMove={move} onPointerLeave={leave}>
      {children}
    </motion.span>
  )
}
