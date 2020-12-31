/**测试数据
 * 751655AE091E1405090D3A19070A64C4 751655A308354630080228906015EF
 * 751655A40A89860055191407075424590D751655A40A89860055191407075424590D 751655AE091E1405090D3A19070A64C4 751655A308354630080228906015EF
 */

// string -> string
export default function decode(data) {
  // 可能多条指令一起发, 需要手动计算
  // 目前 命令ID=75m
  //console.log(data.toString('hex'))
  let validData = get75Data(data.toString())
  //console.log(validData)
  if (!validData || !validData.length) return 'validate fail'

  return validData
    .map((m) => {
      // 指令解析
      let length = +('0x' + m.slice(8, 10)) // 此处 length 是字节长度
      let dataContent = m.slice(10, 10 + length * 2)
      switch (m.slice(4, 8).toUpperCase()) {
        case '55AE':
          return '授时操作 ' + convert55AE(dataContent)
        case '55A3':
          return '写IMEI码 ' + dataContent
        case '55A4':
          return 'ICCID码 ' + dataContent
        default:
          break
      }
      return ' '
    })
    .join('\n\n')
}

// string => [string]
function splitStr(str) {
  let arr = []
  for (let i = 0; i < str.length; i += 2) {
    arr.push(str.slice(i, i + 2))
  }
  return arr
}

// function hexStrToAscll(hex) {
//   let str = hex.replace(/\s+/g, '')
//   return splitStr(str)
//     .map((m) => {
//       return String.fromCharCode('0x' + m)
//     })
//     .join('')
// }

// string -> [string]
function get75Data(data) {
  /**
   * 字节数 含义
   * 1  命令ID
   * 1  功能码
   * 2  寄存器地址
   * 1  数据长度
   * n  数据
   * 2  CRC校验  : crc_16_modbus + 高低字节互换
   */
  let rst = []
  // console.log(typeof data)
  const minLength = 7 * 2 // 最小长度7字节, 字符长*2
  for (let i = 0; i <= data.length - minLength; i++) {
    let contentlength = +('0x' + data.slice(i + 8, i + 10)) * 2
    // console.log(contentlength)
    let CRC = data.slice(i + 10 + contentlength, i + 10 + contentlength + 4)
    let calcCRC = crc_16_modbus(splitStr(data.slice(i, i + 10 + contentlength)).map((m) => +('0x' + m)))
      .toString(16)
      .padStart(4, '0')

    if (CRC.toUpperCase() === splitStr(calcCRC).reverse().join('').toUpperCase()) {
      // console.log(CRC.toUpperCase(), calcCRC, splitStr(calcCRC).reverse().join('').toUpperCase())
      rst.push(data.slice(i, i + 10 + contentlength + 4))
    }
  }
  return rst
}

// [number] -> number
function crc_16_modbus(arr) {
  let tmp = 0xffff
  for (let n = 0; n < arr.length; n++) {
    tmp = arr[n] ^ tmp
    for (let i = 0; i < 8; i++) {
      if (tmp & 0x01) {
        tmp = tmp >> 1
        tmp = tmp ^ 0xa001
      } else {
        tmp = tmp >> 1
      }
    }
  }
  return tmp
}

// string -> string
function convert55AE(content) {
  let d1 = content.slice(0, 2)
  let d2 = content.slice(2, 4)
  let d3 = content.slice(4, 6)
  let d4 = content.slice(6, 8)
  let d5 = content.slice(8, 10)
  let d6 = content.slice(10, 12)
  let d7 = content.slice(12, 14)
  let d8 = content.slice(14, 16)
  let d9 = content.slice(16, 18)
  let yyyy = `20${+('0x' + d2)}`
  let MM = +('0x' + d3)
  let dd = +('0x' + d4)
  let hh = +('0x' + d5)
  let mm = +('0x' + d6)
  let ss = +('0x' + d7)
  // d8
  let gprs = (+('0x' + d8)).toString(2)
  let gprsStr = ''
  gprsStr += gprs[gprs.length - 1] === '1' ? '精确定位' : '非精确定位'
  gprsStr += gprs[gprs.length - 2] === '1' ? ' 和平台已建立连接' : ' 未连接平台'
  gprsStr += gprs[gprs.length - 3] === '1' ? ' IO上电' : ' IO下电'
  // console.log(gprsStr, gprs)

  return (
    `\n信号强度: ${+('0x' + d1)}` +
    `\n时间: ${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}` +
    `\nGPS状态: ${gprsStr}` +
    `\n版本号: ${+('0x' + d9)}`
  )
}
