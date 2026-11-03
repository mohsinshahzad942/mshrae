export function ChipList({ items, label }) {
  return (
    <ul className="chips" aria-label={label}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}
