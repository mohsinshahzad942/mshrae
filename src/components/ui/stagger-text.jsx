import { motion } from 'motion/react'

const EASE = [0.22, 1, 0.36, 1]
const item = { hidden: { y: '110%' }, show: { y: '0%', transition: { duration: 0.6, ease: EASE } } }

/**
 * Words slide up one after another when the text scrolls into view.
 * Adapted from Vengeance UI's TextAnimation / stagger-text (vengenceui.com). Plain text only.
 */
export function StaggerText({ children, delay = 0, enabled = true }) {
  const text = String(children)
  if (!enabled) return text
  const words = text.split(' ')
  return (
    <motion.span
      aria-label={text}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04, delayChildren: delay } } }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      style={{ display: 'inline' }}
    >
      {words.map((w, i) => (
        <span key={i} aria-hidden="true" className="relative inline-block overflow-hidden align-top">
          <motion.span variants={item} className="inline-block will-change-transform">
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </motion.span>
  )
}
