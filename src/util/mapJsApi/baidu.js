import { baidu as key } from './key.conf'
import { compose, curry, take } from 'ramda'
import { Task } from '../../support'

const storageKey = 'baiduMap_lnglat'
/**
 * 4 位小数: 精度10米
 * 5 位小数: 精度1米
 */
const precision = 4
const latlng = (lat, lng) => +(+lat).toFixed(precision) + ',' + +(+lng).toFixed(precision)

const saveToStorageImpure = curry((lat, lng, address) => {
  try {
    let cache = JSON.parse(localStorage.getItem(storageKey)) || {}
    if (Object.keys(cache) > 2000) {
      take(500, Object.keys(cache)).forEach((m) => {
        delete cache[m]
      })
    }
    cache[latlng(lat, lng)] = address
    localStorage.setItem(storageKey, JSON.stringify(cache))
  } catch (e) {
    console.error(e)
  }
  return address
})

const getFromCacheImpure = curry((lat, lng) => {
  try {
    let cache = JSON.parse(localStorage.getItem(storageKey)) || {}
    const key = latlng(lat, lng)
    if (cache[key]) {
      // console.log(`命中缓存: ${key} ${cache[key]}`)
      return cache[key]
    } else {
      return null
    }
  } catch (e) {
    console.error(e)
  }
  return null
})

export function position(lng, lat) {
  if (!key) return Task.rejected('地理解析api密钥未配置, 请联系管理员')

  const url = () => `http://api.map.baidu.com/reverse_geocoding/v3/?ak=${key}&output=json&coordtype=wgs84ll&location=${latlng(lat, lng)}`

  const address = curry(({ status, result }) => {
    if (status != 0) return '调用百度地图api接口异常'
    const address = result.formatted_address + result.addressComponent.direction + result.addressComponent.distance
    saveToStorageImpure(lat, lng, address)
    return address
  })

  return new Task((reject, resolve) => {
    const cache = getFromCacheImpure(lat, lng)
    if (cache) {
      resolve(cache)
    } else {
      fetch(url())
        .then((res) => res.json())
        .then(compose(resolve, address))
        .catch(reject)
    }
  })
}
