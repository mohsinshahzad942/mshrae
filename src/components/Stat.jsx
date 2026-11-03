import { useCountUp } from '../hooks/useCountUp'
import { Panel } from './Panel'

export function Stat({ count, suffix = '', value, label, delay, animate }) {
  const [ref, current] = useCountUp(count, { enabled: animate })
  return (
    <Panel className={`stat reveal ${delay}`}>
      <div className="num grad" ref={ref}>
        {count != null ? `${current}${suffix}` : value}
      </div>
      <p>{label}</p>
    </Panel>
  )
}
