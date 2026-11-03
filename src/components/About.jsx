import { about } from '../data/site'
import { Panel } from './Panel'
import { SectionHead } from './SectionHead'
import { Stat } from './Stat'

export function About({ animate }) {
  return (
    <section className="block" id="about">
      <div className="wrap">
        <SectionHead index="01" caption="profile">
          About <span className="grad">me</span>
        </SectionHead>
        <div className="about-grid">
          <Panel className="reveal">
            {about.paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </Panel>
          <div className="stats">
            {about.stats.map((stat, i) => (
              <Stat key={stat.label} {...stat} delay={i < 2 ? 'd1' : 'd2'} animate={animate} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
