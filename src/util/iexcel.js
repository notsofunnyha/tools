import XLSX from 'xlsx'
import { take } from 'ramda'

export function getJsonByExcel(filename) {
  try {
    var workbook = XLSX.readFile(filename)
    var jsonObj = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]])
    return jsonObj
  } catch (ex) {
    console.error(ex)
    return null
  }
}

export function saveJsonAsExcel(json, excelName) {
  let ws = XLSX.utils.json_to_sheet(json)

  /**
   * 计算列宽
   */
  let ks = Object.keys(json[0])
  let colsLen = ks.map(() => 0)
  // 比较值
  take(10, json).forEach((m) => {
    for (let i = 0; i < ks.length; i++) {
      let len = (m[ks[i]] + '').replace(/[\u0391-\uFFE5]/g, 'cn').length
      if (len > colsLen[i]) colsLen[i] = len
    }
  })
  // 比较属性名
  for (let i = 0; i < ks.length; i++) {
    let len = ks[i].replace(/[\u0391-\uFFE5]/g, 'cn').length
    if (len > colsLen[i]) colsLen[i] = len
  }
  colsLen = colsLen.map((m) => {
    m = m < 60 ? m : 10 //太长的列
    return { wpx: m * 7 }
  })
  ws['!cols'] = colsLen

  const wb = { SheetNames: ['Sheet1'], Sheets: { Sheet1: ws } }

  try {
    XLSX.writeFile(wb, excelName)
    return ''
  } catch (e) {
    console.error(e)
    return e.message
  }
}
