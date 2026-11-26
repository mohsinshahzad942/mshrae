import { navLinks, profile } from '../data/site'
import { SpotlightNavbar } from './ui/spotlight-navbar'

export function Nav({ active, animate = true }) {
  return (
    <nav aria-label="Main">
      <div className="wrap">
        <span className="logo">
          <i />
          {profile.logo}
        </span>
        <SpotlightNavbar items={navLinks} activeId={active} animated={animate} />
      </div>
      <div className="progress" aria-hidden="true" />
    </nav>
  )
}
