import { education, highlights, skills } from "../data/site";
import { Panel } from "./Panel";
import { SectionHead } from "./SectionHead";
import { RingCarousel } from "./ui/ring-carousel";

export function Highlights({ animate }) {
  return (
    <section className="block" id="highlights">
      <div className="wrap">
        <SectionHead index="03" caption="core expertise">
          High<span className="grad">lights</span>
        </SectionHead>
        <RingCarousel
          label="Highlights: drag, swipe or use the arrow keys to turn"
          items={highlights}
          animate={animate}
          renderItem={({ title, text }, i) => (
            <article className="glass-card">
              <span className="xn">{String(i + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          )}
        />
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
  );
}
