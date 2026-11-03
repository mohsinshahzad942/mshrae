import { timeline } from '../data/site'
import { Panel } from './Panel'
import { SectionHead } from './SectionHead'

export function Experience() {
  return (
    <section className="block" id="experience">
      <div className="wrap">
        <SectionHead index="02" caption="career path">
          Experience
        </SectionHead>
        <ol className="timeline">
          {timeline.map(({ id, title, when, org, summary, duties }, i) => (
            <li key={id} className={`reveal ${i ? 'd1' : ''}`.trim()}>
              <Panel>
                <div className="row">
                  <h3>{title}</h3>
                  <span className="when">{when}</span>
                </div>
                <div className="org">{org}</div>
                <p>{summary}</p>
                {duties && (
                  <ul className="duties">
                    {duties.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                )}
              </Panel>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
