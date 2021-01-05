import React, { useState, useEffect } from 'react'
import WatingText from './WatingText'

/**
 * 局部异步更新
 *
 * 名字:
 * watch 译为等待, 意思是此处内容正在加载, 加载完成后显示
 *
 * 用例:
 * 在协议解析中, 一般信息直接显示, 地理位置异步请求, 不阻塞其它信息展示
 *
 * 注意:
 * 1.对于父组件来讲: 当父组件更新时, 此组件应该更新, 放弃上次异步操作结果, 重新执行异步操作 (即:副作用须在每次render时执行)
 * 2.基于第1点, 此组件的副作用不能添加任何参数, 但不添加参数会导致状态更新时副作用会再次执行, 这是多余的, 甚至错误的
 * 3.所以: 直接写一个组件无法做到, 需要包裹一个组件
 *
 */
export default function Watch({ fn, init = '加载中', err = '加载失败' }) {
  console.log('Watch ui')
  return <WatchContent key={+new Date() + Math.random().toFixed(3)} fn={fn} init={init} err={err} />
}

function WatchContent({ fn, init, err }) {
  console.log('WatchContent ui')
  const [res, setRes] = useState(null)
  const [status, setStatus] = useState('pendding')
  useEffect(() => {
    console.log('WatchContent effect')
    fn()
      .then((m) => {
        setStatus('resolve')
        setRes(m)
      })
      .catch((e) => {
        setStatus('reject')
        setRes(e.message)
      })
    return () => {
      console.log('WatchContent unload')
    }
  }, [])
  if (status == 'pendding') return <WatingText text={init} />
  if (status == 'resolve') return res
  if (status == 'reject') return err || res
  return ''
}
