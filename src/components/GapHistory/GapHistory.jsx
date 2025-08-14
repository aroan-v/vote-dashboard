'use client'
import React from 'react'
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from '../ui/table'
import SectionContainer from '../SectionContainer'

function GapHistory() {
  // Sample data (replace with your dynamic data)
  const data = [
    { time: '10:00 AM', gapMovement: 5, change: '↑ 5' },
    { time: '10:05 AM', gapMovement: -3, change: '↓ 3' },
    { time: '10:10 AM', gapMovement: +2, change: '↑ 2' },
    { time: '10:00 AM', gapMovement: 5, change: '↑ 5' },
    { time: '10:05 AM', gapMovement: -3, change: '↓ 3' },
    { time: '10:10 AM', gapMovement: +2, change: '↑ 2' },
    { time: '10:00 AM', gapMovement: 5, change: '↑ 5' },
    { time: '10:05 AM', gapMovement: -3, change: '↓ 3' },
    { time: '10:10 AM', gapMovement: +2, change: '↑ 2' },
    { time: '10:00 AM', gapMovement: 5, change: '↑ 5' },
    { time: '10:05 AM', gapMovement: -3, change: '↓ 3' },
    { time: '10:10 AM', gapMovement: +2, change: '↑ 2' },
  ]

  return (
    <SectionContainer className="max-h-[300px] overflow-y-scroll">
      <Table>
        <TableCaption>Gap movement over time</TableCaption>

        {/* Table header */}
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>Gap Movement</TableHead>
            <TableHead>Change in Gap</TableHead>
          </TableRow>
        </TableHeader>

        {/* Table body */}
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.time}</TableCell>
              <TableCell>{row.gapMovement}</TableCell>
              <TableCell movement={row.gapMovement > 0 ? 'good' : 'bad'}>{row.change}</TableCell>
            </TableRow>
          ))}
        </TableBody>

        {/* Optional footer */}
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total entries: {data.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </SectionContainer>
  )
}

export default GapHistory
