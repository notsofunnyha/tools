import { baidu as key } from './key.conf'
import { fetchJson } from '../../support/fetch'
import { compose, curry, map } from 'ramda'
import { Task } from '../../support'

export function position(lng, lat) {
  if (!key) return Task.rejected('地理解析api密钥未配置, 请联系管理员')
  
  const url = () => `http://api.map.baidu.com/reverse_geocoding/v3/?ak=${key}&output=json&coordtype=wgs84ll&location=${lat},${lng}`
  const address = ({ status, result }) => {
    if (status != 0) return '调用百度地图api接口异常'
    return result.formatted_address + result.addressComponent.direction + result.addressComponent.distance
  }
  return compose(map(curry(address)), fetchJson, url)()
}
