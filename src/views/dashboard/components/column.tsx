import React, { useState, useEffect, useRef } from 'react'
import useEcharts from '@/hooks/useEcharts'
import { getOption } from './column-option'

const ColumnChart = () => {
  const chartRef = useRef<HTMLDivElement | null>(null)
  const [option, setOption] = useState<echarts.EChartOption>({})

  useEcharts(chartRef.current, option)

  // 模拟异步数据
  useEffect(() => {
    const timer = setTimeout(() => {
      setOption(getOption())
    }, 20)
    return () => {
      clearTimeout(timer)
    }
  }, [])

  return (
    <div className="chart" ref={chartRef}></div>
  )
}

export default ColumnChart
