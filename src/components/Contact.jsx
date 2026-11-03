import { contactIntro, profile } from '../data/profile'
import { ExternalLink } from './ExternalLink'

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-heading">
      <div className="wrap">
        <div className="contact">
          <h2 id="contact-heading">Let’s talk</h2>
          <p className="contact-intro">{contactIntro}</p>
          <dl>
            <dt>Email</dt>
            <dd>
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
            </dd>
            <dt>LinkedIn</dt>
            <dd>
              <ExternalLink href={profile.linkedin}>{profile.linkedinLabel}</ExternalLink>
            </dd>
            <dt>Location</dt>
            <dd>{profile.location}</dd>
          </dl>
        </div>
      </div>
    </section>
  )
}
