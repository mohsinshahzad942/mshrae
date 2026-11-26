/**
 * Labels that slowly orbit a circle, staying upright (the "Orbiting Circles" pattern from Magic UI).
 * Pure CSS animation (see .orbit in effects.css); pauses on hover so a label can be read, and stays
 * still for reduced motion.
 */
export function OrbitingBadges({ items, duration = 36, radius = '50%' }) {
  return (
    <div className="orbit" style={{ '--orbit-dur': `${duration}s`, '--orbit-r': radius }} aria-hidden="true">
      {items.map((label, i) => (
        <span key={label} className="orbit-item" style={{ '--orbit-delay': `${(-duration * i) / items.length}s` }}>
          <span className="orbit-label">{label}</span>
        </span>
      ))}
    </div>
  )
}
