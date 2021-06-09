import { curry } from 'ramda'
import { Either, left } from '../support'

// string -> either(string, obj)
export const parseJson = curry((s) => {
  try {
    return Either.of(JSON.parse(s))
  } catch (e) {
    console.error(e)
    return left(e.message)
  }
})
