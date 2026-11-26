import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { cn } from '@/lib/utils'

/**
 * macOS-style dock: icons grow as the pointer moves along it (the "Dock" pattern from Magic UI).
 * Magnification only happens with a mouse; on touch and with `magnify={false}` icons stay put.
 */
export function Dock({ children, className, magnify = true, label }) {
  const mouseX = useMotionValue(Infinity)
  return (
    <motion.div
      role="toolbar"
      aria-label={label}
      onMouseMove={(e) => magnify && mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn('dock', className)}
    >
      {typeof children === 'function' ? children(mouseX, magnify) : children}
    </motion.div>
  )
}

export function DockItem({ mouseX, magnify, href, label, onClick, children, external }) {
  const ref = useRef(null)
  const distance = useTransform(mouseX, (x) => {
    const r = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    return x - (r.x + scrollX) - r.width / 2
  })
  const size = useSpring(useTransform(distance, [-140, 0, 140], [44, magnify ? 64 : 44, 44]), {
    mass: 0.1,
    stiffness: 160,
    damping: 14,
  })
  const Tag = href ? motion.a : motion.button
  const linkProps = href
    ? { href, ...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {}) }
    : { type: 'button', onClick }
  return (
    <Tag
      ref={ref}
      style={{ width: size, height: size }}
      className="dock-item"
      aria-label={label}
      title={label}
      {...linkProps}
    >
      {children}
      <span className="dock-tip" aria-hidden="true">
        {label}
      </span>
    </Tag>
  )
}
