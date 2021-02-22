import React, { useState } from 'react'
import { Button, Collapse, Input, Row, Col, message } from 'antd'
import { decode, checkdata } from './zl-gprs-13'
import css from './gprs13.scss'
import Watch from '../../component/Watch'

const { TextArea } = Input
const { Panel } = Collapse

function ObjectPanel({ data }) {
  return Object.keys(data).map((m, i) => {
    const key = i
    if (typeof data[m] == 'object') {
      if (data[m].type == 'watch')
        return (
          <div key={key} className={css.line}>
            {`${m} : `}
            <Watch fn={data[m].fn} />
          </div>
        )
      return (
        <Collapse key={key} defaultActiveKey="0" className={css['content-container']}>
          <Panel header={m} key="0">
            <ObjectPanel data={data[m]} />
          </Panel>
        </Collapse>
      )
    }
    return <div key={key} className={css.line}>{`${m} : ${data[m]}`}</div>
  })
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
    const check = checkdata(inputValue)
    if (check) return message.warn(check, 2)
    const result = decode(inputValue)
    console.log(result)
    setconvertResult(result)
    message.success('解析成功', 1)
  }
  console.log('update ui')

  // 为什么用这种数据结构?
  // 为了方便取值, 希望能用 data[prop] 的方式取到所有属性的值
  // const test = {
  //   t1: { a: 1, b: 2 },
  //   t2: {
  //     c: 3,
  //     t3: { d: 4 },
  //     t4: { t5: { e: 4 } },
  //   },
  // }
  return (
    <>
      <TextArea onChange={handleTextAreaChange} value={inputValue} autoSize={{ minRows: 4, maxRows: 6 }} />
      <Row style={{ padding: '20px 0' }}>
        <Col span={24}>
          <Button type="primary" onClick={() => convert(inputValue)} style={{ float: 'left' }}>
            解析
          </Button>
        </Col>
      </Row>
      {/* {<ObjectPanel data={test} />} */}
      {<ObjectPanel data={convertResult} />}
    </>
  )
}
