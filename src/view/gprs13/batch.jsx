import React, { useState, useEffect } from 'react'
import { Button, message, Table, Progress, Row, Col } from 'antd'
import { decode, checkdata } from './zl-gprs-13'
// eslint-disable-next-line no-unused-vars
import css from './batch.scss'
import { getJsonByExcel, saveJsonAsExcel } from '../../util/iexcel'
import { safeProp, Task } from '../../support/index'
import { chain, compose, uniq } from 'ramda'
import TasksKeeper from '../../util/TasksKeeper'

let tasksKeeper

export default function Gprs13() {
  useEffect(() => {
    return stopTasksKeeper
  }, [])

  const stopTasksKeeper = () => {
    if (tasksKeeper) tasksKeeper.stop()
  }

  const [dataSource, setDataSource] = useState([])
  const [executeStatus, setExecuteStatus] = useState('undo')
  const [sum, setSum] = useState(0)
  const [count, setCount] = useState(0)
  const [filePath, saveFilePath] = useState('')

  const handleCancel = () => {
    stopTasksKeeper()
    setExecuteStatus('cancel')
  }

  const onDrag = (ev) => {
    ev.preventDefault()

    stopTasksKeeper()
    //
    setDataSource([])
    setExecuteStatus('undo')
    setSum(0)
    setCount(0)

    var fileObj = ev.dataTransfer.files[0]
    // console.log(fileObj)
    const jsonData = getJsonByExcel(fileObj.path)
    saveFilePath(fileObj.path)
    if (!jsonData || !jsonData.length) return message.error('未读取到数据, 请检测文件格式/内容')
    // console.log(jsonData)
    const validData = jsonData.filter((m) => /^5A4C(17|18)/.test(m['内容']) && m['数据方向'] == 'GPRS上行')
    if (!validData || !validData.length) return message.warn('未读取到17, 18 GPRS上行数据')
    const decodeData = validData.map((m) => {
      const check = checkdata(m['内容'])
      if (check) return { ...m, 详细地址: Task.of('') }
      const info = decode(m['内容'])
      return {
        ...m,
        终端位置时间: compose(chain(safeProp('终端位置时间')), safeProp('位置信息'))(info).$value,
        导航: compose(chain(safeProp('bit(7) 导航')), chain(safeProp('状态1')), safeProp('状态信息'))(info).$value,
        经度: compose(chain(safeProp('经度')), safeProp('位置信息'))(info).$value,
        纬度: compose(chain(safeProp('纬度')), safeProp('位置信息'))(info).$value,
        详细地址: compose(chain(safeProp('详细地址')), safeProp('位置信息'))(info).$value.fn,
      }
    })

    // console.log(decodeData)
    setSum(decodeData.length)
    const tasks = decodeData.map((m) => m['详细地址'])
    tasksKeeper = TasksKeeper.of({
      tasks,
      resolve: (res, tag) => {
        decodeData[tag]['详细地址'] = res
        setCount(tag)
        // console.log('实时更新表格会导致卡顿 !!!!!')
        // setDataSource([...decodeData])
      },
      reject: (e, tag) => {
        decodeData[tag]['详细地址'] = '网络错误, 解析失败'
        setCount(tag)
        // setDataSource([...decodeData])
      },
      done: () => {
        setDataSource([...decodeData])
        setExecuteStatus('done')
        message.success('解析完成')
      },
    })
    setExecuteStatus('start')
    tasksKeeper.start()
  }

  const columns = uniq(['终端位置时间', '导航', '经度', '纬度', '详细地址', '内容', ...Object.keys(dataSource[0] || {})]).map((m) => ({
    dataIndex: m,
    title: m,
  }))

  return (
    <>
      <div onDrop={onDrag} onDragOver={(e) => e.preventDefault()} style={{ height: '140px', padding: '20px 20px', backgroundColor: '#95de64' }}>
        <p>将excel文件拖放到绿色区域开始解析</p>
        <p>excel至少包含列(内容,数据方向)</p>
        <p>只解析17 18 上来的位置信息</p>
      </div>
      <Row style={{ padding: '20px 0' }}>
        <Col span={24}>
          {executeStatus == 'start' && (
            <>
              <span>{`${count}/${sum}`}</span>
              <Progress percent={((count / sum) * 100) >> 0} status="active" />
              <Button type="primary" onClick={handleCancel}>
                取消
              </Button>
            </>
          )}
          {executeStatus == 'done' && (
            <Button
              type="primary"
              onClick={() => {
                const savePath = `${filePath}.解析结果.xlsx`
                const res = saveJsonAsExcel(dataSource, savePath)
                if (res) return message.error(res)
                return message.success(`文件已保存至: ${savePath}`)
              }}
            >
              下载
            </Button>
          )}
        </Col>
      </Row>

      <Table
        dataSource={dataSource.map((m, i) => ({ ...m, key: i }))}
        columns={columns}
        pagination={false}
        className={executeStatus == 'start' ? css.taskrunning : css.taskdone}
      />
    </>
  )
}
