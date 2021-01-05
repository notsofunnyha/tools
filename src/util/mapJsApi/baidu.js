import { baidu as key } from './key.conf'

export function position(lng, lat) {
  if (!key) return Promise.resolve('地理解析api密钥未配置, 请联系管理员')

  const fecthPromise = new Promise((resolve, reject) => {
    const url = `http://api.map.baidu.com/reverse_geocoding/v3/?ak=${key}&output=json&coordtype=wgs84ll&location=${lat},${lng}`
    fetch(url)
      .then((response) => {
        console.log(response)
        return response
      })
      .then((response) => response.json())
      .then(function (json) {
        console.log(json)
        if (!json || json.status != 0) return resolve('未能获取地址')
        const { result } = json
        resolve(result.formatted_address + result.addressComponent.direction + result.addressComponent.distance)
      })
      .catch(function (e) {
        console.error(e)
        reject(e)
      })
  })
  return fecthPromise
  // const timeoutPromise = new Promise((s, j) => {
  //   setTimeout(() => {
  //     j('超时')
  //   }, 5000)
  // })
  // return Promise.race([fecthPromise, timeoutPromise])
}
