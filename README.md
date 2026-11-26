# Mohsin Shahzad, Portfolio (React)

Personal branding site for Mohsin Shahzad, Human Resource Executive in Abu Dhabi. Built with **React 19** and **Vite 8**.

Live: **https://mohsinshahzad942.github.io/mshrae/**

## Run locally

Requires Node.js 20.19+ (22 recommended).

```bash
npm install
npm run dev       # http://localhost:5173/mshrae/
npm run build     # production build into dist/
npm run preview   # serve the production build
npm run lint
```

## Editing content

All text lives in `src/data/site.js`: profile, roles for the typing effect, experience, highlights, skills and contact details. The portrait is `src/assets/photo.jpg`.

## Structure

```
src/
  App.jsx                    page composition
  data/site.js               all site content
  components/
    Intro.jsx                "HR" zoom-through opening scene
    ParticleField.jsx        canvas particle network
    Backdrop.jsx             aurora, noise, edge dimming, cursor glow
    Nav.jsx, Hero.jsx, Marquee.jsx, About.jsx, Stat.jsx,
    Experience.jsx, Highlights.jsx, Contact.jsx, Footer.jsx
    Panel.jsx                glass card with pointer-lit border and optional 3D tilt
    SectionHead.jsx, CopyButton.jsx
  hooks/
    useScrollTheme.js        scroll-linked background, dark/light text swap, halo, dimming
    useActiveSection.js      highlights the nav and sets the per-section aurora colours
    useTypewriter.js         typing roles in the hero
    useCountUp.js            animated stat numbers
    useReducedMotion.js      respects the OS "reduce motion" setting (no intro, no animation)
  styles/global.css          design tokens, layout and animations
```

Animations that run every frame (particles, scroll theme, pointer effects) write to the DOM or CSS variables directly instead of React state, so scrolling and mouse movement never re-render the page.

## Deploying

`.github/workflows/deploy.yml` builds and deploys to GitHub Pages on every push to `main` (Settings → Pages → Source must be **GitHub Actions**).

Because this is a project repo, `vite.config.js` sets `base: '/mshrae/'`. If you rename the repo, update that value to match.

## UI component libraries (Skiper UI, Vengeance UI, Animmaster Lib)

These are copy-paste component collections, not npm packages. The groundwork they need is installed:
Tailwind CSS v4 (without its CSS reset, so `global.css` is untouched), `motion`/`framer-motion`, `clsx`,
`tailwind-merge`, the `cn()` helper in `src/lib/utils.js`, and the `@/` import alias for `src/`.

- **Vengeance UI**: `npx shadcn@latest add @vengeanceui/<component>` (registry is set in `components.json`),
  e.g. `npx shadcn@latest add @vengeanceui/animated-rays`. Files land in `src/components/ui/`.
- **Skiper UI**: open the component on skiper-ui.com, paste its code into `src/components/ui/<name>.tsx`
  (Vite compiles `.tsx` as-is), then import it with `@/components/ui/<name>`.
- **Animmaster Lib**: paid; after purchase, copy the React components from the download into `src/components/ui/`.

Components in use (adapted copies in `src/components/ui/`, styles in `src/styles/effects.css`):
spotlight navbar (top nav), cyber glitch text (hero name), stagger text (hero pitch), radial glow button (LinkedIn buttons),
stats counter (About numbers), border beam (About, current role, Highlights on hover, Contact).
