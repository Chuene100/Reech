/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useRef} from 'react'
import ApexCharts, {ApexOptions} from 'apexcharts'
import {SVG} from '@/lib'
import {getCSSVariableValue} from '@/assets/ts/_utils'
import Button from '@/components/ui/Button'

type Props = {
  className: string
  chartTitle: string
  chartHeight: string
}

const TaskRadialBar: React.FC<Props> = ({className, chartTitle, chartHeight}) => {
  const chartRef = useRef<HTMLDivElement | null>(null)
  const refreshChart = () => {
    if (!chartRef.current) {
      return
    }

    const chart = new ApexCharts(chartRef.current, chartOptions(chartHeight, chartTitle))
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

const chartOptions = (chartHeight: string, chartTitle:string): ApexOptions => {

  return {
    series: [74],
    chart: {
      fontFamily: 'inherit',
      height: chartHeight,
      type: 'radialBar',
      toolbar: {
        show: true
      }
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
    plotOptions: {
      radialBar: {
        hollow: {
          margin: 0,
          size: '65%',
          background: '#fff',
          image: undefined,
          imageOffsetX: 0,
          imageOffsetY: 0,
          position: 'front',
          dropShadow: {
            enabled: true,
            top: 3,
            left: 0,
            blur: 4,
            opacity: 0.24
          }
        },
        track: {
            background: '#fff',
            strokeWidth: '67%',
            margin: 0, // margin is in pixels
            dropShadow: {
              enabled: true,
              top: -3,
              left: 0,
              blur: 15,
              opacity: 0.13
            }
        },
        dataLabels: {
            name: {
              show: false,
              fontWeight: '700',
            },
            value: {
              color: '#111',
              fontSize: '24px',
              fontWeight: '700',
              offsetY: 12,
              show: true,
              formatter: function (val) {
                return val + ''
              },
            },
          },
      },
    },
    fill: {
        colors: ['#9C27B0'],
        type: 'gradient',
        gradient: {
          shade: 'dark',
          type: 'horizontal',
          shadeIntensity: 0.5,
          gradientToColors: ['#7B4FFF'],
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100],
        }
      },
      stroke: {
        lineCap: 'round'
      },
      labels: ['Percent'],
  }
}

export {TaskRadialBar}
