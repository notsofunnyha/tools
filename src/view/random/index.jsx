import React, { useState } from 'react'
import { Divider, Button, Row, Col } from 'antd'
import { v4 as uuidv4 } from 'uuid'
// eslint-disable-next-line no-unused-vars
import css from './index.scss'

export default function f() {
  const [uuid4, setUuid4] = useState('')
  const [rand, setRand] = useState('')

  const getRandom = () => {
    setUuid4(uuidv4())

    setRand((+new Date()).toString() + Math.random().toString().slice(2, 5))
  }

  return (
    <>
      <Button type="primary" onClick={getRandom}>
        生成
      </Button>
      <Row style={{ padding: '20px 0' }}>
        <Col span={24}>
          uuidv4:<Divider></Divider>
          {uuid4} <br />
          {uuid4.replace(/-/g, '')}
        </Col>
      </Row>
      <Row style={{ padding: '20px 0' }}>
        <Col span={24}>
          时间戳+3位随机数:<Divider></Divider>
          {rand}
        </Col>
      </Row>
    </>
  )
}
