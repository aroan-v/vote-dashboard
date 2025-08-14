'use client'
import React from 'react'
import dynamic from 'next/dynamic'

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

function SplineChartSection() {
  // Series stays in state because it might change in the future
  const [series] = React.useState([
    {
      name: 'series1',
      data: [31, 40, 28, 51, 42, 109, 100],
    },
    {
      name: 'series2',
      data: [11, 32, 45, 32, 34, 52, 41],
    },
  ])

  // Options are static — we derive them with useMemo so they don't recreate on every render
  const options = React.useMemo(
    () => ({
      chart: {
        height: 350,
        type: 'area',
      },
      dataLabels: {
        enabled: false, // Hide value labels on points
      },
      stroke: {
        curve: 'smooth', // Smooth curved lines
      },
      xaxis: {
        type: 'datetime',
        categories: [
          '2018-09-19T00:00:00.000Z',
          '2018-09-19T01:30:00.000Z',
          '2018-09-19T02:30:00.000Z',
          '2018-09-19T03:30:00.000Z',
          '2018-09-19T04:30:00.000Z',
          '2018-09-19T05:30:00.000Z',
          '2018-09-19T06:30:00.000Z',
        ],
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm', // Tooltip date formatting
        },
      },
    }),
    []
  )

  return (
    <div>
      <ReactApexChart options={options} series={series} type="area" height={350} />
    </div>
  )
}

export default SplineChartSection
