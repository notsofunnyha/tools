export class Container {
  constructor(x) {
    this.$value = x
  }

  static of(x) {
    return new Container(x)
  }

  map(f) {
    return Container.of(f(this.$value))
  }

  join() {
    return this.$value
  }

  chain(f) {
    return f(this.$value)
    // return this.map(f).join()
  }

  ap(anotherContainer) {
    return anotherContainer.map(this.$value)
  }

  ap2(other) {
    return this.chain(function (f) {
      return other.map(f)
    })
  }
}
