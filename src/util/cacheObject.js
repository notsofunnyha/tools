import { take } from 'ramda'

export const setCacheObj = (key, prop, val) => {
  let cache = JSON.parse(localStorage.getItem(key)) || {}
  if (Object.keys(cache) > 2000) {
    take(500, Object.keys(cache)).forEach((m) => {
      delete cache[m]
    })
  }
  cache[prop] = val
  localStorage.setItem(key, JSON.stringify(cache))
}

export const getCacheObj = (key, prop) => {
  try {
    let cache = JSON.parse(localStorage.getItem(key)) || {}
    if (cache[prop]) {
      console.log(`命中缓存: ${prop} ${cache[prop]}`)
      return cache[prop]
    }
  } catch (e) {
    console.error(e)
  }
  return null
}
