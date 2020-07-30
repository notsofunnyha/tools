import { fetch } from 'whatwg-fetch'

const amapKey = 'b8992733d4bd7dcff073ce4e2bd08d0d'

async function getPosition(lng, lat, timeout) {
  return new Promise((resolve, reject) => {
    try {
      const url = `https://restapi.amap.com/v3/geocode/regeo?key=${amapKey}&location=${lng},${lat}`
      fetch(url, { timeout, json: true })
        .then((response) => response.json())
        .then(function (json) {
          // console.log('parsed json', json, json.regeocode.formatted_address)
          
          if (json && json.regeocode) resolve(json.regeocode.formatted_address+"33333")
          else resolve(' ')
        })
        .catch(function (ex) {
          console.log('parsing failed', ex)
          reject(ex)
        })
    } catch (error) {
      console.error(error)
      reject(error)
    }
  })
}

export default {
  getPositions: async (lng, lat, tryTimes = 3, timeout = 3000) => {
    for (let i = 0; i < tryTimes; i += 1) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const result = await getPosition(lng, lat, timeout)
        return Promise.resolve(result)
      } catch (e) {
        console.log(e)
      }
    }
    return Promise.reject(Error())
  },
}
