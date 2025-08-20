import React from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const data = [
  { name: '6 PM', candidateA: 500000, candidateB: 800000 },
  { name: '7 PM', candidateA: 700000, candidateB: 1300000 },
  { name: '8 PM', candidateA: 1200000, candidateB: 2000000 },
  { name: '9 PM', candidateA: 1500000, candidateB: 2800000 }, // B's peak lead
  { name: '10 PM', candidateA: 2000000, candidateB: 3000000 },
  { name: '11 PM', candidateA: 3000000, candidateB: 3200000 }, // gap closing
  { name: '12 AM', candidateA: 4200000, candidateB: 3400000 }, // A overtakes
  { name: '1 AM', candidateA: 4200000, candidateB: 3500000 },
  { name: '2 AM', candidateA: 4560000, candidateB: 3600000 },
  { name: '3 AM', candidateA: 5670000, candidateB: 4200000 },
  { name: '4 AM', candidateA: 5800000, candidateB: 4800000 },
  { name: '5 AM', candidateA: 5900000, candidateB: 6000000 },
]
// Formats vote numbers (e.g. 2.8M, 650K)
const formatVotes = (value) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
  return value
}

// Custom tooltip with dark styling
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div
        style={{
          backgroundColor: 'rgba(30, 30, 30, 0.95)',
          padding: '10px',
          borderRadius: '8px',
          color: '#f5f5f5',
          fontSize: '0.85rem',
          boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
        }}
      >
        <p style={{ margin: 0, fontWeight: 600 }}>{`Time: ${label}`}</p>
        {payload.map((entry, i) => (
          <p key={i} style={{ margin: '4px 0', color: entry.color }}>
            {`${entry.name}: ${formatVotes(entry.value)}`}
          </p>
        ))}
      </div>
    )
  }
  return null
}

const TotalVotesChart = () => {
  const theme = {
    textColor: '#e0e0e0',
    gridColor: '#333',
    backgroundColor: '#1a1a1a',
    candidateAColor: '#4CAF50',
    candidateBColor: '#F44336',
  }

  return (
    <div
      style={{
        backgroundColor: theme.backgroundColor,
        padding: '20px',
        borderRadius: '10px',
        color: theme.textColor,
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
          {/* Gradients */}
          <defs>
            <linearGradient id="colorA" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={theme.candidateAColor} stopOpacity={0.7} />
              <stop offset="100%" stopColor={theme.candidateAColor} stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="colorB" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={theme.candidateBColor} stopOpacity={0.7} />
              <stop offset="100%" stopColor={theme.candidateBColor} stopOpacity={0.05} />
            </linearGradient>
          </defs>

          {/* Grid & Axes */}
          <CartesianGrid stroke={theme.gridColor} strokeDasharray="4 4" />
          <XAxis
            dataKey="name"
            interval={2} // shows every other label
            stroke={theme.textColor}
            tick={{ fontSize: 12, fontWeight: 500 }}
          />
          <YAxis
            stroke={theme.textColor}
            tickFormatter={formatVotes}
            tick={{ fontSize: 12, fontWeight: 500 }}
          />

          {/* Tooltip & Legend */}
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            align="right"
            wrapperStyle={{
              color: theme.textColor,
              fontSize: '0.9rem',
              fontWeight: 500,
              paddingBottom: '10px',
            }}
          />

          <Area
            type="monotone"
            dataKey="candidateA"
            stroke={theme.candidateAColor}
            fillOpacity={1}
            fill="url(#colorA)"
            name="Candidate A"
            dot={{
              r: 4,
              stroke: '#fff',
              strokeWidth: 0.5,
              fill: theme.candidateAColor,
            }}
          />
          <Area
            type="monotone"
            dataKey="candidateB"
            stroke={theme.candidateBColor}
            fillOpacity={1}
            fill="url(#colorB)"
            name="Candidate B"
            dot={{ r: 4, stroke: '#fff', strokeWidth: 0.5, fill: theme.candidateBColor }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default TotalVotesChart
