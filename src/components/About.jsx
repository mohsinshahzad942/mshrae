import { about } from '../data/profile'
import { Section } from './Section'

export function About() {
  return (
    <Section id="about" title="About">
      <div>
        {about.map((paragraph) => (
          <p key={paragraph.slice(0, 24)}>{paragraph}</p>
        ))}
      </div>
    </Section>
  )
}
