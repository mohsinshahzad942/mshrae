import { navLinks, profile } from '../data/site'
import { SpotlightNavbar } from './ui/spotlight-navbar'
import { MobileMenu } from './MobileMenu'

export function Nav({ active, animate = true }) {
  return (
    <nav aria-label="Main">
      <div className="wrap">
        <span className="logo">
          <i />
          {profile.logo}
        </span>
        <SpotlightNavbar items={navLinks} activeId={active} animated={animate} />
        <MobileMenu animate={animate} />
      </div>
      <div className="progress" aria-hidden="true" />
    </nav>
  )
}
