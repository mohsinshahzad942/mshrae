function Bullets({ items }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

export function JobCard({ when, role, org, highlights, more }) {
  return (
    <article className="job">
      <p className="when">{when}</p>
      <div>
        <h3>{role}</h3>
        <p className="org">{org}</p>
        <Bullets items={highlights} />
        {more?.length > 0 && (
          <details>
            <summary>More responsibilities</summary>
            <Bullets items={more} />
          </details>
        )}
      </div>
    </article>
  )
}
