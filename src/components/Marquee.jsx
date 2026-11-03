import { marquee } from '../data/site'

/** Infinite ticker: the list is rendered twice so the -50% slide loops seamlessly. */
export function Marquee() {
  const items = [...marquee, ...marquee]
  return (
    <div className="marquee" aria-hidden="true">
      <div className="track">
        {items.map((item, i) => (
          <span key={i}>{item}</span>
        ))}
      </div>
    </div>
  )
}
