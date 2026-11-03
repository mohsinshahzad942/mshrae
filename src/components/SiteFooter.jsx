import { profile } from '../data/profile'

export function SiteFooter() {
  const year = new Date().getFullYear()
  return (
    <footer>
      <div className="wrap">
        © {year} {profile.name} · {profile.footer}
      </div>
    </footer>
  )
}
