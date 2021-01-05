import React, { useState, useEffect } from 'react'

/**
 * 仅仅是文字动画而已
 */
export default function WatingText({ text = '加载中' }) {
  const symbol = ' ·'
  const [dots, setdots] = useState(symbol)
  useEffect(() => {
    const id = setInterval(() => {
      setdots((pre) => (pre.length > 4 ? '' : pre + symbol))
    }, 300)
    return () => clearInterval(id)
  }, [])
  //   console.log(fn)
  return text + dots
}
