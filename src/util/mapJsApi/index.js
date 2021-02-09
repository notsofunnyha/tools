import { Task, either } from '../../support'
import { fetchJson } from '../../support/fetch'
import { setCacheObj, getCacheObj } from '../cacheObject'
// import { url, address } from './amap'
import { url, address } from './baidu'

export function position(lng, lat) {
  return new Task((reject, resolve) => {
    const storageKey = 'lnglat_address'
    const precision = 4 // 4 位小数: 精度10米,  5 位小数: 精度1米
    const lnglat = `${(+lng).toFixed(precision)},${(+lat).toFixed(precision)}`
    const cache = getCacheObj(storageKey, lnglat)
    if (cache) resolve(cache)
    else
      fetchJson(url(lng, lat))
        .map(address)
        .fork(reject, (e) => {
          either(resolve, (m) => {
            resolve(m)
            setCacheObj(storageKey, lnglat, m)
          })(e)
        })
  })
}
