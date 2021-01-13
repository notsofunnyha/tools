/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
// https://serialport.io/docs/guide-installation#electron
import SerialPort from 'serialport'
import { Card, Row, Col, Checkbox, Button, Select, Form, InputNumber, message } from 'antd'
import { takeLast } from 'ramda'
import dayjs from 'dayjs'
import css from './index.scss'
import AutoRoll from '../../component/AutoRoll'
import decoders from './decoder/index'

const { Option } = Select

async function getPort(name, baudRate) {
  return new Promise((s, j) => {
    let port = new SerialPort(name, baudRate, (e) => {
      if (e) j(e)
      else s(port)
    })
  })
}

function Settings({ port, onPortSwitch, ocPortName, ocBaudRate, ocDecoder, initialValues }) {
  const [portList, setPortList] = useState([])

  const getPortList = async () => {
    // console.log(await SerialPort.list())
    setPortList((await SerialPort.list()).map((m) => m.path))
  }

  useEffect(() => {
    getPortList()
  }, [])

  return (
    <Form
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      name="basic"
      initialValues={initialValues}
    >
      <Form.Item label="串口名称" name="serialName" rules={[{ required: true, message: 'Required!' }]}>
        <Select onClick={getPortList} onChange={ocPortName}>
          {portList &&
            portList.map((m, i) => (
              <Option key={i} value={m}>
                {m}
              </Option>
            ))}
        </Select>
      </Form.Item>
      <Form.Item label="波特率" name="baudRate" rules={[{ required: true }]}>
        <InputNumber style={{ width: '100%' }} onChange={ocBaudRate} />
      </Form.Item>
      <Form.Item label="解码器" name="decoder" rules={[{ required: true, message: 'Required!' }]}>
        <Select onChange={ocDecoder}>
          {decoders.map((m) => (
            <Option key={m.value} value={m.value}>
              {m.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" onClick={onPortSwitch}>
          {port && port.isOpen ? '关闭串口' : '开启串口'}
        </Button>
      </Form.Item>
    </Form>
  )
}

// 缓存串口接收到的数据
let msgCache = []

export default function Serial() {
  const [portName, setPortName] = useState(null)
  const [baudRate, setBaudRate] = useState(null)
  const [port, setPort] = useState(null)
  const [msgs, setMsgs] = useState([])
  // const [spanLimit, setSpanLimit] = useState(50) // 毫秒, 串口接收到的数据, 超时间间隔判定不是同一条消息
  const spanLimit = 50
  const [showHex, setShowHex] = useState(false)
  const [decoder, setDecoder] = useState(null)
  console.log(showHex)
  const initialValues = {
    baudRate: 9600,
    decoder: decoders[0].value,
  }

  const newPort = async (portName, baudRate) => {
    console.log(portName, baudRate)
    if (!portName || !baudRate) return
    if (port) setPort(null)
    try {
      let port = await getPort(portName, baudRate)
      port.on('data', function (data) {
        // console.log('Data:', data, msgCache, msgs)
        msgCache.push({ date: +new Date(), data })
      })
      setPort(port)
      message.success('port opened')
      console.log(port)
    } catch (e) {
      console.error(e)
      message.error(e.message)
    }
  }

  const ocPortName = (e) => {
    setPortName(e)
  }
  const ocBaudRate = (e) => {
    if (port) port.update({ baudRate: e })
    setBaudRate(e)
  }

  const handlePortSwitch = () => {
    console.log(port)
    if (!port) return newPort(portName, baudRate)
    if (port.isOpen)
      port.close((e) => {
        if (e) return message.error(e)
        setPort(null)
        message.success('port closed')
      })
    else
      port.open((e) => {
        if (e) return message.error(e)
        message.success('port opened')
      })
  }

  useEffect(() => {
    setBaudRate(initialValues.baudRate)
    setDecoder(initialValues.decoder)
  }, [])

  useEffect(() => {
    console.log('加载此effect')
    if (port && port.isOpen) {
      port.close((e) => {
        if (e) message.error(e.message)
        console.log('close')
        newPort(portName, baudRate)
      })
    } else {
      newPort(portName, baudRate)
    }
  }, [portName])

  useEffect(() => {
    const setMsg = function (datas) {
      // console.log(datas)
      const date = datas[0].date
      const data = datas.map((m) => m.data).join('')
      const decode = decoders.find((m) => m.value === decoder).decoder(data) //
      setMsgs((msgs) => [...msgs, { date, data, decode }])
    }

    const timer = setInterval(() => {
      // console.log([...msgCache])
      // 队列只有一条数据且年代久远; # 不用考虑只有一条数据, 且数据"较新"的情况, 因为几个循环后这条数据就不新了
      if (msgCache.length === 1 && +new Date() - msgCache[0].date > spanLimit) {
        const one = msgCache.shift()
        setMsg([one])
      } else {
        // 队列有多条数据, 从第一条往后找, 直到下一条数据时间间隔较大
        // 若已到最后队尾, 判断队尾是否年代久远, 不是则等待下一次循环
        let temp = []
        while (msgCache.length) {
          temp.push(msgCache.shift())
          if (!msgCache.length) {
            if (+new Date() - temp[temp.length - 1].date > spanLimit) {
              setMsg(temp)
            } else {
              msgCache = [...temp]
              break
            }
          } else if (msgCache[0].date - temp[temp.length - 1].date > spanLimit) {
            setMsg(temp)
            temp = []
          }
        }
      }
    }, 800)
    return () => {
      clearInterval(timer)
    }
  }, [decoder])

  useEffect(() => {
    return () => {
      port && port.isOpen && port.close()
    }
  }, [port])

  // 消息达到一定数量后, 清除部分最先的消息
  if (msgs.length > 100) {
    setMsgs(takeLast(80, msgs))
  }

  console.log(port, msgs)
  return (
    <>
      {/* 100% - bottom - padding - top border */}
      <Row gutter={[16, 16]} style={{ height: 'calc(100% - 224px)' }}>
        <Col span={24} style={{ height: '100%' }}>
          <Card
            style={{ height: '100%' }}
            bodyStyle={{ height: 'calc(100% - 57px)', padding: '4px 0 0 10px' }}
            title=""
            extra={
              <>
                <Checkbox
                  onChange={(e) => {
                    setShowHex(e.target.checked)
                  }}
                >
                  HEX显示
                </Checkbox>
                <Button type="link" onClick={() => setMsgs([])} style={{ height: 'unset', padding: '0 0 0 10px' }}>
                  清空
                </Button>
              </>
            }
          >
            <AutoRoll>
              {msgs.map((m, i) => (
                <Row key={i} className={css.row}>
                  <Col span={12}>
                    <div className={css.item}>
                      {dayjs(m.date).format('HH:mm:ss')} :{showHex ? m.data.toString('hex') : m.data.toString()}
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className={css.item}>{m.decode}</div>
                  </Col>
                </Row>
              ))}
            </AutoRoll>
          </Card>
        </Col>
      </Row>
      <Row style={{ height: '224px' }}>
        <Col span={12}>
          <Settings
            port={port}
            onPortSwitch={handlePortSwitch}
            ocPortName={ocPortName}
            ocBaudRate={ocBaudRate}
            ocDecoder={setDecoder}
            initialValues={initialValues}
          />
        </Col>
      </Row>
    </>
  )
}
