import { useEffect, useCallback, createContext, Context, useContext } from 'react'

export interface Event {
  type: string

  _meta?: {
    id: number
    children: Event[]
  }
}
type Listener<TEvent extends Event> = (event: TEvent, dis: Dispatch<TEvent>) => void
type Listeners<TEvent extends Event> = {
  [id in TEvent['type']]: Listener<TEvent>[]
}
type Subscribe<TEvent extends Event> = (
  event: TEvent['type'],
  listener: Listener<TEvent>
) => () => void
type Dispatch<TEvent extends Event> = (event: TEvent) => void

export interface Bus<TEvent extends Event> {
  subscribe: Subscribe<TEvent>
  dispatch: Dispatch<TEvent>
  _debug: {
    history: TEvent[]
    clearHistory: () => void
  }
}

let id = 0
function genId() {
  id++
  return id
}

const MAX_DISPATCHES = 1500

export function createBus<TEvent extends Event>(
  debug: boolean = false,
  detectInfiniteLoop: boolean = true
): Bus<TEvent> {
  const listeners = {} as Listeners<TEvent>
  let history: TEvent[] = []
  let dispatchDepth = 0
  let hasFaulted = false

  const clearHistory = () => {
    history.length = 0
  }

  function dispatch(event: TEvent, parent?: TEvent) {
    dispatchDepth++

    // keep a mutable count of how many dispatches "deep" we currently are
    if (detectInfiniteLoop && !hasFaulted && dispatchDepth > MAX_DISPATCHES) {
      console.error(
        `furo encountered over ${MAX_DISPATCHES} nested dispatch calls and cancelled this dispatch. You probably didn't mean to do this and have an infinite loop, however, if this was intentional, you can disable this check by passing detectInfiniteLoop = false to createBus().`
      )
      console.error(`the event that triggered this error was`, event)
      hasFaulted = true
    }

    if (hasFaulted) {
      dispatchDepth--
      return
    }

    event._meta = event._meta || {
      id: genId(),
      children: [],
    }

    if (parent) {
      parent._meta?.children.push(event)
    }

    // Only log root events
    if (debug && !parent) {
      history.push(event)
    }

    if (listeners[event.type]) {
      listeners[event.type].forEach((listener: Listener<TEvent>) =>
        // Inject an optional local dispatch funciton as the second parameter
        // if a listener calls this, we can track the depedency chain as an event propagates
        listener(event, (ev: TEvent) => dispatch(ev, event))
      )
    }
    dispatchDepth--
  }

  return {
    subscribe: (event: TEvent['type'], listener: Listener<TEvent>) => {
      if (!listeners[event]) {
        listeners[event] = []
      }

      listeners[event].push(listener)

      return () => {
        const idx = listeners[event].indexOf(listener)
        if (idx > -1) {
          listeners[event].splice(idx, 1)
        }
      }
    },
    dispatch,
    _debug: {
      history,
      clearHistory,
    },
  }
}

export function makeContext<TEvent extends Event>() {
  return createContext<Bus<TEvent>>(null as unknown as Bus<TEvent>) // Lord, forgive me
}

export function useRootSubscribe<TEvent extends Event>(
  subscribe: Subscribe<TEvent>,
  event: TEvent['type'],
  listener: Listener<TEvent>
) {
  useEffect(() => {
    return subscribe(event, listener)
  }, [subscribe, listener, event])
}

export function useEvents<TEvent extends Event>(ctx: Context<Bus<TEvent>>) {
  const { subscribe, dispatch: localDispatch, _debug } = useContext(ctx)

  const useSubscribe = (event: TEvent['type'], listener: Listener<TEvent>) =>
    useRootSubscribe(subscribe, event, listener)

  const dispatch: Dispatch<TEvent> = useCallback(
    (ev: TEvent) => {
      localDispatch(ev)
    },
    [localDispatch]
  )

  return { subscribe, dispatch, useSubscribe, _debug }
}
