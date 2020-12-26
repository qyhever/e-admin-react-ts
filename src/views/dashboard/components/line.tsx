import React, { useRef } from 'react'
// import useChartResize from '@/hooks/useChartResize'
import useEcharts from '@/hooks/useEcharts'
import option from './option'

const LineChart = () => {
  const chartRef = useRef<HTMLDivElement | null>(null)
  useEcharts(chartRef.current, option as echarts.EChartOption)

  return (
    <div className="chart" ref={chartRef}></div>
  )
}

export default LineChart
