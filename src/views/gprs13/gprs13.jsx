import React from 'react'
import { Button, Collapse, Input, Row, Col, message } from 'antd'
import { decode } from './zl-gprs-13'
import css from './gprs13.scss'

const { TextArea } = Input
const { Panel } = Collapse

function Item(props) {
  // console.log(props)
  const { prop, value, list } = props
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
  return <p>{`${prop} : ${value}`}</p>
}

export default class Gprs13 extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      inputValue:
        '5A4C1800000046015A012090361402002ED20209020E02200A2043762D302900B3DCA041000000335B760019FBD000000000001222353146412C32464245228A0D',
      convertResult: [],
    }
  }

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value })
  }

  handleTextAreaChange = (e) => {
    this.setState({ inputValue: e.target.value })
  }

  convert = async () => {
    const { inputValue } = this.state
    try {
      const result = await decode(inputValue)
      // console.log(result)
      this.setState({ convertResult: result })
      message.success('解析成功', 1)
    } catch (e) {
      console.error(e)
      message.error(e.message)
    }
  }

  render() {
    const { inputValue, convertResult } = this.state
    return (
      <>
        <TextArea
          onChange={this.handleTextAreaChange}
          value={inputValue}
          autoSize={{ minRows: 4, maxRows: 6 }}
        />
        <Row>
          <Col span={24}>
            <Button type="primary" onClick={this.convert} style={{ float: 'left' }}>
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
}
