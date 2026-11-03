import { useEffect, useRef } from 'react'
import { flushSync } from 'react-dom'
import { intro, profile } from '../data/site'

/*
 * Opening scene: a giant "HR" cut out of a white curtain. Scrolling the first half-screen zooms
 * through the H into the site; at 80% the hero pops in, and at 88% the intro removes itself
 * (one-way: scrolling back up does not replay it).
 */
const HR_CENTRE = { x: 500, y: 205 }
const C0 = [5, 7, 13]
const C1 = [12, 34, 66]

export function Intro({ onDone }) {
  const introRef = useRef(null)
  const svgRef = useRef(null)
  const wordRef = useRef(null)
  const quoteRef = useRef(null)
  const metaRef = useRef(null)

  useEffect(() => {
    const root = document.documentElement
    const el = introRef.current
    const svg = svgRef.current
    const word = wordRef.current
    const quote = quoteRef.current
    const meta = metaRef.current
    let done = false
    let cancelled = false
    root.classList.add('intro-on')

    function step() {
      if (done) return
      const p = Math.min(1, Math.max(0, scrollY / (innerHeight * 0.5)))
      svg.style.transform = `scale(${Math.pow(140, Math.pow(p, 1.5)).toFixed(3)})`
      // HR starts near-black and shifts to the site's deep navy as it zooms, so the hand-off is seamless.
      const k = Math.min(1, p / 0.75)
      word.setAttribute('fill', `rgb(${C0.map((v, i) => Math.round(v + (C1[i] - v) * k))})`)
      el.style.opacity = p < 0.8 ? 1 : Math.max(0, 1 - (p - 0.8) / 0.07)
      root.classList.toggle('popped', p >= 0.8)
      const qo = Math.max(0, 1 - p * 4)
      const qy = `translateY(${(p * 40).toFixed(1)}px)`
      quote.style.opacity = qo
      quote.style.transform = qy
      meta.style.opacity = qo
      meta.style.transform = qy
      if (p >= 0.88) finish()
    }

    function finish() {
      if (done) return
      done = true
      root.classList.add('popped')
      const y = scrollY
      // Unmount the intro and its scroll spacer in the same frame, then pull the scroll position
      // back by the spacer's height so the page doesn't jump.
      flushSync(onDone)
      scrollTo({ top: Math.max(0, y - innerHeight * 0.5), behavior: 'instant' })
    }

    function origin() {
      svg.style.transform = 'none'
      const pt = svg.createSVGPoint()
      pt.x = HR_CENTRE.x
      pt.y = HR_CENTRE.y
      const sp = pt.matrixTransform(svg.getScreenCTM())
      svg.style.setProperty('--ox', `${sp.x}px`)
      svg.style.setProperty('--oy', `${sp.y}px`)
      step()
    }

    const onScroll = () => requestAnimationFrame(step)
    addEventListener('scroll', onScroll, { passive: true })
    addEventListener('resize', origin)
    origin()
    document.fonts?.ready.then(() => !cancelled && origin())

    return () => {
      cancelled = true
      removeEventListener('scroll', onScroll)
      removeEventListener('resize', origin)
      if (!done) root.classList.remove('intro-on', 'popped')
    }
  }, [onDone])

  return (
    <div id="intro" ref={introRef} aria-hidden="true">
      <svg ref={svgRef} viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet">
        <rect x="-6000" y="-6000" width="13000" height="13000" fill="#ffffff" />
        <text
          ref={wordRef}
          className="hrtext"
          x="500"
          y="205"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="330"
          fill="#05070d"
        >
          HR
        </text>
      </svg>
      <svg ref={quoteRef} className="qlayer" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet">
        <g className="hrquote" fill="#ffffff" textAnchor="middle">
          <text x="500" y="385" fontSize="31">
            {intro.quote[0]}
          </text>
          <text x="500" y="432" fontSize="31" fontWeight="800">
            {intro.quote[1]}
          </text>
        </g>
      </svg>
      <div className="meta" ref={metaRef}>
        <b>{profile.name}</b>
        <span>{intro.subtitle}</span>
        <div className="mouse" />
        <span className="hint">Scroll down</span>
      </div>
    </div>
  )
}
