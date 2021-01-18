export class Maybe {
  constructor(x) {
    this.$value = x
  }

  static of(x) {
    return new Maybe(x)
  }

  get isNothing() {
    return this.$value === null || this.$value === undefined
  }

  map(f) {
    return this.isNothing ? this : Maybe.of(f(this.$value))
  }

  join() {
    return this.isNothing ? this : this.$value
  }

  chain(f) {
    return this.map(f).join()
  }

  ap(otherMaybe) {
    return otherMaybe.map(this.$value)
  }
}
