/**
 * A soft beam of light that sweeps in from the top-left on load (Aceternity UI's "Spotlight" pattern).
 * Pure SVG + CSS animation (see .spotlight in effects.css); hidden for reduced motion.
 */
export function Spotlight({ className = '' }) {
  return (
    <svg className={`spotlight ${className}`.trim()} viewBox="0 0 3787 2842" fill="none" aria-hidden="true">
      <g filter="url(#spot-blur)">
        <ellipse
          cx="1924.71"
          cy="273.501"
          rx="1924.71"
          ry="273.501"
          transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
          fill="var(--c1)"
          fillOpacity="0.16"
        />
      </g>
      <defs>
        <filter
          id="spot-blur"
          x="0.86"
          y="0.84"
          width="3785.16"
          height="2840.26"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="151" />
        </filter>
      </defs>
    </svg>
  )
}
