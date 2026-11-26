import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import 'lenis/dist/lenis.css'

gsap.registerPlugin(ScrollTrigger)

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger scenes stay in lock-step with it.
 * In-page links (#about, #contact…) glide to their section, leaving room for the sticky nav.
 */
export function useSmoothScroll(enabled) {
  useEffect(() => {
    if (!enabled) return
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true, anchors: { offset: -72 } })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [enabled])
}
