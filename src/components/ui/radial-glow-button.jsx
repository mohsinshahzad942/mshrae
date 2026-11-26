import { cn } from '@/lib/utils'

/**
 * Button with a radial "planet-rise" gradient that shifts on hover, a gradient hairline border and a sweeping shine.
 * Adapted from Vengeance UI's RadialGlowButton (vengenceui.com): the CSS lives in tailwind.css (loaded once instead
 * of per button), colours use the site's indigo/violet, and `href` renders it as a link.
 */
export function RadialGlowButton({ href, children, className, ...props }) {
  const Tag = href ? 'a' : 'button'
  const extra = href ? { href } : { type: 'button' }
  return (
    <Tag className={cn('rg-button', className)} {...extra} {...props}>
      <span className="rg-shine" aria-hidden="true">
        <span />
      </span>
      <span className="rg-bg" aria-hidden="true" />
      <span className="rg-label">{children}</span>
    </Tag>
  )
}
