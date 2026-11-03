/**
 * Glass card whose border lights up under the pointer. With `tilt`, it also leans in 3D toward it.
 * Pointer effects write styles directly to the element, so moving the mouse never re-renders React.
 */
export function Panel({ as: Tag = 'div', className = '', tilt = false, children, ...rest }) {
  const onPointerMove = (e) => {
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
    if (tilt) {
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      el.style.transform = `perspective(800px) rotateY(${px * 10}deg) rotateX(${-py * 10}deg) translateZ(0)`
    }
  }
  const onPointerLeave = tilt ? (e) => (e.currentTarget.style.transform = '') : undefined

  return (
    <Tag
      className={`panel${tilt ? ' tilt' : ''} ${className}`.trim()}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      {...rest}
    >
      {children}
    </Tag>
  )
}
