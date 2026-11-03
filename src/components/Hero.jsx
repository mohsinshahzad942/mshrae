import { profile } from '../data/site'
import { useTypewriter } from '../hooks/useTypewriter'

export function Hero({ animate }) {
  const typed = useTypewriter(profile.roles, { enabled: animate })
  const photo = `${import.meta.env.BASE_URL}${profile.photo}`

  return (
    <header className="hero" id="top">
      <div className="floor" aria-hidden="true" />
      <div className="wrap">
        <div>
          <span className="status label">
            <i />
            {profile.location}
          </span>
          <h1>
            <span className="line">
              <span>{profile.first}</span>
            </span>
            <span className="line">
              <span className="grad">{profile.last}</span>
            </span>
          </h1>
          <p className="typed" aria-label={profile.roles[0]}>
            <span aria-hidden="true">{typed}</span>
          </p>
          <p className="pitch">{profile.pitch}</p>
          <div className="cta">
            <a className="btn primary" href={profile.linkedin} target="_blank" rel="noopener noreferrer">
              Connect on LinkedIn ↗
            </a>
            <a className="btn" href="#contact">
              Get in touch
            </a>
          </div>
        </div>
        <div className="orb">
          <div className="ring r1" />
          <div className="ring r2" />
          <div className="core">
            <img src={photo} alt={profile.name} width="520" height="520" fetchPriority="high" />
            <div className="scan" />
          </div>
          {profile.orbTags.map((tag, i) => (
            <span key={tag} className={`tag t${i + 1}`} aria-hidden="true">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </header>
  )
}
