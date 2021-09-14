import { compose, chain, map } from 'ramda'
import { Task, either, eitherToTask } from '../../support'
import { fetchJson } from '../../support/fetch'
// import { url, address } from './amap'
import { url, address } from './baidu'

// {lng,lat} -> task string string
export const getPosition = compose(chain(eitherToTask), map(address), fetchJson, url)
