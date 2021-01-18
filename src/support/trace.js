import { curry } from 'ramda'

// string -> a -> a
export const trace = curry((msg, x) => {
  console.log(msg, x)
  return x
})
