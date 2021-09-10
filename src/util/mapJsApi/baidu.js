import { baidu as key } from './key.conf'
import { curry } from 'ramda'
import { Left, Right } from '../../support'

// string -> string -> string
export const url = ({ lng, lat }) => `http://api.map.baidu.com/reverse_geocoding/v3/?ak=${key}&output=json&coordtype=wgs84ll&location=${lat},${lng}`

// object -> Either string
export const address = curry(({ status, result }) => {
  if (status != 0) return new Left('调用百度地图api接口异常')
  return Right.of(result.formatted_address + result.addressComponent.direction + result.addressComponent.distance)
})
