import { useEffect, useRef } from 'react'
import { particlePalette } from '../hooks/particlePalette'

/** Drifting particle network on a full-screen canvas; particles shy away from the pointer. */
export function ParticleField({ animate = true }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const DPR = Math.min(devicePixelRatio || 1, 2)
    const mouse = { x: -999, y: -999 }
    let W = 0
    let H = 0
    let particles = []
    let frame

    const size = () => {
      W = canvas.width = innerWidth * DPR
      H = canvas.height = innerHeight * DPR
      const n = Math.min(110, Math.floor((innerWidth * innerHeight) / 14000))
      particles = Array.from({ length: n }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35 * DPR,
        vy: (Math.random() - 0.5) * 0.35 * DPR,
        r: (Math.random() * 1.4 + 0.4) * DPR,
      }))
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      const L = 130 * DPR
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > W) p.vx *= -1
        if (p.y < 0 || p.y > H) p.vy *= -1
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const d = Math.hypot(dx, dy)
        if (d < 160 * DPR) {
          p.x += (dx / d) * 0.8
          p.y += (dy / d) * 0.8
        }
        ctx.fillStyle = particlePalette.dot
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, 7)
        ctx.fill()
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i]
          const b = particles[j]
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d < L) {
            ctx.strokeStyle = `rgba(${particlePalette.line},${(1 - d / L) * 0.35})`
            ctx.lineWidth = DPR * 0.6
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }
      if (animate) frame = requestAnimationFrame(draw)
    }

    const onResize = () => {
      size()
      if (!animate) draw()
    }
    const onPointer = (e) => {
      mouse.x = e.clientX * DPR
      mouse.y = e.clientY * DPR
    }

    size()
    draw()
    addEventListener('resize', onResize)
    addEventListener('pointermove', onPointer)
    return () => {
      cancelAnimationFrame(frame)
      removeEventListener('resize', onResize)
      removeEventListener('pointermove', onPointer)
    }
  }, [animate])

  return <canvas id="field" ref={canvasRef} aria-hidden="true" />
}
