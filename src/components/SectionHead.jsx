export function SectionHead({ index, caption, children }) {
  return (
    <div className="head reveal">
      <h2>{children}</h2>
      <span className="label">
        <b>{index}</b> / {caption}
      </span>
    </div>
  )
}
