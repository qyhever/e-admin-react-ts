import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { isString, isNumber } from './type'
dayjs.locale('zh-cn')

type DateFormatParamsType = string | number | Date

function normalizeDateValue(value: Date): Date
function normalizeDateValue(value: string): string | number
function normalizeDateValue(value: number): number
function normalizeDateValue(value: DateFormatParamsType): DateFormatParamsType
function normalizeDateValue(value: DateFormatParamsType) {
  let d = value
  if (d instanceof Date) {
    return d
  }
  if (isString(value)) {
    // if (value.indexOf('-') >= 0) { // 将 - 替换为 /（ios不识别 -）
    //   d = value.replace(/-/g, '/')
    // }
    if (value === Number(value).toString()) { // 字符串形式的时间戳
      d = Number(value)
    }
  }
  if (isNumber(value)) {
    if (String(value).length === 10) {
      d = Number(String(value) + '000')
    }
  }
  return d
}

export const formatDate = (value = new Date(), str = 'YYYY-MM-DD') => {
  if (!value) {
    return ''
  }
  return dayjs(normalizeDateValue(value)).format(str)
}
export const formatDateTime = (value: DateFormatParamsType = new Date()) => {
  if (!value) {
    return ''
  }
  return dayjs(normalizeDateValue(value)).format('YYYY-MM-DD HH:mm:ss')
}
