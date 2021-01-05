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
 */
export default function Watch({ fn, init, err }) {
  const [res, setRes] = useState(null)
  //   console.log({ fn, init, err })
  console.log('watch ui')
  useEffect(() => {
    fn()
      .then((m) => setRes(m))
      .catch((e) => setRes(err || e.message))
  }, [])
  //   console.log(fn)
  return res ? res : <WatingText text={init} />
}
