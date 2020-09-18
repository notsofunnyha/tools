import React from 'react'
import ReactDOM from 'react-dom'
// https://serialport.io/docs/guide-installation#electron
import SerialPort from 'serialport'
import { Card, Row, Col, Checkbox, Button, Select, Form, Input, InputNumber } from 'antd'
import { prop } from 'ramda'
import dayjs from 'dayjs'

const { Option } = Select

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
}

const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
}

const getPortList = async () => {
  // console.log(await SerialPort.list())
  return (await SerialPort.list()).map((m) => m.path)
}

class PortSetting extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      portList: [],
    }
  }

  formRef = React.createRef()

  onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  setPortList = async () => {
    console.log('setPortList')
    try {
      const portList = await getPortList()
      console.log(portList)
      this.setState({ portList })
      console.log(
        this.state.portList.length,
        this.state.portList.length ? this.state.portList[0] : '',
      )
    } catch (e) {
      console.error('setPortList', e)
    }
  }

  async componentDidMount() {
    await this.setPortList()
    // this.setState({})
  }

  render() {
    return (
      <Form
        {...layout}
        name="basic"
        initialValues={{
          baudRate: 9600,
          // serialName: this.state.portList.length ? this.state.portList[0] : '',
        }}
        ref={this.formRef}
        onFinish={this.props.onSwitch}
        onFinishFailed={this.onFinishFailed}
      >
        <Form.Item
          label="串口名称"
          name="serialName"
          rules={[{ required: true, message: 'Required!' }]}
        >
          <Select
            // key={this.state.portList.length ? this.state.portList[0] : ''}
            value={this.state.portList.length ? this.state.portList[0] : ''}
            onClick={this.setPortList}
          >
            {this.state.portList.map((m, i) => (
              <Option key={i} value={m}>
                {m}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="波特率" name="baudRate" rules={[{ required: true }]}>
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            {this.props.port && this.props.port.isOpen ? '关闭串口' : '开启串口'}
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

async function getPort(name, baudRate) {
  return new Promise((s, j) => {
    let port = new SerialPort(name, baudRate, (e) => {
      if (e) j(e)
      else s(port)
    })
  })
}

class AutoRoll extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    setTimeout(() => {
      let dd = ReactDOM.findDOMNode(this.refs.dd)
      if (dd.scrollHeight - dd.scrollTop < dd.clientHeight + 200) dd.scrollTop = dd.scrollHeight
    }, 0)
    return (
      <div ref="dd" style={{ height: '100%', overflowY: 'auto' }}>
        {this.props.children}
      </div>
    )
  }
}

export default class Serial extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      portList: [],
      port: null,
      portIsOpen: false,
      msgs: [],
      spanLimit: 50, // 毫秒, 串口接收到的数据, 超时间间隔判定不是同一条消息
    }
  }
  // 缓存串口接收到的数据

  componentWillMount() {
    this.msgCache = []
    this.setMsg = function (datas) {
      this.setState({
        msgs: [
          ...this.state.msgs,
          { date: datas[0].date, data: datas.map((m) => m.data).join('') },
        ],
      })
    }
    this.timer = setInterval(() => {
      console.log(this)
      // 队列只有一条数据且年代久远; 不用考虑这条数据"较新"的情况, 因为几个循环后这条数据就不再新
      const spanLimit = this.state.spanLimit
      console.log(spanLimit)
      if (this.msgCache.length === 1 && +new Date() - this.msgCache[0].date > spanLimit) {
        this.setState({ msgs: [...this.state.msgs, this.msgCache.shift()] })
      } else {
        // 队列有多条数据, 从第一条往后找, 直到下一条数据时间间隔较大
        // 若已到最后队尾, 判断队尾是否年代久远, 不是则等待下一次循环
        let temp = []
        while (this.msgCache.length) {
          temp.push(this.msgCache.shift())
          if (!this.msgCache.length) {
            if (+new Date() - temp[temp.length - 1].date > spanLimit) {
              this.setMsg(temp)
            } else {
              this.msgCache = [...temp]
              break
            }
          } else if (this.msgCache[0].date - temp[temp.length - 1].date > spanLimit) {
            this.setMsg(temp)
            temp = []
          }
        }
      }
      // 消息达到一定数量后, 删除一下最先的消息
      if (this.state.msgs.length > 100) {
        this.setState({ msgs: this.state.msgs.slice(0, 80) })
        console.log(this.state.msgs)
      }
    }, 500)
  }

  componentWillUnmount() {
    console.log('componentWillUnmount')
    clearInterval(this.timer)
    this.state.port && this.state.port.isOpen && this.state.port.close()
  }

  onChange = (e) => {
    console.log(`checked = ${e.target.checked}`)
  }

  handleChange = (value) => {
    console.log(`selected ${value}`)
  }

  portSwitch = async (values) => {
    // console.log(values)
    console.log(this.state.port)
    let self = this
    if (!this.state.port) {
      try {
        let port = await getPort(values.serialName, values.baudRate)
        port.on('data', function (data) {
          // console.log('Data:', data, data.length)
          let hexData = data.toString('hex')
          self.msgCache.push({
            date: +new Date(),
            data: hexData,
          })
          // console.log('data', msgCache, msgs)
        })
        this.setState({ port })
        console.log(port)
        return
      } catch (e) {
        console.error(e)
        return message.error(e.message)
      }
    }

    //  todo:  切换端口 !!

    if (this.state.port.isOpen) {
      this.state.port.close((e) => {
        if (e) console.error(e)
        else this.setState({ port: null })
      })
    } else {
      this.state.port.open((e) => {
        if (e) console.error(e)
        else this.setState({ port: this.state.port })
      })
    }

    console.log('portSwitch', this.state.port)
    // ???
    // this.setState({ port: this.state.port })
  }

  clean = () => {
    console.log(this.state.msgs)
    this.setState({ msgs: [] })
    console.log(this.state.msgs)
  }

  render() {
    return (
      <>
        {/* 100% - bottom - padding - top border */}
        <Row gutter={[16, 16]} style={{ height: 'calc(100% - 200px)' }}>
          <Col span={12} style={{ height: '100%' }}>
            <Card
              style={{ height: '100%' }}
              bodyStyle={{ height: 'calc(100% - 57px)', padding: '4px 0 0 10px' }}
              title="原文"
              extra={
                <>
                  <Checkbox onChange={this.onChange}>HEX显示</Checkbox>
                  <Button
                    type="link"
                    onClick={this.clean}
                    style={{ height: 'unset', padding: '0 0 0 10px' }}
                  >
                    清空
                  </Button>
                </>
              }
            >
              <AutoRoll>
                {this.state.msgs.map((m, i) => (
                  <p key={i}>
                    {dayjs(m.date).format('HH:mm:ss')} : {m.data}
                  </p>
                ))}
              </AutoRoll>
            </Card>
          </Col>
          <Col span={12} style={{ height: '100%' }}>
            <Card
              title="译文"
              style={{ height: '100%' }}
              bodyStyle={{ height: 'calc(100% - 57px)', padding: '4px 0 0 10px' }}
            >
              <AutoRoll>
                {this.state.msgs.map((m, i) => (
                  <p key={i}>
                    {dayjs(m.date).format('HH:mm:ss')} : {m.data}
                  </p>
                ))}
              </AutoRoll>
            </Card>
          </Col>
        </Row>
        <Row style={{ height: '200px' }}>
          <Col span={12}>
            <PortSetting port={this.state.port} onSwitch={this.portSwitch} />
          </Col>
        </Row>
      </>
    )
  }
}
