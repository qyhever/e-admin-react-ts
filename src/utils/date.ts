import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { isString } from './type'
dayjs.locale('zh-cn')

function normalizeDateStr(str: Date): Date
function normalizeDateStr(str: Date | string): Date | number | string {
  let d: Date | string | number = str
  if (isString(str)) {
    if ((str as string).indexOf('-') >= 0) { // 将 - 替换为 /（ios不识别 -）
      d = (str as string).replace(/-/g, '/')
    }
    if (str === Number(str).toString()) { // 字符串形式的时间戳
      d = Number(str)
    }
  }
  return d
}

export const formatDate = (value = new Date(), str = 'YYYY-MM-DD') => {
  if (!value) {
    return ''
  }
  return dayjs(normalizeDateStr(value)).format(str)
}
export const formatDateTime = (value = new Date()) => {
  if (!value) {
    return ''
  }
  return dayjs(normalizeDateStr(value)).format('YYYY-MM-DD HH:mm:ss')
}
