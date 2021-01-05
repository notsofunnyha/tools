/**
 * 对于网络请求这种可能失败的情况, 重试几次
 */
export const tryN = (n = 3, fn) => async (...rest) => {
  for (let i = 0; i < n; i++) {
    console.log('try', i + 1)
    try {
      const res = await fn(...rest)
      return Promise.resolve(res)
    } catch (e) {
      //   console.error(e)
    }
  }
  return Promise.reject(Error())
}

// console.log(
//   await tryN(
//     5,
//     (text) =>
//       new Promise((s, j) => {
//         setTimeout(() => {
//           const random = Math.random()
//           random > 0.7 ? s(text + ' ' + random) : j()
//         }, 1000)
//       }),
//   )('haha'),
// )
