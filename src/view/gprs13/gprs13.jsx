import React, { useState } from 'react'
import { Button, Collapse, Input, Row, Col, message } from 'antd'
import { decode, checkdata } from './zl-gprs-13'
import css from './gprs13.scss'
import Watch from '../../component/Watch'

const { TextArea } = Input
const { Panel } = Collapse

function Item({ prop, value, list }) {
  if (list)
    return (
      <Collapse defaultActiveKey={[prop]} className={css['content-container']}>
        <Panel header={prop} key={prop}>
          {list.map((m) => (
            <Item key={m.prop} prop={m.prop} value={m.value} list={m.list} />
          ))}
        </Panel>
      </Collapse>
    )
  return (
    <div className={css.line}>
      {prop}
      {' : '}
      {typeof value == 'object' && value.type == 'watch' ? <Watch fn={value.fn} init="解析中" err="解析失败"></Watch> : value}
    </div>
  )
}

export default function Gprs13() {
  const [inputValue, setinputValue] = useState(
    '5A4C1800000046015A012090361402002ED20209020E02200A2043762D302900B3DCA041000000335B760019FBD000000000001222353146412C32464245228A0D',
  )
  const [convertResult, setconvertResult] = useState([])

  const handleTextAreaChange = (e) => {
    setinputValue(e.target.value)
    convert(e.target.value)
  }

  const convert = (inputValue) => {
    setconvertResult([])
    const data = inputValue.replace(/\s/g, '').toLowerCase()
    const check = checkdata(data)
    if (check) return message.warn(check, 2)
    const result = decode(data)
    console.log(result)
    setconvertResult(result)
    message.success('解析成功', 1)
  }
  console.log('update ui')
  return (
    <>
      <TextArea onChange={handleTextAreaChange} value={inputValue} autoSize={{ minRows: 4, maxRows: 6 }} />
      <Row style={{ padding: '20px 0' }}>
        <Col span={24}>
          <Button type="primary" onClick={() => convert(inputValue)} style={{ float: 'left', width: '100%' }}>
            解析
          </Button>
        </Col>
      </Row>
      {convertResult.map((pv) => (
        <Item key={pv.prop} prop={pv.prop} value={pv.value} list={pv.list} />
      ))}
    </>
  )
}
