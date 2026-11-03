import { useRef } from 'react'
import { contact, profile } from '../data/site'
import { CopyButton } from './CopyButton'
import { Panel } from './Panel'

function Line({ label, children }) {
  return (
    <div>
      <span className="label">{label}</span>
      {children}
    </div>
  )
}

export function Contact() {
  const emailRef = useRef(null)
  const phoneRef = useRef(null)

  return (
    <section className="block contact" id="contact">
      <div className="wrap">
        <Panel className="reveal">
          <span className="label">
            <b>04</b> / contact
          </span>
          <h2>
            Let’s <span className="grad">talk.</span>
          </h2>
          <p>{contact.intro}</p>
          <div className="lines">
            <Line label="LinkedIn">
              <span className="v">
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                  {profile.linkedinLabel}
                </a>
              </span>
            </Line>
            <Line label="Email">
              <span className="v" ref={emailRef}>
                <a href={`mailto:${profile.email}`}>{profile.email}</a>
              </span>
              <CopyButton value={profile.email} targetRef={emailRef} label="email" />
            </Line>
            <Line label="Phone">
              <span className="v" ref={phoneRef}>
                <a href={`tel:${profile.phone.replace(/\s/g, '')}`}>{profile.phone}</a>
              </span>
              <CopyButton value={profile.phone} targetRef={phoneRef} label="phone number" />
            </Line>
            <Line label="WhatsApp">
              <span className="v">
                <a href={profile.whatsapp} target="_blank" rel="noopener noreferrer">
                  Chat on WhatsApp ↗
                </a>
              </span>
            </Line>
            <Line label="Location">
              <span className="v">{profile.shortLocation}</span>
            </Line>
          </div>
          <a className="btn primary" href={profile.linkedin} target="_blank" rel="noopener noreferrer">
            Message me on LinkedIn ↗
          </a>
        </Panel>
      </div>
    </section>
  )
}
