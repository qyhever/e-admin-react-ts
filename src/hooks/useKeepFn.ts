// 持久化一个函数 https://zh-hans.reactjs.org/docs/hooks-faq.html#how-to-read-an-often-changing-value-from-usecallback
import { useRef, useEffect, useCallback } from 'react'

export type EmptyFnType = (...args: any[]) => any
export type NeverFnType = () => void

export default function <T extends NeverFnType>(fn: T) {
  const ref = useRef<T>()

  useEffect(() => {
    ref.current = fn
  }, [fn])

  return useCallback(() => {
    const fn = ref.current
    return fn && fn()
  }, [ref])
}
