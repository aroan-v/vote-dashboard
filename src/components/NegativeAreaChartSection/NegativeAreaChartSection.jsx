'use client'
import React from 'react'
import dynamic from 'next/dynamic'

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

function NegativeAreaChartSection() {
  const [chartData] = React.useState({
    series: [
      {
        data: [0, -41, 35, -51, 0, 62, -69, 32, -32, 54, 16, -50], // Chart values
      },
    ],
    options: {
      chart: {
        height: 350,
        type: 'area',
        zoom: { enabled: false },
      },
      dataLabels: {
        enabled: false, // Disable point labels
      },
      title: {
        text: 'Negative color for values less than 0',
        align: 'left',
      },
      xaxis: {
        categories: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
      },
      stroke: {
        width: 0, // No border stroke around filled areas
      },
      colors: ['#0088ee'], // Default above threshold color
      fill: {
        type: 'solid',
        colors: ['#0088ee'],
      },
      // Custom color logic: ApexCharts doesn't support colorBelowThreshold directly for area charts,
      // so we'll simulate it with negative fill colors via theme overrides or series customization.
      plotOptions: {
        line: {
          colors: {
            threshold: 0,
            colorAboveThreshold: '#0088ee',
            colorBelowThreshold: '#ff0000',
          },
        },
      },
    },
  })

  return (
    <div className="mx-auto w-full max-w-3xl">
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="area"
        height={350}
      />
    </div>
  )
}

export default NegativeAreaChartSection
