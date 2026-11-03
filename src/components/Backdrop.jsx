import { useEffect, useRef } from 'react'

/** Fixed decorative layers: aurora blobs, scanline noise, edge dimming and the cursor glow. */
export function Backdrop({ dimRef }) {
  const glowRef = useRef(null)

  useEffect(() => {
    const glow = glowRef.current
    const onPointer = (e) => {
      glow.style.left = `${e.clientX}px`
      glow.style.top = `${e.clientY}px`
    }
    addEventListener('pointermove', onPointer)
    return () => removeEventListener('pointermove', onPointer)
  }, [])

  return (
    <>
      <div className="aurora" aria-hidden="true">
        <i className="b1" />
        <i className="b2" />
        <i className="b3" />
      </div>
      <div className="noise" aria-hidden="true" />
      <div className="dim" ref={dimRef} aria-hidden="true" />
      <div className="glow" ref={glowRef} aria-hidden="true" />
    </>
  )
}
