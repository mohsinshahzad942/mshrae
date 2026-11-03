import { Link } from 'react-router'
import { profile } from '../data/site'

/** Layout for the application and admin pages. `theme="light"` gives a white page with slowly fading pastel colours. */
export function PageShell({ title, kicker, actions, theme = 'dark', children }) {
  return (
    <div className={`page ${theme}`}>
      {theme === 'light' && (
        <div className="pastel" aria-hidden="true">
          <i className="p1" />
          <i className="p2" />
          <i className="p3" />
        </div>
      )}
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
