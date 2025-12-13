'use client'

import dynamic from 'next/dynamic'
import { ApexOptions } from 'apexcharts'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface ApexChartProps {
  type: 'line' | 'area' | 'bar' | 'pie' | 'donut' | 'radialBar'
  series: ApexAxisChartSeries | ApexNonAxisChartSeries
  options: ApexOptions
  height?: number | string
}

export function ApexChart({ type, series, options, height = 350 }: ApexChartProps) {
  return (
    <Chart
      type={type}
      series={series}
      options={options}
      height={height}
    />
  )
}
