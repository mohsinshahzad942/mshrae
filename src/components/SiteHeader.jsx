import { navLinks, profile } from '../data/profile'
import { useActiveSection } from '../hooks/useActiveSection'

const sectionIds = navLinks.map((link) => link.id)

export function SiteHeader() {
  const active = useActiveSection(sectionIds)

  return (
    <header className="nav">
      <div className="wrap">
        <a className="mark" href="#top">
          {profile.name}
          <span>.</span>
        </a>
        <nav aria-label="Sections">
          <ul>
            {navLinks.map(({ id, label }) => (
              <li key={id}>
                <a href={`#${id}`} aria-current={active === id ? 'location' : undefined}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
