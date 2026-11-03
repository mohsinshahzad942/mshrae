import { useEffect } from 'react'
import { particlePalette } from './particlePalette'

/*
 * Scroll-linked theme: the background walks black → navy → blue, then crosses quickly to sky → white.
 * Text never fades with it: each frame picks whichever text palette has the higher contrast against the
 * current background (no blending), and a soft halo is added only while the background is mid-tone.
 * Everything is written as CSS custom properties on <html>, so React never re-renders on scroll.
 */
const STOPS = [
  [0, [5, 7, 13]],
  [0.22, [10, 25, 49]],
  [0.48, [19, 58, 104]],
  [0.56, [30, 80, 140]],
  [0.62, [200, 222, 240]],
  [0.8, [236, 243, 249]],
  [1, [255, 255, 255]],
]
const DARK = {
  ink: [232, 238, 255, 1], muted: [176, 188, 214, 1], line: [150, 180, 255, 0.18], glass: [140, 170, 255, 0.07],
  ghi: [140, 170, 255, 0.13], c1: [61, 242, 255, 1], c2: [125, 170, 255, 1], c3: [52, 211, 153, 1],
  bg2: [10, 15, 28, 1], card: [8, 16, 32, 0.9],
}
const LIGHT = {
  ink: [11, 31, 58, 1], muted: [51, 65, 85, 1], line: [11, 31, 58, 0.16], glass: [11, 31, 58, 0.04],
  ghi: [11, 31, 58, 0.08], c1: [14, 96, 122, 1], c2: [29, 78, 216, 1], c3: [4, 108, 78, 1],
  bg2: [232, 240, 248, 1], card: [255, 255, 255, 0.92],
}
const VARS = {
  ink: '--ink', muted: '--muted', line: '--line', glass: '--glass', ghi: '--glass-hi',
  c1: '--c1', c2: '--c2', c3: '--c3', bg2: '--bg2', card: '--card',
}

const mix = (a, b, k) => a.map((v, i) => v + (b[i] - v) * k)
const rgba = (c) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${(+c[3]).toFixed(3)})`
const lin = (v) => {
  v /= 255
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
}
const lum = (c) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2])
const ratio = (a, b) => {
  const x = lum(a)
  const y = lum(b)
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)
}
function bgAt(p) {
  for (let i = 0; i < STOPS.length - 1; i++) {
    const [a, ca] = STOPS[i]
    const [b, cb] = STOPS[i + 1]
    if (p <= b) return mix(ca, cb, Math.max(0, Math.min(1, (p - a) / (b - a))))
  }
  return STOPS[STOPS.length - 1][1]
}

export function useScrollTheme(dimRef) {
  useEffect(() => {
    const root = document.documentElement
    let ticking = false
    let mode = ''

    const paint = () => {
      ticking = false
      const max = root.scrollHeight - innerHeight
      const p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0
      const bg = bgAt(p)
      const cd = ratio(DARK.muted, bg)
      const cl = ratio(LIGHT.muted, bg)
      const light = cl > cd
      const set = light ? LIGHT : DARK
      const cr = Math.max(cd, cl)

      root.style.setProperty('--bg', `rgb(${bg[0] | 0},${bg[1] | 0},${bg[2] | 0})`)
      root.style.setProperty('--surf', `${bg[0] | 0},${bg[1] | 0},${bg[2] | 0}`)

      const m = light ? 'light' : 'dark'
      if (m !== mode) {
        mode = m
        for (const n in VARS) root.style.setProperty(VARS[n], rgba(set[n]))
        root.style.colorScheme = m
        Object.assign(
          particlePalette,
          light ? { dot: 'rgba(14,96,122,.55)', line: '29,78,216' } : { dot: 'rgba(61,242,255,.7)', line: '125,170,255' },
        )
      }

      // Halo: none while contrast is comfortable (>= 7), rising to full near the crossover.
      const h = Math.max(0, Math.min(1, (7 - cr) / 3))
      const o = light ? '255,255,255' : '5,10,25'
      root.style.setProperty(
        '--halo',
        h > 0 ? `0 0 2px rgba(${o},${(h * 0.9).toFixed(2)}),0 0 10px rgba(${o},${(h * 0.7).toFixed(2)})` : 'none',
      )

      const e = Math.min(1, lum(bg) * 1.6)
      root.style.setProperty('--aur', (1 - e * 0.75).toFixed(3))

      // Darken the edges more while a section boundary crosses the middle of the screen.
      const mid = innerHeight / 2
      let near = 1e9
      for (const s of document.querySelectorAll('header#top, section.block')) {
        const r = s.getBoundingClientRect()
        near = Math.min(near, Math.abs(r.top - mid), Math.abs(r.bottom - mid))
      }
      const d = Math.max(0, 1 - near / (innerHeight * 0.35))
      dimRef.current?.style.setProperty('--dim', ((0.25 + d * 0.55) * (1 - e * 0.85)).toFixed(3))
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(paint)
      }
    }
    addEventListener('scroll', onScroll, { passive: true })
    addEventListener('resize', paint)
    paint()
    return () => {
      removeEventListener('scroll', onScroll)
      removeEventListener('resize', paint)
    }
  }, [dimRef])
}
