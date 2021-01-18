import { curry } from 'ramda'
import { Task } from './index'

// func -> string -> Task
const httpFetch = curry((fn, url) => new Task((reject, resolve) => fetch(url).then(fn).then(resolve).catch(reject)))

// string -> Task string error
export const fetchText = httpFetch((res) => res.text())

// string -> Task json error
export const fetchJson = httpFetch((res) => res.json())
