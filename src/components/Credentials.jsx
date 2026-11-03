import { credentials } from '../data/profile'
import { ChipList } from './ChipList'
import { ItemList } from './ItemList'
import { Section } from './Section'

export function Credentials() {
  const { education, certifications, tools, languages, workStyle } = credentials
  return (
    <Section id="credentials" title="Credentials">
      <div className="grid2">
        <div>
          <h3 className="label">Education</h3>
          <ItemList items={education} />
          <h3 className="label spaced">Certifications</h3>
          <ItemList items={certifications} />
        </div>
        <div>
          <h3 className="label">Tools</h3>
          <ItemList items={tools} />
          <h3 className="label spaced">Languages</h3>
          <ChipList items={languages} label="Languages spoken" />
          <h3 className="label spaced">How I work</h3>
          <p className="flush">{workStyle}</p>
        </div>
      </div>
    </Section>
  )
}
