import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Paragraph whose words light up one by one as it scrolls through the viewport
 * (the "text reveal" pattern from Magic UI, rebuilt on GSAP ScrollTrigger). Plain text when disabled.
 */
export function ScrollTextReveal({ children, enabled = true, as: Tag = 'p', className }) {
  const ref = useRef(null)
  const text = String(children)

  useLayoutEffect(() => {
    if (!enabled || !ref.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current.querySelectorAll('.w'),
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.05,
          scrollTrigger: { trigger: ref.current, start: 'top 80%', end: 'bottom 45%', scrub: 0.5 },
        },
      )
    }, ref)
    return () => ctx.revert()
  }, [enabled, text])

  if (!enabled) return <Tag className={className}>{text}</Tag>
  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {text.split(' ').map((w, i) => (
        <span key={i} className="w" aria-hidden="true">
          {w}{' '}
        </span>
      ))}
    </Tag>
  )
}
