import { education, highlights, skills } from '../data/site'
import { Panel } from './Panel'
import { SectionHead } from './SectionHead'

const DELAYS = ['', 'd1', 'd2']

export function Highlights({ animate }) {
  return (
    <section className="block" id="highlights">
      <div className="wrap">
        <SectionHead index="03" caption="core expertise">
          High<span className="grad">lights</span>
        </SectionHead>
        <div className="hl xgrid">
          {highlights.map(({ title, text }, i) => (
            <Panel as="article" key={title} tilt={animate} className={`xp reveal ${DELAYS[i % 3]}`}>
              <span className="xn">{String(i + 1).padStart(2, '0')}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </Panel>
          ))}
        </div>
        <div className="sub">
          <Panel className="reveal">
            <h3 className="label">Senior HR skills</h3>
            <ul className="chips">
              {skills.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </Panel>
          <Panel className="reveal d1">
            <h3 className="label">Education &amp; languages</h3>
            <p className="flush">{education.degree}</p>
            <p className="langs">{education.languages}</p>
          </Panel>
        </div>
      </div>
    </section>
  )
}
