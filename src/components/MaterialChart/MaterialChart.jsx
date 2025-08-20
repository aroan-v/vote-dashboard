'use client'
import * as React from 'react'
import dynamic from 'next/dynamic'
import { Box, Typography, Paper } from '@mui/material'
import { lineElementClasses } from '@mui/x-charts/LineChart'

// Last 6 hours of voting data, lead switching
const data = [
  { time: '6 PM', candidateA: 125000, candidateB: 124500 },
  { time: '7 PM', candidateA: 132000, candidateB: 134000 },
  { time: '8 PM', candidateA: 137500, candidateB: 136000 },
  { time: '9 PM', candidateA: 139000, candidateB: 140000 },
  { time: '10 PM', candidateA: 141000, candidateB: 142000 },
  { time: '11 PM', candidateA: 140000, candidateB: 145000 },
]

const LineChart = dynamic(() => import('@mui/x-charts').then((mod) => mod.LineChart), {
  ssr: false,
})

const formatVotes = (value) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
  return value
}

const CustomTooltip = ({ payload, label }) => {
  if (!payload?.length) return null

  return (
    <Box
      sx={{
        p: 1.5,
        bgcolor: 'rgba(20, 20, 20, 0.95)',
        borderRadius: 1,
        boxShadow: 3,
        minWidth: 120,
      }}
    >
      <Typography variant="body2" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
        Time: {label}
      </Typography>
      {payload.map((entry, index) => (
        <Typography
          key={index}
          variant="body2"
          sx={{
            color: entry.color,
            fontWeight: 500,
            mt: 0.5,
          }}
        >
          {entry.label}: {formatVotes(entry.value)}
        </Typography>
      ))}
    </Box>
  )
}

export default function MaterialChart() {
  const chartHeight = 320
  const chartWidth = 600 // fits 6 points comfortably without scrolling

  return (
    <Paper
      elevation={4}
      sx={{
        bgcolor: '#121212',
        p: 2.5,
        borderRadius: 3,
        overflowX: 'auto',
      }}
    >
      <Box sx={{ width: chartWidth, height: chartHeight }}>
        <LineChart
          width={chartWidth}
          height={chartHeight}
          dataset={data}
          series={[
            {
              dataKey: 'candidateA',
              label: 'Candidate A',
              color: '#66FF8A',
              area: true,
              stack: 'total',
              curve: 'linear', // straight lines
              showMark: true, // show point dots
              valueFormatter: (value, ctx) => {
                // Show label only on last point
                if (ctx.index === data.length - 1) {
                  return formatVotes(value)
                }
                return ''
              },
            },
            {
              dataKey: 'candidateB',
              label: 'Candidate B',
              color: '#FF6666',
              area: true,
              stack: 'total',
              curve: 'linear',
              showMark: true,
              valueFormatter: (value, ctx) => {
                if (ctx.index === data.length - 1) {
                  return formatVotes(value)
                }
                return ''
              },
            },
          ]}
          xAxis={[
            {
              scaleType: 'point',
              dataKey: 'time',
              tickLabelStyle: { fill: '#FFFFFF', fontSize: 12, fontWeight: 500 },
              tickInterval: 1,
            },
          ]}
          yAxis={[
            {
              tickFormatter: formatVotes,
              tickLabelStyle: { fill: '#FFFFFF', fontSize: 12, fontWeight: 500 },
            },
          ]}
          tooltip={{
            content: (props) => <CustomTooltip {...props} />,
          }}
          legend={{
            position: { vertical: 'bottom', horizontal: 'middle' },
            direction: 'row',
            itemMarkType: 'circle',
            labelStyle: { fill: '#FFFFFF', fontSize: 13, fontWeight: 500 },
          }}
          sx={{
            [`& .${lineElementClasses.root}`]: {
              strokeWidth: 2,
            },
          }}
        />
      </Box>
    </Paper>
  )
}
