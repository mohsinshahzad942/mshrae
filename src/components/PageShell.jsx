import { Link } from 'react-router'
import { profile } from '../data/site'

/** Plain dark layout for the application and admin pages. */
export function PageShell({ title, kicker, actions, children }) {
  return (
    <div className="page">
      <nav aria-label="Main">
        <div className="wrap">
          <Link to="/" className="logo">
            <i />
            {profile.logo}
          </Link>
          <div className="page-actions">
            {actions}
            <Link to="/" className="btn small">
              ← Back to site
            </Link>
          </div>
        </div>
      </nav>
      <main className="wrap page-main">
        <p className="label">{kicker}</p>
        <h1 className="page-title">{title}</h1>
        {children}
      </main>
    </div>
  )
}
