import { navLinks, profile } from '../data/site'

export function Nav({ active }) {
  return (
    <nav aria-label="Main">
      <div className="wrap">
        <span className="logo">
          <i />
          {profile.logo}
        </span>
        <ul>
          {navLinks.map(({ id, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={active === id ? 'on' : undefined}
                aria-current={active === id ? 'location' : undefined}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="progress" aria-hidden="true" />
    </nav>
  )
}
