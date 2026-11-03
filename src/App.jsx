import { About } from './components/About'
import { Contact } from './components/Contact'
import { Credentials } from './components/Credentials'
import { Experience } from './components/Experience'
import { Expertise } from './components/Expertise'
import { Hero } from './components/Hero'
import { SiteFooter } from './components/SiteFooter'
import { SiteHeader } from './components/SiteHeader'

export default function App() {
  return (
    <>
      <a className="skip-link" href="#about">
        Skip to content
      </a>
      <SiteHeader />
      <main id="top">
        <Hero />
        <About />
        <Expertise />
        <Experience />
        <Credentials />
        <Contact />
      </main>
      <SiteFooter />
    </>
  )
}
