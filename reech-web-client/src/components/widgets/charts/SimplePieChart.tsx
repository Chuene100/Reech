/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useRef} from 'react'
import ApexCharts, {ApexOptions} from 'apexcharts'
import {SVG} from '@/lib'
import {getCSSVariableValue} from '@/assets/ts/_utils'
import Button from '@/components/ui/Button'

type Props = {
  className?: string
  chartTitle: string
  chartWidth: string
  chartData?: any
}

const SimplePieChart: React.FC<Props> = ({className, chartTitle, chartWidth, chartData}) => {
  const chartRef = useRef<HTMLDivElement | null>(null)
  const refreshChart = () => {
    if (!chartRef.current) {
      return
    }

    const chart = new ApexCharts(chartRef.current, chartOptions(chartWidth, chartTitle, chartData))
    if (chart) {
      chart.render()
    }

    return chart
  }

  useEffect(() => {
    const chart = refreshChart()

    return () => {
      if (chart) {
        chart.destroy()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartRef])

  return (
    <div className={` ${className}`}>
      {/* begin::Body */}
      <div className='card-body d-flex flex-column'>
        <div className='flex-grow-1'>
          <div ref={chartRef}></div>
        </div>
      </div>
      {/* end::Body */}
    </div>
  )
}

const chartOptions = (chartWidth: string, chartTitle:string, chartData: any): ApexOptions => {

  return {
    series: chartData,
    chart: {
      fontFamily: 'inherit',
      width: chartWidth,
      type: 'pie',
      toolbar: {
        show: false
      }
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      position: 'bottom',
      offsetY: 0,
    },
    title: {
        text: chartTitle,
        align: 'left',
        margin: 10,
        offsetX: 0,
        offsetY: 0,
        floating: false,
        style: {
          fontSize:  '14px',
          fontWeight:  'normal',
          color:  '#263238'
        },
    },
      stroke: {
        lineCap: 'round'
      },
      labels: ['Matric', 'Diploma', 'Degree', 'Honours'],
  }
}

export {SimplePieChart}
