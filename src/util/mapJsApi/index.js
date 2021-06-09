import { Task, either } from '../../support'
import { fetchJson } from '../../support/fetch'
import { setCacheObjLimit1000, cacheObjProp } from '../localStorage/cacheObject'
// import { url, address } from './amap'
import { url, address } from './baidu'

const showHit = (...a) => console.log('命中缓存:', ...a)

export function position(lng, lat) {
  return new Task((reject, resolve) => {
    const storageKey = 'lnglat_address'
    const precision = 4 // 4 位小数: 精度10米,  5 位小数: 精度1米
    const lnglat = `${(+lng).toFixed(precision)},${(+lat).toFixed(precision)}`
    const cache = cacheObjProp(storageKey, lnglat).unsafePerformIO()
    // console.log(cache)
    if (cache) {
      showHit(lnglat, cache)
      resolve(cache)
    } else
      fetchJson(url(lng, lat))
        .map(address)
        .fork(reject, (e) => {
          either(resolve, (m) => {
            resolve(m)
            setCacheObjLimit1000(storageKey, lnglat, m).unsafePerformIO()
          })(e)
        })
  })
}
