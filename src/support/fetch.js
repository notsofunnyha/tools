import { curry } from 'ramda'
import { Task } from './index'

// func -> string -> Task string object
const httpFetch = curry(
  (fn, url) =>
    new Task((reject, resolve) =>
      fetch(url)
        .then(fn)
        .then(resolve)
        .catch((e) => reject(e ? e.message : 'network error')),
    ),
)

// string -> Task string string
export const fetchText = httpFetch((res) => res.text())

// string -> Task string json
export const fetchJson = httpFetch((res) => res.json())
