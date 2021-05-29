import { Context, useEffect, useState } from 'react'
import { Event, useEvents, Bus } from './index'

function stripMeta(ev: any) {
  const copy = { ...ev }

  delete copy._meta
  delete copy.type

  return copy
}
const RenderEvent = ({ event }: { event: Event }) => {
  return (
    <li>
      <code>
        <strong>{event.type}</strong>::<em>{event._meta?.id}</em>
      </code>{' '}
      <br />
      <code>{JSON.stringify(stripMeta(event))}</code>
      {event._meta?.children && (
        <ul>
          {event._meta?.children.map(c => (
            <RenderEvent key={c._meta?.id} event={c} />
          ))}
        </ul>
      )}
    </li>
  )
}
export const HistoryDebugger = ({
  context,
  pollingFrequencyMs = 100,
}: {
  context: Context<Bus<any>>
  pollingFrequencyMs?: number
}) => {
  const [state, setState] = useState(false)
  const {
    _debug: { history, clearHistory },
  } = useEvents(context)

  // Force this to rerender every 100ms
  // Ensures new events are rendered since we mutably update event.children
  useEffect(() => {
    const i = setInterval(() => setState(!state), pollingFrequencyMs)
    return () => clearInterval(i)
  }, [state, pollingFrequencyMs, setState])

  return (
    <div>
      <button onClick={clearHistory}>clear history</button>
      <ul>
        {history.map(ev => (
          <RenderEvent key={ev._meta.id} event={ev} />
        ))}
      </ul>
    </div>
  )
}
