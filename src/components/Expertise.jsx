import { expertise, lifecycle } from '../data/profile'
import { ChipList } from './ChipList'
import { Section } from './Section'

export function Expertise() {
  return (
    <Section id="expertise" title="Expertise">
      <div>
        <ChipList items={expertise} label="Areas of expertise" />
        <h3 className="label spaced-lg">{lifecycle.title}</h3>
        <ol className="visa">
          {lifecycle.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <p className="visa-note">{lifecycle.note}</p>
      </div>
    </Section>
  )
}
