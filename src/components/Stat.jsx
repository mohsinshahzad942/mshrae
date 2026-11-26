import { Panel } from './Panel'
import { StatsCounter } from './ui/stats-counter'

export function Stat({ count, suffix = '', value, label, delay, animate }) {
  return (
    <Panel className={`stat reveal ${delay}`}>
      <div className="num grad">
        {count != null ? <StatsCounter value={count} suffix={suffix} enabled={animate} /> : value}
      </div>
      <p>{label}</p>
    </Panel>
  )
}
