import { amap as key } from './key.conf'
import { Left, Right } from '../../support/fetch'
import { curry } from 'ramda'

// string -> string -> string
export const url = (lng, lat) => `https://restapi.amap.com/v3/geocode/regeo?key=${key}&location=${lng},${lat}`

// object -> Either string
export const address = curry(({ regeocode }) => {
  if (!regeocode) return new Left('调用高德地图api接口异常')
  return Right.of(regeocode.formatted_address)
})
