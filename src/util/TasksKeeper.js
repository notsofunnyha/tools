/**
 * 当有一堆异步任务需要执行
 * 但是需要依次执行, 每次执行一个
 *
 * 例如:
 * 有1000个待执行的位置解析请求, 每次只请求一个, 按顺序执行
 */

export default class TasksKeeper {
  constructor({ tasks, resolve, reject, done }) {
    this.tasks = tasks
    this.resolve = resolve
    this.reject = reject
    this.done = done
    //
    this.stoped = false
    this.complete = false
    this.count = 0
  }

  static of(x) {
    return new TasksKeeper(x)
  }

  start() {
    this.stoped = false
    const _ = this
    function fn() {
      if (_.stoped) return
      if (_.count >= _.tasks.length) {
        _.stoped = true
        _.complete = true
        return _.done()
      }
      _.tasks[_.count].fork(
        (e) => {
          if (_.stoped) return
          _.reject(e, _.count++)
          fn()
        },
        (s) => {
          if (_.stoped) return
          _.resolve(s, _.count++)
          fn()
        },
      )
    }
    fn()
  }

  pause() {
    this.stop()
  }

  stop() {
    console.log('stoped')
    this.stoped = true
  }
}

// ==== 以下为测试代码 ====

// import { curry } from 'ramda'
// import { Task } from './support/index.js'

// /**测试用模拟fetch */
// const fakeFetch = curry(
//   (url) =>
//     new Task((reject, resolve) => {
//       setTimeout(() => {
//         const random = Math.random()
//         if (random > 0.3) resolve(random)
//         else reject(random)
//       }, 1000)
//     }),
// )

// const tasks = [fakeFetch('url'), fakeFetch('url'), fakeFetch('url'), fakeFetch('url'), fakeFetch('url')]
// const result = tasks.map((m) => null)

// const tasksKeeper = TasksKeeper.of({
//   tasks,
//   resolve: (s, tag) => {
//     result[tag] = s
//     console.log(tag, s)
//   },
//   reject: (s, tag) => {
//     result[tag] = s
//     console.log(tag, s)
//   },
//   done: () => console.log('done.'),
// })

// tasksKeeper.start()

// setTimeout(() => {
//   tasksKeeper.stop()
//   console.log(tasksKeeper)
// }, 2500)

// setTimeout(() => {
//   tasksKeeper.start()
//   console.log(tasksKeeper)
// }, 8000)

// setTimeout(() => {
//   tasksKeeper.start()
//   console.log(tasksKeeper)
// }, 12000)
