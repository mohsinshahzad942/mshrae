import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

const CHARS = '!<>-_\\/[]{}=+*^?#'

/**
 * Text that "decodes" from random symbols, and glitches with a chromatic split on hover.
 * Adapted from Vengeance UI's CyberGlitchText (vengenceui.com): screen readers always get the real text,
 * `play` re-runs the decode when it turns true (e.g. after the intro), and it stays still when `enabled` is false.
 */
export function CyberGlitchText({ text, className, play = true, enabled = true, speed = 40 }) {
  const [display, setDisplay] = useState(text)
  const [hovered, setHovered] = useState(false)
  const timer = useRef(null)

  const scramble = useCallback(() => {
    if (!enabled) return
    let iteration = 0
    clearInterval(timer.current)
    timer.current = setInterval(() => {
      setDisplay(
        text
          .split('')
          .map((ch, i) => (i < iteration ? text[i] : CHARS[Math.floor(Math.random() * CHARS.length)]))
          .join(''),
      )
      if (iteration >= text.length) clearInterval(timer.current)
      iteration += 1 / 3
    }, speed)
  }, [text, enabled, speed])

  useEffect(() => {
    if (play) scramble()
    return () => clearInterval(timer.current)
  }, [play, scramble])

  const glitch = enabled && hovered
  return (
    <span
      className={cn('relative inline-block', className)}
      aria-label={text}
      onMouseEnter={() => {
        setHovered(true)
        scramble()
      }}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="relative z-10" aria-hidden="true">
        {display}
      </span>
      {glitch && (
        <>
          <motion.span
            className="absolute left-[-2px] top-0 z-0 text-[#f472b6] mix-blend-screen"
            initial={{ x: 0, opacity: 0 }}
            animate={{ x: [-2, 2, -1, 3, 0], opacity: [0, 0.8, 0.4, 0.9, 0] }}
            transition={{ duration: 0.2, repeat: Infinity, repeatType: 'mirror' }}
            aria-hidden="true"
          >
            {display}
          </motion.span>
          <motion.span
            className="absolute left-[2px] top-0 z-0 text-[var(--c1)] mix-blend-screen"
            initial={{ x: 0, opacity: 0 }}
            animate={{ x: [2, -2, 1, -3, 0], opacity: [0, 0.8, 0.4, 0.9, 0] }}
            transition={{ duration: 0.2, repeat: Infinity, repeatType: 'mirror', delay: 0.05 }}
            aria-hidden="true"
          >
            {display}
          </motion.span>
        </>
      )}
    </span>
  )
}
