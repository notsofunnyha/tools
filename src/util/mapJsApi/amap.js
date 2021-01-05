import { amap as key } from './key.conf'

export function getPosition(lng, lat) {
  if (!key) return Promise.resolve('地理解析api密钥未配置, 请联系管理员')

  return new Promise((resolve, reject) => {
    const url = `https://restapi.amap.com/v3/geocode/regeo?key=${key}&location=${lng},${lat}`
    fetch(url)
      .then((response) => {
        console.log(response)
        return response
      })
      .then((response) => response.json())
      .then(function (json) {
        console.log(json)
        if (!json || !json.regeocode) return resolve('未能获取地址')
        resolve(json.regeocode.formatted_address)
      })
      .catch(function (e) {
        console.error(e)
        reject(e)
      })
  })
}
