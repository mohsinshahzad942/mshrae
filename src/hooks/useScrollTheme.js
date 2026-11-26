import { useEffect } from 'react'
import { particlePalette } from './particlePalette'

/*
 * Scroll-linked theme: the background walks graphite → deep indigo, then crosses quickly to pale grey → white.
 * Text never fades with it: each frame picks whichever text palette has the higher contrast against the
 * current background (no blending), and a soft halo is added only while the background is mid-tone.
 * Everything is written as CSS custom properties on <html>, so React never re-renders on scroll.
 */
const STOPS = [
  [0, [9, 9, 11]],
  [0.22, [14, 14, 20]],
  [0.48, [22, 22, 34]],
  [0.56, [34, 33, 52]],
  [0.62, [226, 226, 236]],
  [0.8, [242, 242, 246]],
  [1, [250, 250, 250]],
]
const DARK = {
  ink: [250, 250, 250, 1], muted: [176, 176, 186, 1], line: [255, 255, 255, 0.1], glass: [255, 255, 255, 0.04],
  ghi: [255, 255, 255, 0.08], c1: [129, 140, 248, 1], c2: [167, 139, 250, 1], c3: [199, 210, 254, 1],
  bg2: [17, 17, 19, 1], card: [18, 18, 21, 0.88],
}
const LIGHT = {
  ink: [9, 9, 11, 1], muted: [63, 63, 70, 1], line: [9, 9, 11, 0.12], glass: [9, 9, 11, 0.03],
  ghi: [9, 9, 11, 0.06], c1: [79, 70, 229, 1], c2: [124, 58, 237, 1], c3: [55, 48, 163, 1],
  bg2: [244, 244, 245, 1], card: [255, 255, 255, 0.92],
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
          light ? { dot: 'rgba(79,70,229,.45)', line: '99,102,241' } : { dot: 'rgba(165,180,252,.6)', line: '129,140,248' },
        )
      }

      // Halo: none while contrast is comfortable (>= 7), rising to full near the crossover.
      const h = Math.max(0, Math.min(1, (7 - cr) / 3))
      const o = light ? '255,255,255' : '9,9,11'
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
      // Leave no scroll-driven colours behind for other pages.
      for (const v of ['--bg', '--surf', '--halo', '--aur', ...Object.values(VARS)]) root.style.removeProperty(v)
      root.style.colorScheme = ''
    }
  }, [dimRef])
}
