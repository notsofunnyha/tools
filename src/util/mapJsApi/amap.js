import { amap as key } from './key.conf'
import { fetchJson } from '../../support/fetch'
import { compose, curry, map } from 'ramda'
import { Task } from '../../support'

export function position(lng, lat) {
  if (!key) return Task.rejected('地理解析api密钥未配置, 请联系管理员')

  const url = () => `https://restapi.amap.com/v3/geocode/regeo?key=${key}&location=${lng},${lat}`
  const address = ({ regeocode }) => {
    if (!regeocode) return '调用高德地图api接口异常'
    return regeocode.formatted_address
  }
  return compose(map(curry(address)), fetchJson, url)()
}

// ========= 对比 =========

// export function position(lng, lat) {
//   if (!key) return Promise.resolve('地理解析api密钥未配置, 请联系管理员')

//   return new Promise((resolve, reject) => {
//     const url = `https://restapi.amap.com/v3/geocode/regeo?key=${key}&location=${lng},${lat}`
//     fetch(url)
//       .then((response) => response.json())
//       .then(function (json) {
//         console.log(json)
//         if (!json || !json.regeocode) return resolve('未能获取地址')
//         resolve(json.regeocode.formatted_address)
//       })
//       .catch(function (e) {
//         console.error(e)
//         reject(e)
//       })
//   })
// }
