import { useEffect, useRef, useCallback } from 'react'
import { useRootStore } from '@/store'

export default function (chartDOM: HTMLDivElement | null, option: echarts.EChartOption | echarts.EChartsResponsiveOption) {
  const chartInstanceRef = useRef<echarts.ECharts | null>(null)

  const { appStore } = useRootStore()

  // dispose
  useEffect(() => {
    return () => {
      chartInstanceRef.current && chartInstanceRef.current.dispose()
    }
  }, [])

  // render
  useEffect(() => {
    function renderChart() {
      if (!chartDOM) {
        return
      }
      const renderedInstance = window.echarts.getInstanceByDom(chartDOM)
      if (renderedInstance) {
        chartInstanceRef.current = renderedInstance
      } else {
        chartInstanceRef.current = window.echarts.init(chartDOM)
      }
      chartInstanceRef.current.setOption(option)
    }
    renderChart()
  }, [chartDOM, option])

  // onResize
  const onResize = useCallback(
    () => {
      chartInstanceRef.current && chartInstanceRef.current.resize()
    },
    []
  )

  // 浏览器窗口变化时， resize
  useEffect(() => {
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [onResize])

  // appStore.collapsed 变化时， resize
  useEffect(() => {
    const timer = setTimeout(() => {
      onResize()
    }, 500)
    return () => {
      clearTimeout(timer)
    }
  }, [appStore.collapsed, onResize])
  
  return chartInstanceRef.current
}
