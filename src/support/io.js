import { compose } from 'ramda'

export class IO {
  constructor(f) {
    this.unsafePerformIO = f
  }

  static of(x) {
    return new IO(() => x)
  }

  map(f) {
    return new IO(compose(f, this.unsafePerformIO))
  }

  join() {
    console.log('!!! find me !!!')
    return this.unsafePerformIO()
  }

  // what's difference

  // join() {
  //   console.log('!!! find me !!!')
  //   return new IO(() => this.unsafePerformIO().unsafePerformIO())
  // }

  chain(f) {
    return this.map(f).join()
  }

  // ap(otherIO) {
  //   return otherIO.map(this.unsafePerformIO)
  // }

  ap(f) {
    return this.chain((fn) => f.map(fn))
  }

  // ap(f) {
  //   return this.map(fn => f.map(fn)).join()
  // }
}
