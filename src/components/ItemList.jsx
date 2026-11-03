export function ItemList({ items }) {
  return (
    <ul className="list">
      {items.map(({ title, detail }) => (
        <li key={title}>
          {title}
          {detail && <small>{detail}</small>}
        </li>
      ))}
    </ul>
  )
}
