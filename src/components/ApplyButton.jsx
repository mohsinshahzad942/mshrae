import { Link } from 'react-router'

/** Floating tab pinned to the middle of the right edge; it slides in, then keeps gently moving. */
export function ApplyButton() {
  return (
    <Link to="/apply" className="apply-fab">
      <span className="apply-fab-dot" aria-hidden="true" />
      Apply for a Job
    </Link>
  )
}
