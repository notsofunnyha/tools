import { curry, prop } from 'ramda'

export { trace } from './trace.js'
export { Container } from './container.js'
export { Either, Left, Right, either, left } from './either.js'
export { IO } from './io.js'
export { Task } from './task.js'

import { Maybe } from './maybe.js'

export { Maybe }

// string -> object -> Maybe a
export const safeProp = curry((p, obj) => Maybe.of(prop(p, obj)))
