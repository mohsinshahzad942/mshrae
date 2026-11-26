import { profile } from '../data/site'
import { useTypewriter } from '../hooks/useTypewriter'
// Imported so the built file name includes a content hash: a new photo always busts browser caches.
import photo from '../assets/photo.jpg'
import { CyberGlitchText } from './ui/cyber-glitch-text'
import { RadialGlowButton } from './ui/radial-glow-button'
import { Spotlight } from './ui/spotlight'
import { FlickeringGrid } from './ui/flickering-grid'
import { Magnetic } from './ui/magnetic'
import { OrbitingBadges } from './ui/orbiting-badges'
import { StaggerText } from './ui/stagger-text'

export function Hero({ animate, ready = true }) {
  const typed = useTypewriter(profile.roles, { enabled: animate })

  return (
    <header className="hero" id="top">
      <div className="floor" aria-hidden="true" />
      <FlickeringGrid className="hero-flicker" animate={animate} />
      {animate && <Spotlight />}
      <div className="wrap">
        <div className="hero-copy">
          <span className="status label">
            <i />
            {profile.location}
          </span>
          <h1>
            <span className="line">
              <span>
                <CyberGlitchText text={profile.first} play={ready} enabled={animate} />
              </span>
            </span>
            <span className="line">
              <span className="grad">
                <CyberGlitchText text={profile.last} play={ready} enabled={animate} />
              </span>
            </span>
          </h1>
          <p className="typed" aria-label={profile.roles[0]}>
            <span aria-hidden="true">{typed}</span>
          </p>
          <p className="pitch">
            <StaggerText enabled={animate} delay={0.3}>
              {profile.pitch}
            </StaggerText>
          </p>
          <div className="cta">
            <Magnetic enabled={animate}>
              <RadialGlowButton href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                Connect on LinkedIn ↗
              </RadialGlowButton>
            </Magnetic>
            <Magnetic enabled={animate}>
              <a className="btn" href="#contact">
                Get in touch
              </a>
            </Magnetic>
          </div>
        </div>
        <div className="orb">
          <div className="ring r1" />
          <div className="ring r2" />
          <div className="core">
            <img src={photo} alt={profile.name} width="520" height="520" fetchPriority="high" />
            <div className="scan" />
          </div>
          <OrbitingBadges items={profile.orbit} />
        </div>
      </div>
    </header>
  )
}
