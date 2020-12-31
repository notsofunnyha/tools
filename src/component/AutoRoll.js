import React, { useRef } from 'react'

export default function AutoRoll({ children }) {
  const ref1 = useRef(null)
  setTimeout(() => {
    const dd = ref1.current
    if (dd.scrollHeight - dd.scrollTop < dd.clientHeight + 200) dd.scrollTop = dd.scrollHeight
  }, 0)
  return (
    <div ref={ref1} style={{ height: '100%', overflowY: 'auto' }}>
      {children}
    </div>
  )
}
