/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useRef} from 'react'
import ApexCharts, {ApexOptions} from 'apexcharts'
import {SVG} from '@/lib'
import {getCSSVariableValue} from '@/assets/ts/_utils'
// import {Dropdown1} from '../../content/dropdown/Dropdown1'

type Props = {
  className: string
  chartColor: string
  chartHeight: string
}

const LineChart: React.FC<Props> = ({className, chartColor, chartHeight}) => {
  const chartRef = useRef<HTMLDivElement | null>(null)
  const refreshChart = () => {
    if (!chartRef.current) {
      return
    }

    const chart = new ApexCharts(chartRef.current, chartOptions(chartColor, chartHeight))
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
    <div className={`card ${className}`}>
      

      {/* begin::Body */}
      <div className='card-body p-0 d-flex flex-column'>
        

        {/* begin::Chart */}
        <div ref={chartRef} className='mixed-widget-6-chart card-rounded-bottom'></div>
        {/* end::Chart */}
      </div>
      {/* end::Body */}
    </div>
  )
}

const chartOptions = (chartColor: string, chartHeight: string): ApexOptions => {
  const lightColor = getCSSVariableValue('--kt-' + chartColor + '-light')

  return {
    series: [
      {
        name: "South Africa",
        data: [28, 19, 25, 18, 26, 27, 24]
      },
      {
        name: "America",
        data: [19, 22, 18, 22, 17, 15, 20]
      }
    ],
      chart: {
      height: chartHeight,
      type: 'line',
      dropShadow: {
        enabled: true,
        color: '#000',
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.2
      },
      zoom: {
        enabled: false
      },
      toolbar: {
        show: false
      },
      sparkline: {
        enabled: true
      }
    },
    colors: ['#FF0000', '#545454'],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth'
    },
    grid: {
      borderColor: '#e7e7e7',
      row: {
        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
        opacity: 0.5
      },
    },
    markers: {
      size: 1
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      title: {
        text: 'Month'
      }
    },
    yaxis: {
      title: {
        text: 'Temperature'
      },
      min: 5,
      max: 40
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      floating: true,
      offsetY: -25,
      offsetX: -5
    }
  }
}

export {LineChart}
