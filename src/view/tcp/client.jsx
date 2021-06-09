/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { Divider, Button, Row, Col, Card, Form, Input, InputNumber, Select, message, Checkbox } from 'antd'
// eslint-disable-next-line no-unused-vars
import css from './client.scss'
import * as net from 'net'
import { Buffer } from 'buffer'
import dayjs from 'dayjs'
import { either, id, safeProp } from '../../support'
import { cacheObj, setConfObj, setConf } from '../../util/localStorage/cacheObject'
import { splitEvery } from 'ramda'
import AutoRoll from '../../component/AutoRoll'

const { TextArea } = Input

const cacheKey = 'tcp_client_conf'
const cache = setConf(cacheKey)

export default function Xa() {
  return (
    <>
      <TcpClient />
      {/* <StressTest /> */}
    </>
  )
}

function TcpClient() {
  const [client, clientX] = useState(null)
  const [serverForm] = Form.useForm()
  const [data, dataX] = useState([])
  const [rcvHex, rcvHexX] = useState(false)
  const [sendValue, sendValueX] = useState('')
  const [sendHex, sendHexX] = useState(false)

  const setData = (msg, isSend = false) => {
    dataX((pre) => [...pre, { time: dayjs(new Date()).format('HH:mm:ss'), isSend, ascii: msg.toString(), hex: msg.hexSlice() }])
  }

  const sendMsg = () => {
    if (!sendValue) return
    const hexdata = splitEvery(2, sendValue.replace(/\s/g, '')).map((m) => parseInt(m, 16))
    const bufferData = Buffer.from(hexdata)
    setData(bufferData, true)
    client.write(sendHex ? bufferData : sendValue)
  }

  // 初始化配置
  useEffect(() => {
    const loadConf = (conf) => {
      console.log(conf)
      serverForm.setFieldsValue(conf)
      rcvHexX(() => conf.rcvHex)
      sendValueX(conf.sendValue)
      sendHexX(() => conf.sendHex)
    }
    cacheObj(cacheKey).map(either(console.error, loadConf)).unsafePerformIO()
  }, [])

  // client变化或离开时, 销毁链接
  useEffect(() => {
    return () => client && !client.destroyed && client.destroy()
  }, [client])

  console.log(rcvHex, client, data)
  return (
    <>
      <Card title="服务端设置" size="small">
        <Form layout="inline" form={serverForm}>
          <Form.Item label="IP地址" name="serverIP" rules={[{ required: true, message: 'Required!' }]}>
            <Input onChange={(e) => cache('serverIP', e.target.value)} />
          </Form.Item>
          <Form.Item
            label="端口"
            name="serverPort"
            rules={[
              {
                required: true,
                validator: (_, val) => {
                  if (!isNaN(val) && val >= 0 && val <= 65535) return Promise.resolve()
                  return Promise.reject('端口号: 0-65535')
                },
              },
            ]}
          >
            <InputNumber onChange={cache('serverPort')} />
          </Form.Item>
          <Form.Item>
            {client && !client.destroyed ? (
              <Button type="primary" onClick={() => clientX(null)}>
                关闭
              </Button>
            ) : (
              <Button
                type="primary"
                onClick={() => {
                  serverForm
                    .validateFields()
                    .then(({ serverIP, serverPort }) => {
                      const socket = net.createConnection({ host: serverIP, port: serverPort })
                      socket.on('connect', () => clientX(socket))
                      socket.on('data', setData)
                    })
                    .catch((e) => {
                      console.log(e)
                      message.error(e.message)
                    })
                }}
              >
                连接
              </Button>
            )}
          </Form.Item>
        </Form>
      </Card>
      <Card
        title="数据日志"
        size="small"
        extra={
          <>
            <Checkbox
              checked={rcvHex}
              onChange={({ target: { checked } }) => {
                rcvHexX(checked)
                cache('rcvHex', checked)
              }}
            >
              HEX显示
            </Checkbox>
            <Button type="link" onClick={() => dataX([])} style={{ height: 'unset', padding: '0 0 0 10px' }}>
              清空
            </Button>
          </>
        }
      >
        <div className={css.block}>
          {/* {client && <span>{`本地地址 ${client.localAddress}:${client.localPort}`}</span>} */}
          <AutoRoll>
            {data &&
              data.map((m, i) => (
                <div style={m.isSend ? { color: '#1890ff', fontStyle: 'italic' } : null} key={i}>{`${m.time} : ${rcvHex ? m.hex : m.ascii}`}</div>
              ))}
          </AutoRoll>
        </div>
      </Card>
      <Card
        title="发送"
        size="small"
        extra={
          <>
            <Checkbox
              checked={sendHex}
              onChange={({ target: { checked } }) => {
                sendHexX(checked)
                cache('sendHex', checked)
              }}
            >
              HEX发送
            </Checkbox>
          </>
        }
      >
        <TextArea
          onPressEnter={(e) => {
            console.log(e, e.shiftKey)
            if (e.shiftKey) return
            e.preventDefault()
            console.log(client)
            sendMsg()
          }}
          onChange={({ target: { value } }) => {
            console.log(value)
            sendValueX(value)
            cache('sendValue', value)
          }}
          value={sendValue}
          showCount={true}
          bordered={false}
          disabled={!client}
          autoSize={{ minRows: 4, maxRows: 4 }}
        />
        <Button type="link" onClick={sendMsg}>
          发送
        </Button>
      </Card>
    </>
  )
}

function StressTest() {
  const [list, setList] = useState([])
  const add = (n) => {
    for (let i = 0; i < n; i++) {
      try {
        // const socket = net.createConnection({ port: 8080, host: '182.207.113.65' })
        // setList((pre) => [socket, ...pre])
        setList((pre) => ['', ...pre])
      } catch (e) {
        console.error(e)
      }
    }
  }

  const destroyAll = () => {
    try {
      list.forEach((socket) => {
        !socket.destroyed && socket.destroy()
      })
      setList([])
    } catch (e) {
      console.error(e)
      message.error(e.message)
    }
  }

  useEffect(() => destroyAll, [])
  console.log('StressTest')
  return (
    <div>
      <Divider orientation="left" plain>
        压力测试
      </Divider>
      <Button type="link" onClick={() => add(1)}>
        +1 个
      </Button>
      <Button type="link" onClick={() => add(10)}>
        +10 个
      </Button>
      <Button type="link" onClick={() => add(100)}>
        +100 个
      </Button>
      <Button type="link" onClick={() => add(1000)}>
        +1000 个
      </Button>
      <Button type="link" onClick={destroyAll}>
        关闭所有链接
      </Button>
      {list.map(() => 1)}
    </div>
  )
}
