/* eslint-disable no-bitwise */
import * as R from 'ramda'
import dayjs from 'dayjs'
import { position } from '../../util/mapJsApi/baidu'

// Number -> String -> Number
const toInt = R.curry((radix, s) => parseInt(s, radix))
// String -> Number
const toInt16 = toInt(16)
// Number -> Number -> String -> String
const skipnTakem = R.curry((n, m, str) => R.slice(n, n + m, str))
// Number -> Number -> String -> Number
const skipnTakemToInt16 = R.compose(toInt16, skipnTakem)
// Number -> String -> Number
const skipnTake2ToInt16 = R.curry((n, s) => skipnTakemToInt16(n, 2, s))
// Number -> Number -> String
const toString = R.curry((radix, m) => m.toString(radix))
// Number -> String -> String
const getState = R.compose(
  R.curry((str) => str.padStart(8, '0')),
  toString(2),
  skipnTake2ToInt16,
)
// Number -> String -> String -> String
const padStart = R.curry((n, char, s) => s.padStart(n, char))

//
export class PropValues extends Array {
  add(prop, value) {
    if (value.constructor && value.constructor.name === 'PropValues') {
      this.push({ prop, list: value })
    } else {
      this.push({ prop, value })
    }
  }
}

const getCmdCode = (data) => data.substr(4, 2)

// string -> string
export function checkdata(data) {
  const cmdCode = getCmdCode(data)
  if (!R.contains(cmdCode)(['17', '18', '28'])) {
    return '只解析 17,18,28 指令.'
  }

  // 奇偶和校验
  if (
    R.compose(
      padStart(2, '0'),
      toString(16),
      R.reduce((a, b) => a ^ b, 0),
      R.map(toInt(16)),
      R.splitEvery(2),
    )(data.substr(4, data.length - 8)) !== data.substr(data.length - 4, 2)
  ) {
    // console.log(data);
    return '奇偶和校验失败, 请检查数据准确性.'
  }
  return ''
}

// String ->
export function decode(data) {
  const result = new PropValues()
  const cmdCode = getCmdCode(data)

  if (cmdCode === '28') {
    result.add('28副参数信息', getCmd28Result(data))
  } else if (cmdCode === '17') {
    result.add('报警信息', getCmd17Alarm(data))
  }

  // 17 18 都带位置信息
  let gpsData = ''
  if (cmdCode === '17') gpsData = data.substr(36, 40)
  else if (cmdCode === '18') gpsData = data.substr(34, 40)
  if (gpsData) {
    const year = R.compose(R.concat('20'), R.toString(), toInt(2), R.slice(2, 8), toString(2), skipnTake2ToInt16(0))(gpsData)
    const month = skipnTake2ToInt16(2, gpsData)
    const day = skipnTake2ToInt16(4, gpsData)
    const hour = skipnTake2ToInt16(6, gpsData)
    const minute = skipnTake2ToInt16(8, gpsData)
    const second = skipnTake2ToInt16(10, gpsData)
    const resultPosition = new PropValues()
    resultPosition.add('终端位置时间', dayjs(`${year}-${month}-${day} ${hour}:${minute}:${second}`).add(8, 'hour').format('YYYY-MM-DD HH:mm:ss'))

    const num1 = skipnTake2ToInt16(12, gpsData)
    const num2 = skipnTake2ToInt16(14, gpsData)
    const num3 = skipnTake2ToInt16(16, gpsData)
    const num4 = skipnTake2ToInt16(18, gpsData)
    const num5 = skipnTake2ToInt16(20, gpsData)
    const num6 = skipnTake2ToInt16(22, gpsData)
    const num7 = skipnTake2ToInt16(24, gpsData)
    const num8 = skipnTake2ToInt16(26, gpsData)

    const lng = (num5 + (((num7 * 100 + num8) * 1.0) / 10000.0 + num6) / 60.0).toFixed(7).replace(/[0]+$/, '')
    const lat = (num1 + (((num3 * 100 + num4) * 1.0) / 10000.0 + num2) / 60.0).toFixed(7).replace(/[0]+$/, '')
    resultPosition.add('经度', lng)
    resultPosition.add('纬度', lat)
    resultPosition.add('详细地址', { type: 'watch', fn: position(lng, lat) })
    result.add('位置信息', resultPosition)

    const states = new PropValues()
    const state1 = getState(32, gpsData)
    const resultState1 = new PropValues()
    resultState1.add('bit(7) 导航', state1.substr(0, 1) === '1' ? '导航' : '不导航')
    resultState1.add('bit(6) 0.05Hz脉冲', state1.substr(1, 1) === '1' ? '关闭' : '开启')
    resultState1.add('bit(5) PLC上电', state1.substr(2, 1) === '1' ? '上电' : '不上电')
    resultState1.add('bit(4) 曾自动锁车标志', state1.substr(3, 1) === '1' ? '曾锁车' : '正常')
    resultState1.add('bit(3) 0.5Hz脉冲', state1.substr(4, 1) === '1' ? '关闭' : '启动')
    resultState1.add('bit(2) K继电器失电', state1.substr(5, 1) === '1' ? '不吸合' : '吸合')
    resultState1.add('bit(1) GPS天线故障', state1.substr(6, 1) === '1' ? '故障' : '正常')
    resultState1.add('bit(0) 是否有总线定时输出', state1.substr(7, 1) === '1' ? '有' : '没有')
    states.add('状态1', resultState1)

    const state2 = getState(34, gpsData)
    const resultState2 = new PropValues()
    resultState2.add('bit(7) SIM卡更换报警', state2.substr(0, 1) === '1' ? '报警' : '正常')
    resultState2.add('bit(6) 开盖状态', state2.substr(1, 1) === '1' ? '报警' : '正常')
    resultState2.add('bit(5) SIM卡曾拔卡', state2.substr(2, 1) === '1' ? '曾拔卡' : '正常')
    resultState2.add('bit(4) 曾通讯故障状态(删除)', state2.substr(3, 1) === '1' ? '报警' : '没有')
    resultState2.add('bit(3) IC卡插入(暂不要求)', state2.substr(4, 1) === '1' ? '插卡' : '未插')
    resultState2.add('bit(2) 进区报警(暂不要求)', state2.substr(5, 1) === '1' ? '报警' : '没有')
    resultState2.add('bit(1) 越界报警(暂不要求)', state2.substr(6, 1) === '1' ? '报警' : '没有')
    resultState2.add('bit(0) 超速报警(删除)', state2.substr(7, 1) === '1' ? '报警' : '没有')
    states.add('状态2', resultState2)

    const state3 = getState(36, gpsData)
    const resultState3 = new PropValues()
    resultState3.add('bit(7) 串口波特率', state3.substr(0, 1) === '1' ? '其它' : '9600')
    resultState3.add('bit(6) CAN口波特率', state3.substr(1, 1) === '1' ? '其它' : '125K')
    resultState3.add('bit(5) 曾开盖状态(删除)', state3.substr(2, 1) === '1' ? '曾开盖' : '正常')
    resultState3.add('bit(4) 备用电池欠压报警', state3.substr(3, 1) === '1' ? '报警' : '正常')
    resultState3.add('bit(3) 备用电池断电报警', state3.substr(4, 1) === '1' ? '报警' : '正常')
    resultState3.add('bit(2) 主电源欠压报警', state3.substr(5, 1) === '1' ? '报警' : '正常')
    resultState3.add('bit(1) 主电源断电报警', state3.substr(6, 1) === '1' ? '报警' : '正常')
    resultState3.add('bit(0) 总线故障报警', state3.substr(7, 1) === '1' ? '报警' : '正常')
    states.add('状态3', resultState3)

    const state4 = getState(38, gpsData)
    const resultState4 = new PropValues()
    resultState4.add('bit(4) 总线心跳状态', state4.substr(3, 1) === '1' ? '错误' : '正确')
    resultState4.add('bit(3) ACC2上电', state4.substr(4, 1) === '1' ? '上电' : '断电')
    resultState4.add('bit(2) 休眠报警', state4.substr(5, 1) === '1' ? '休眠' : '未休眠')
    states.add('状态4', resultState4)

    result.add('状态信息', states)
  }
  return result
}

// String -> {*}
function getCmd17Alarm(data) {
  const cmd17Alarm = getState(34, data)
  const resultAlarm = new PropValues()
  if (cmd17Alarm === '10101010') {
    // 10101010=>AA AA是特殊情况 无所谓发生,解除
    resultAlarm.add('报警标志', '终端连接心跳包 (AA)')
  } else {
    // console.log(cmd17Alarm);
    const alarmTag = cmd17Alarm.substr(0, 1) === '1' ? '报警发生' : '报警解除'
    resultAlarm.add('报警标志', alarmTag)

    const alarmValue = R.compose(toString(16), toInt(2), R.slice(1, 8))(cmd17Alarm)
    const alarmList = {
      1: 'GPS天线故障',
      4: '曾自动锁车标志',
      5: 'ACC/PLC上电',
      d: 'SIM卡拔卡标志',
      e: '开盖报警',
      f: 'SIM卡更换报警',
      10: '总线故障报警',
      11: '主电源断电报警',
      12: '主电源欠压报警',
      13: '备用电池断电报警',
      14: '备用电源欠压报警',
      16: 'CAN波特率变化',
      17: '串口波特率变化',
    }
    resultAlarm.add('报警值', alarmList[alarmValue] || alarmValue)
  }
  return resultAlarm
}

// String -> {*}
function getCmd28Result(data) {
  const cmd28content = data.substr(34, 36)
  const cmd28Result = new PropValues()
  cmd28Result.add('主电源电压', `${(skipnTakemToInt16(0, 4, cmd28content) / 10).toFixed(1)} V`)
  cmd28Result.add('备用电池电压', `${(skipnTake2ToInt16(4, cmd28content) / 10).toFixed(1)} V`)
  cmd28Result.add('终端内部温度', `${skipnTake2ToInt16(6, cmd28content) - 60} ℃`)
  cmd28Result.add('主电休眠上报间隔', `${skipnTake2ToInt16(8, cmd28content)} h`)
  cmd28Result.add('备电休眠上报间隔', `${skipnTake2ToInt16(10, cmd28content)} h`)
  cmd28Result.add('ACC ON总累计时间', `${skipnTakemToInt16(12, 8, cmd28content)} min`)
  cmd28Result.add('GPS终端总通电时间', `${skipnTakemToInt16(20, 8, cmd28content)} min`)
  cmd28Result.add('开盖次数', skipnTake2ToInt16(28, cmd28content))
  cmd28Result.add('拔GPS天线次数', skipnTake2ToInt16(30, cmd28content))
  cmd28Result.add('拔SIM卡次数', skipnTake2ToInt16(32, cmd28content))
  cmd28Result.add('GSM信号强度', skipnTake2ToInt16(34, cmd28content))
  return cmd28Result
}
