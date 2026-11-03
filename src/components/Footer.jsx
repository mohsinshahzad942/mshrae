import { profile } from '../data/site'

export function Footer() {
  return (
    <footer>
      <div className="wrap">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <span>Abu Dhabi · UAE</span>
      </div>
    </footer>
  )
}
