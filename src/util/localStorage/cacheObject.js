import { compose, curry, map, prop } from 'ramda'
import { either, id, IO } from '../../support'
import { parseJson } from '../json'

const ioStorage = IO.of(localStorage)

// "高速缓存", 用来缓存类似网络请求的结果, key上线1000
// string -> string -> obj -> IO(_)
export const setCacheObjLimit1000 = (storageKey, objKey, val) =>
  map(
    compose(
      (cache) => {
        cache[objKey] = val
        localStorage.setItem(storageKey, JSON.stringify(cache))
      },
      (cache) => {
        if (Object.keys(cache) > 1000) {
          delete cache[Object.keys(cache)[0]]
          delete cache[Object.keys(cache)[0]]
        }
        return cache
      },
      either(() => ({}), id),
    ),
    cacheObj(storageKey),
  )

// 缓存"配置", 用于应用恢复上次的状态, key不设限
// string -> string -> obj -> IO(_)
export const setConfObj = (storageKey, objKey, val) =>
  map(
    compose(
      (cache) => {
        cache[objKey] = val
        localStorage.setItem(storageKey, JSON.stringify(cache))
      },
      either(() => ({}), id),
    ),
    cacheObj(storageKey),
  )

// string -> IO(Either)
export const cacheObj = curry((storageKey) => map(compose(parseJson, prop(storageKey)), ioStorage))

// string -> string -> IO
// export const cacheObjProp = curry((key, key2) => IO.of(either(() => null, prop(key2))).ap(cacheObj(key)))
export const cacheObjProp = curry((storageKey, objKey) => cacheObj(storageKey).map(either(() => null, prop(objKey))))

// setConfObj 帮助函数
// string -> string -> obj -> _
export const setConf = curry((k, p, v) => setConfObj(k, p, v).unsafePerformIO())
