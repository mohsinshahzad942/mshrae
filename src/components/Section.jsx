/** Two-column section: title in the left gutter, content on the right. */
export function Section({ id, title, children }) {
  const headingId = `${id}-heading`
  return (
    <section id={id} aria-labelledby={headingId}>
      <div className="wrap sec">
        <h2 id={headingId}>{title}</h2>
        {children}
      </div>
    </section>
  )
}
