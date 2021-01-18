import { curry } from 'ramda'

class Either {
  static of(x) {
    return new Right(x)
  }

  constructor(x) {
    this.$value = x
  }
}

class Left extends Either {
  get isLeft() {
    return true
  }

  get isRight() {
    return false
  }

  // eslint-disable-next-line no-unused-vars
  map(f) {
    return this
  }

  ap() {
    return this
  }
}

class Right extends Either {
  get isLeft() {
    return false
  }

  get isRight() {
    return true
  }

  map(f) {
    return Either.of(f(this.$value))
  }

  ap(otherEither) {
    return otherEither.map(this.$value)
  }
}

// (a -> c) -> (b -> c) -> Either a b -> c
const either = curry((f, g, e) => {
  switch (e.constructor) {
    case Left:
      return f(e.$value)
    case Right:
      return g(e.$value)
  }
})

// left :: a -> Either a b
const left = (a) => new Left(a)

export { Either, Left, Right, either, left }
