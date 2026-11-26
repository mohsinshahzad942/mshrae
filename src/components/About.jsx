import { about } from '../data/site'
import { Panel } from './Panel'
import { SectionHead } from './SectionHead'
import { Stat } from './Stat'
import { BorderBeam } from './ui/border-beam'

export function About({ animate }) {
  return (
    <section className="block" id="about">
      <div className="wrap">
        <SectionHead index="01" caption="profile">
          About <span className="grad">me</span>
        </SectionHead>
        <div className="about-grid">
          <Panel className="reveal beam-host">
            <BorderBeam duration={14} />
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
