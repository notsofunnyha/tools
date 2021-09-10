import { curry, prop, identity as id } from 'ramda'
import { Either, Left, Right, either, left } from './either.js'
import { Task } from './Task.js'
import { Maybe } from './maybe.js'

export { Container } from './container.js'
export { trace } from './trace.js'
export { IO } from './io.js'

export { Maybe, Task, Either, Left, Right, either, left, id }

// string -> object -> Maybe a
export const safeProp = curry((p, obj) => Maybe.of(prop(p, obj)))

// liftA2 :: (Applicative f) => (a1 -> a2 -> b) -> f a1 -> f a2 -> f b
export const liftA2 = curry((fn, a1, a2) => a1.map(fn).ap(a2))
// liftA3 :: (Applicative f) => (a1 -> a2 -> a3 -> b) -> f a1 -> f a2 -> f a3 -> f b
export const liftA3 = curry((fn, a1, a2, a3) => a1.map(fn).ap(a2).ap(a3))

export const eitherToTask = either(Task.rejected, Task.of)
