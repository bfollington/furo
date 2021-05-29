import { useEvents } from '@twopm/furo'
import React, { useState } from 'react'
import {
  click,
  fetchTrending,
  increment,
  Message,
  MessageContext,
  retrievedTrending,
} from './messages'

export default function App() {
  const [lang, setLang] = useState('clojure')
  const [count, setCount] = useState(0)
  // This is the ROOT dispatch, starts a chain of events
  const { dispatch, useSubscribe } = useEvents<Message>(MessageContext)

  // This is a local dispatch, using it will track the dependencies
  useSubscribe('click', (_, dispatch) => {
    dispatch(increment(1))
    dispatch(fetchTrending(lang))
  })

  useSubscribe('inc', (ev) => {
    if (ev.type !== 'inc') return

    setCount(count + ev.amount)
  })

  useSubscribe('fetch-trending', async (ev, dispatch) => {
    if (ev.type !== 'fetch-trending') return

    const res = await fetch(
      `https://api.github.com/search/repositories?q=language:${ev.language}&sort=stars&order=desc`
    ).then((res) => res.json())

    dispatch(retrievedTrending(res.items.map((item: any) => item.full_name)))
  })

  return (
    <div className="App">
      <h1>useEvents demo</h1>
      <select value={lang} onChange={(ev) => setLang(ev.target.value)}>
        <option>clojure</option>
        <option>haskell</option>
        <option>elixir</option>
      </select>
      <button onClick={() => dispatch(click())}>fetch trending (clicked: {count} times)</button>
    </div>
  )
}
