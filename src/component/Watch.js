import React, { useState, useEffect } from 'react'
import WatingText from './WatingText'

export default function Watch({ fn, init, err }) {
  const [res, setRes] = useState(null)
  //   console.log({ fn, init, err })
  console.log('watch ui')
  useEffect(() => {
    fn()
      .then((m) => setRes(m))
      .catch((e) => setRes(err || e.message))
  })
  //   console.log(fn)
  return res ? res : <WatingText text={init} />
}
