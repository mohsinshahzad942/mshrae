# Taimur Khan, Portfolio (React)

Personal portfolio built with **React 19** and **Vite 8**. Plain CSS with design tokens, light and dark mode, no UI framework.

## Run locally

Requires Node.js 20.19+ (22 recommended).

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build into dist/
npm run preview   # serve the production build
npm run lint
```

## Editing content

All text lives in `src/data/profile.js`: jobs, skills, certifications, contact details. Edit that file; the components render whatever is there.

## Structure

```
src/
  App.jsx                 page composition
  main.jsx                entry point
  data/profile.js         all site content
  hooks/useActiveSection.js  highlights the nav item for the section in view
  components/             SiteHeader, Hero, About, Expertise, Experience, JobCard,
                          Credentials, Contact, SiteFooter, Section, ChipList, ItemList, ExternalLink
  styles/global.css       design tokens and layout
```

## Publishing

The site is live at **https://mohsinshahzad942.github.io/mshrae/**.

`.github/workflows/deploy.yml` builds and deploys it on every push to `main`. Pages must be set to deploy from **GitHub Actions** (Settings → Pages → Build and deployment → Source).

Because this is a project repo, `vite.config.js` sets `base: '/mshrae/'`. If you rename the repo, update that value to match.
