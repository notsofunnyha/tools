import { compose, curry, map, prop } from 'ramda'
import { either, id, IO } from '../../support'
import { parseJson } from '../json'

const ioStorage = IO.of(localStorage)

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

// setConfObj 帮助函数
// string -> string -> obj -> _
export const setConf = curry((k, p, v) => setConfObj(k, p, v).unsafePerformIO())
