import { useEffect } from 'react'
import { useRootStore } from '@/store'

export default function (chart: echarts.ECharts | null) {
  let timer: number | null = null
  const { appStore } = useRootStore()

  useEffect(() => {
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      timer && clearTimeout(timer)
    }
  }, [timer, onResize])

  useEffect(() => {
    timer = window.setTimeout(() => {
      onResize()
    }, 500)
  }, [appStore.collapsed, onResize])

  function onResize() {
    chart && chart.resize()
  }
}
