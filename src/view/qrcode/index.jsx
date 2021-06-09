import React, { useState, useEffect } from 'react'
import QRCode from 'qrcode'
import { Input, message, Divider, List } from 'antd'

const { TextArea } = Input
const storageKey = 'qrcode_history'

export default function f() {
  const [inputValue, setinputValue] = useState('')
  const [src, setsrc] = useState('')
  const [listData, setlistData] = useState([])

  useEffect(() => {
    try {
      const history = localStorage.getItem(storageKey)
      history && setlistData(JSON.parse(history))
    } catch (error) {
      console.error(error)
    }
  }, [])

  useEffect(() => {
    if (!inputValue) {
      setsrc(null)
    } else {
      QRCode.toDataURL(inputValue, (err, url) => {
        if (err) return message.error(err.message)
        setsrc(url)
        const history = [{ content: inputValue, src: url }, ...listData].slice(0, 10)
        localStorage.setItem(storageKey, JSON.stringify(history))
        setlistData(history)
      })
    }
  }, [inputValue])

  return (
    <>
      <TextArea onChange={(e) => setinputValue(e.target.value)} value={inputValue} autoSize={{ minRows: 4, maxRows: 6 }} />
      <img src={src}></img>
      <Divider>历史记录</Divider>
      <List
        itemLayout="vertical"
        size="large"
        dataSource={listData}
        renderItem={(item) => (
          <List.Item key={item.title} extra={<img alt="logo" src={item.src} />}>
            <List.Item.Meta />
            {item.content}
          </List.Item>
        )}
      />
    </>
  )
}
