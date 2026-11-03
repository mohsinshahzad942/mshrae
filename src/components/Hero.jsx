import { facts, profile } from '../data/profile'
import { ExternalLink } from './ExternalLink'

export function Hero() {
  return (
    <div className="wrap hero">
      <p className="eyebrow">{profile.eyebrow}</p>
      <h1>
        {profile.headline.lead}
        <em>{profile.headline.emphasis}</em>
      </h1>
      <p className="lede">
        I’m {profile.name}. For <strong>19 years</strong> I’ve led HR, talent acquisition and
        administration, <strong>17 of them in the UAE</strong>, across EPC, manufacturing, logistics
        and recruitment. I build HR functions from scratch, keep them compliant with UAE Labour Law
        and MOHRE, and partner with leadership through growth and restructuring.
      </p>
      <div className="cta">
        <a className="btn primary" href="#contact">
          Get in touch
        </a>
        <ExternalLink className="btn ghost" href={profile.linkedin}>
          LinkedIn profile <span aria-hidden="true">↗</span>
        </ExternalLink>
      </div>
      <dl className="facts">
        {facts.map(({ value, label }) => (
          <div className="fact" key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
