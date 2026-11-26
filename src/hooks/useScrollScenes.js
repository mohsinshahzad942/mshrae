import { useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * All scroll-driven scenes on the home page, built with GSAP ScrollTrigger:
 * - hero parallax (text drifts up and fades, portrait sinks and tilts)
 * - section headings wipe in from the left through a blur
 * - cards rise out of a blur in staggered batches
 * - the skills ticker speeds up and skews with scroll velocity
 * - the experience timeline's beam fills as you read, lighting each dot it passes
 * Everything is reverted on unmount, and nothing runs when `enabled` is false (reduced motion).
 */
export function useScrollScenes(enabled) {
  useLayoutEffect(() => {
    if (!enabled) return
    const root = document.documentElement
    root.classList.add('gsap-on')

    const mm = gsap.matchMedia()
    const ctx = gsap.context(() => {
      // Hero parallax
      const hero = document.querySelector('#top')
      if (hero) {
        const tl = gsap.timeline({ scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } })
        tl.to('#top .hero-copy', { yPercent: -18, opacity: 0.15, ease: 'none' }, 0)
          .to('#top .orb', { yPercent: 22, rotate: 8, scale: 0.9, ease: 'none' }, 0)
          .to('#top .floor', { opacity: 0, ease: 'none' }, 0)
      }

      // Section headings: clip-path wipe + de-blur
      gsap.utils.toArray('.head').forEach((head) => {
        gsap.fromTo(
          head.querySelector('h2'),
          { clipPath: 'inset(0 100% 0 0)', filter: 'blur(10px)', x: -24 },
          {
            clipPath: 'inset(0 0% 0 0)',
            filter: 'blur(0px)',
            x: 0,
            duration: 1.1,
            ease: 'expo.out',
            scrollTrigger: { trigger: head, start: 'top 85%', once: true },
          },
        )
        gsap.from(head, {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: head, start: 'top 90%', once: true },
        })
      })

      // Cards and panels rise out of a blur, in batches
      gsap.set('.reveal:not(.head)', {
        opacity: 0,
        y: 60,
        rotateX: 10,
        filter: 'blur(14px)',
        transformPerspective: 900,
      })
      ScrollTrigger.batch('.reveal:not(.head)', {
        start: 'top 88%',
        once: true,
        onEnter: (els) =>
          gsap.to(els, {
            opacity: 1,
            y: 0,
            rotateX: 0,
            filter: 'blur(0px)',
            duration: 0.9,
            stagger: 0.09,
            ease: 'power3.out',
            clearProps: 'filter,transform',
          }),
      })

      // Skills chips pop in one after another
      gsap.utils.toArray('.chips').forEach((list) =>
        gsap.from(list.children, {
          scale: 0.6,
          opacity: 0,
          y: 12,
          duration: 0.5,
          stagger: 0.035,
          ease: 'back.out(2)',
          scrollTrigger: { trigger: list, start: 'top 85%', once: true },
        }),
      )

      // Background colour fields drift at different speeds as you scroll (depth)
      gsap.utils.toArray('.aurora i').forEach((blob, i) =>
        // Tween CSS variables (read by the `translate` property) so the blobs' own CSS drift keeps running.
        gsap.to(blob, {
          '--py': ['-22vh', '18vh', '-34vh'][i % 3],
          '--px': ['6vw', '-8vw', '10vw'][i % 3],
          ease: 'none',
          scrollTrigger: { start: 0, end: 'max', scrub: 1.2 },
        }),
      )

      // Ticker: constant drift, boosted and skewed by scroll velocity
      const track = document.querySelector('.marquee .track')
      if (track) {
        const loop = gsap.to(track, { xPercent: -50, duration: 32, ease: 'none', repeat: -1 })
        const skew = gsap.quickTo(track, 'skewX', { duration: 0.4, ease: 'power3' })
        ScrollTrigger.create({
          onUpdate: (self) => {
            const v = self.getVelocity()
            loop.timeScale(1 + Math.min(6, Math.abs(v) / 300))
            skew(gsap.utils.clamp(-12, 12, v / -120))
            gsap.to(loop, { timeScale: 1, duration: 1.2, overwrite: true, delay: 0.15 })
          },
        })
      }

      // Experience: tracing beam
      const timeline = document.querySelector('.timeline-wrap')
      if (timeline) {
        gsap.fromTo(
          '.timeline-wrap .trace',
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: { trigger: timeline, start: 'top 65%', end: 'bottom 65%', scrub: 0.6 },
          },
        )
        gsap.utils
          .toArray('.timeline > li')
          .forEach((li) =>
            ScrollTrigger.create({ trigger: li, start: 'top 65%', toggleClass: { targets: li, className: 'lit' } }),
          )
      }
    })

    // Fonts and images change layout after first paint; re-measure once they settle.
    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh)
    addEventListener('load', refresh)

    return () => {
      removeEventListener('load', refresh)
      mm.revert()
      ctx.revert()
      root.classList.remove('gsap-on')
    }
  }, [enabled])
}
