import { makeContext } from "@twopm/furo";

export function increment(amount: number) {
  return { type: "inc", amount } as const;
}

export function decrement(amount: number) {
  return { type: "dec", amount } as const;
}

export function ping() {
  return { type: "ping" } as const;
}

export function pong() {
  return { type: "pong" } as const;
}

export function click() {
  return { type: "click" } as const;
}

export function fetchTrending(language: string) {
  return { type: "fetch-trending", language } as const;
}

export function retrievedTrending(repos: any[]) {
  return { type: "retrieved-trending", repos } as const;
}

export function mouseMoved(x: number, y: number) {
  return { type: "mouse-moved", x, y } as const;
}

export type Message =
  | ReturnType<typeof increment>
  | ReturnType<typeof decrement>
  | ReturnType<typeof ping>
  | ReturnType<typeof pong>
  | ReturnType<typeof click>
  | ReturnType<typeof fetchTrending>
  | ReturnType<typeof retrievedTrending>
  | ReturnType<typeof mouseMoved>;

export const MessageContext = makeContext<Message>();
