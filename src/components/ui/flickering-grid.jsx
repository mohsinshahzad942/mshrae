import { useEffect, useRef } from 'react'

/**
 * A grid of tiny squares that gently flicker (the "Flickering Grid" pattern from Magic UI), drawn on a
 * canvas at ~20fps. It only animates while on screen and while the tab is visible, and draws one still
 * frame for reduced motion.
 */
export function FlickeringGrid({
  className = '',
  square = 3,
  gap = 7,
  chance = 0.25,
  maxOpacity = 0.35,
  animate = true,
}) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(devicePixelRatio || 1, 2)
    let cols = 0
    let rows = 0
    let cells = new Float32Array(0)
    let color = '15,118,110'
    let frame = 0
    let last = 0
    let visible = false

    const readColor = () => {
      const c = getComputedStyle(canvas).color.match(/\d+/g)
      if (c) color = c.slice(0, 3).join(',')
    }
    const size = () => {
      const { width, height } = canvas.getBoundingClientRect()
      canvas.width = width * dpr
      canvas.height = height * dpr
      cols = Math.ceil(width / (square + gap))
      rows = Math.ceil(height / (square + gap))
      cells = Float32Array.from({ length: cols * rows }, () => Math.random() * maxOpacity)
      readColor()
      draw()
    }
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const s = square * dpr
      const step = (square + gap) * dpr
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          ctx.fillStyle = `rgba(${color},${cells[i * rows + j]})`
          ctx.fillRect(i * step, j * step, s, s)
        }
      }
    }
    const tick = (t) => {
      frame = requestAnimationFrame(tick)
      if (t - last < 50) return
      const dt = (t - last) / 1000
      last = t
      for (let k = 0; k < cells.length; k++) if (Math.random() < chance * dt) cells[k] = Math.random() * maxOpacity
      draw()
    }
    const start = () => {
      if (animate && visible && !document.hidden && !frame) frame = requestAnimationFrame(tick)
    }
    const stop = () => {
      cancelAnimationFrame(frame)
      frame = 0
    }
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      visible ? start() : stop()
    })
    const onVis = () => (document.hidden ? stop() : start())
    const ro = new ResizeObserver(size)
    ro.observe(canvas)
    io.observe(canvas)
    document.addEventListener('visibilitychange', onVis)
    size()
    return () => {
      stop()
      io.disconnect()
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [square, gap, chance, maxOpacity, animate])

  return <canvas ref={ref} className={`flicker ${className}`.trim()} aria-hidden="true" />
}
