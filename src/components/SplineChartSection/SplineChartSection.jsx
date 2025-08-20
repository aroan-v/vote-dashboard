'use client'
import React from 'react'
import dynamic from 'next/dynamic'

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

function SplineChartSection() {
  const [series] = React.useState([
    {
      name: 'Candidate A',
      data: [250000, 400000, 650000, 1000000, 1500000, 2200000, 2800000],
    },
    {
      name: 'Candidate B',
      data: [220000, 380000, 700000, 1100000, 1600000, 2300000, 3000000],
    },
  ])

  // A fixed width larger than the viewport to force scrolling
  const chartWidth = 24 * 70

  const options = React.useMemo(
    () => ({
      chart: {
        height: 350,
        width: chartWidth, // This fixed width is key
        type: 'area',
        stacked: true,
        toolbar: {
          show: false,
        },
        background: '#1a1a1a',
      },
      theme: {
        mode: 'dark',
      },
      colors: ['#4CAF50', '#F44336'],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'straight', // no more wavy line
        width: 2,
      },
      dataLabels: {
        enabled: true, // show labels
        formatter: (value) => {
          if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
          if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
          return value
        },
        style: {
          colors: ['#fff'], // white labels for dark background
          fontSize: '11px',
          fontWeight: 'bold',
        },
        background: {
          enabled: true,
          foreColor: '#000', // text color inside label
          borderRadius: 4,
          padding: 4,
          opacity: 0.9,
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 100],
          colorStops: [
            { offset: 0, color: '#4CAF50', opacity: 0.7 },
            { offset: 100, color: '#F44336', opacity: 0.9 },
          ],
        },
      },
      xaxis: {
        type: 'category',
        categories: ['5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM'],
        title: {
          text: 'Time of Day',
          style: {
            color: '#e0e0e0',
          },
        },
        labels: {
          style: {
            colors: '#e0e0e0',
          },
        },
      },
      yaxis: {
        title: {
          text: 'Total Votes',
          style: {
            color: '#e0e0e0',
          },
        },
        labels: {
          style: {
            colors: '#e0e0e0',
          },
          formatter: (value) => {
            if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
            if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
            return value
          },
        },
      },
      tooltip: {
        theme: 'dark',
        x: {
          formatter: (value) => value,
        },
        y: {
          formatter: (value) => `${value.toLocaleString()} votes`,
        },
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        labels: {
          colors: '#e0e0e0',
        },
      },
      grid: {
        borderColor: '#444',
      },
    }),
    [chartWidth]
  )

  return (
    <div
      style={{
        backgroundColor: '#1a1a1a',
        padding: '20px',
        borderRadius: '8px',
        overflowX: 'auto', // This enables horizontal scrolling
      }}
    >
      <ReactApexChart options={options} series={series} type="area" height={350} />
    </div>
  )
}

export default SplineChartSection
