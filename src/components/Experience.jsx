import { experience } from '../data/profile'
import { JobCard } from './JobCard'
import { Section } from './Section'

export function Experience() {
  return (
    <Section id="experience" title="Experience">
      <div>
        {experience.map(({ id, ...job }) => (
          <JobCard key={id} {...job} />
        ))}
      </div>
    </Section>
  )
}
