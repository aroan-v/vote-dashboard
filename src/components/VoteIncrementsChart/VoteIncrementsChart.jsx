'use client'
import React, { useRef, useEffect } from 'react'
import * as d3 from 'd3'
import { useApiStore } from '@/store/useApiStore'
import SectionContainer from '../SectionContainer'

export default function VoteIncrementsChart({}) {
  const svgRef = useRef()
  const selectedDelta = useApiStore((s) => (s.selectedDate ? s.selectedDelta() : null))
  const [width, setWidth] = React.useState(0)
  const scrollRef = useRef(null)

  // ==========================
  // COLORS
  // ==========================
  const colors = {
    fyang: '#9e2a2f',
    will: '#00b7ff',
    text: '#fff',
    grid: '#888',
    shade1: '#061637',
    shade2: '#0d186e',
  }

  console.log('selectedDelta', selectedDelta)

  useEffect(() => {
    if (!selectedDelta || selectedDelta.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const height = 300
    const margin = { top: 20, right: 40, bottom: 40, left: 60 }

    // Use rawTime (ISO string) → Date object
    const data = selectedDelta.map((d) => ({
      ...d,
      timestamp: new Date(d.rawTime), // keeps full precision
    }))

    const [minTime, maxTime] = d3.extent(data, (d) => d.timestamp)
    const hours = (maxTime - minTime) / (1000 * 60 * 60)
    const widthPerHour = 60
    const width = Math.max(1000, hours * widthPerHour)
    setWidth(width)

    const x = d3
      .scaleTime()
      .domain([minTime, maxTime])
      .range([margin.left, width - margin.right])

    // Y scale (vote increments)
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => Math.max(d['FYANG SMITH_delta'], d['WILL ASHLEY_delta']))])
      .nice()
      .range([height - margin.bottom, margin.top])

    // Line generators
    const lineFYANG = d3
      .line()
      .x((d) => x(d.timestamp))
      .y((d) => y(d['FYANG SMITH_delta']))

    const lineWILL = d3
      .line()
      .x((d) => x(d.timestamp))
      .y((d) => y(d['WILL ASHLEY_delta']))

    // ==========================
    // AXES
    // ==========================

    // X-axis (time)
    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(d3.timeHour.every(1)).tickFormat(d3.timeFormat('%-I %p')))
      .selectAll('text')
      .attr('transform', 'rotate(0)')
      .style('text-anchor', 'middle')

    svg
      .append('g')
      .attr('class', 'grid-lines')
      .call((g) =>
        g
          .selectAll('line')
          .data(x.ticks(d3.timeHour.every(1))) // 1-hour intervals
          .join('line')
          .attr('x1', (d) => x(d))
          .attr('x2', (d) => x(d))
          .attr('y1', margin.top)
          .attr('y2', height - margin.bottom)
          .attr('stroke', '#88888855')
          .attr('stroke-width', 1)
          .attr('stroke-dasharray', '4 2')
      )

    // Left Y-axis
    svg.append('g').attr('transform', `translate(${margin.left},0)`).call(d3.axisLeft(y))

    // Right Y-axis
    svg
      .append('g')
      .attr('transform', `translate(${width - margin.right},0)`)
      .call(d3.axisRight(y))

    // Y-axis horizontal grid lines
    svg
      .append('g')
      .attr('class', 'y-grid')
      .call(
        (g) =>
          g
            .selectAll('line')
            .data(y.ticks()) // use the Y-axis ticks
            .join('line')
            .attr('x1', margin.left) // start at left chart boundary
            .attr('x2', width - margin.right) // end at right chart boundary
            .attr('y1', (d) => y(d)) // Y position for each tick
            .attr('y2', (d) => y(d))
            .attr('stroke', '#88888826') // semi-transparent grey
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', '4 2') // dotted lines
      )

    // ==========================
    // LINES
    // ==========================
    svg
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', colors.fyang)
      .attr('stroke-width', 2)
      .attr('d', lineFYANG)

    svg
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', colors.will)
      .attr('stroke-width', 2)
      .attr('d', lineWILL)

    // ==========================
    // POINTS
    // ==========================

    // All data points
    svg
      .selectAll('.dot-fyang')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot-fyang')
      .attr('cx', (d) => x(d.timestamp))
      .attr('cy', (d) => y(d['FYANG SMITH_delta']))
      .attr('r', 1)
      .attr('fill', colors.fyang)

    svg
      .selectAll('.dot-will')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot-will')
      .attr('cx', (d) => x(d.timestamp))
      .attr('cy', (d) => y(d['WILL ASHLEY_delta']))
      .attr('r', 1)
      .attr('fill', colors.will)

    // ==========================
    // DAILY GRID & SHADING
    // ==========================
    const allDates = d3.timeDay.range(
      d3.min(data, (d) => d.timestamp),
      d3.max(data, (d) => d.timestamp)
    )

    // Vertical grid lines at midnight
    svg
      .selectAll('.day-grid')
      .data(allDates)
      .enter()
      .append('line')
      .attr('class', 'day-grid')
      .attr('x1', (d) => x(d))
      .attr('x2', (d) => x(d))
      .attr('y1', margin.top)
      .attr('y2', height - margin.bottom)
      .attr('stroke', colors.grid)
      .attr('stroke-dasharray', '4 2')
      .attr('stroke-width', 1)

    // Shaded background per day
    svg
      .selectAll('.day-shade')
      .data(allDates)
      .enter()
      .append('rect')
      .attr('class', 'day-shade')
      .attr('x', (d, i) => x(d))
      .attr('y', margin.top)
      .attr('width', (d, i) =>
        i < allDates.length - 1
          ? x(allDates[i + 1]) - x(d)
          : x(d3.max(data, (d) => d.timestamp)) - x(d)
      )
      .attr('height', height - margin.top - margin.bottom)
      .attr('fill', (d, i) => (i % 2 === 0 ? colors.shade1 : colors.shade2))
      .attr('opacity', 0.1)

    // Top X-axis labels per day
    svg
      .selectAll('.day-label')
      .data(allDates)
      .enter()
      .append('text')
      .attr('class', 'day-label')
      .attr('x', (d, i) => {
        const nextDate = allDates[i + 1] || d3.max(data, (d) => d.timestamp)
        return x(new Date((d.getTime() + nextDate.getTime()) / 2))
      })
      .attr('y', margin.top - 5)
      .attr('text-anchor', 'middle')
      .style('fill', colors.text)
      .style('font-size', '12px')
      .text((d) => d3.timeFormat('%b %d')(d))

    // ==========================
    // GRADIENT AREAS
    // ==========================
    const defs = svg.append('defs')

    // FYANG gradient
    defs
      .append('linearGradient')
      .attr('id', 'fyang-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%')
      .selectAll('stop')
      .data([
        { offset: '0%', color: colors.fyang, opacity: 0.4 },
        { offset: '100%', color: colors.fyang, opacity: 0 },
      ])
      .enter()
      .append('stop')
      .attr('offset', (d) => d.offset)
      .attr('stop-color', (d) => d.color)
      .attr('stop-opacity', (d) => d.opacity)

    // WILL gradient
    defs
      .append('linearGradient')
      .attr('id', 'will-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%')
      .selectAll('stop')
      .data([
        { offset: '0%', color: colors.will, opacity: 0.4 },
        { offset: '100%', color: colors.will, opacity: 0 },
      ])
      .enter()
      .append('stop')
      .attr('offset', (d) => d.offset)
      .attr('stop-color', (d) => d.color)
      .attr('stop-opacity', (d) => d.opacity)

    // Area generators
    const areaFYANG = d3
      .area()
      .x((d) => x(d.timestamp))
      .y0(height - margin.bottom)
      .y1((d) => y(d['FYANG SMITH_delta']))

    const areaWILL = d3
      .area()
      .x((d) => x(d.timestamp))
      .y0(height - margin.bottom)
      .y1((d) => y(d['WILL ASHLEY_delta']))

    // Draw areas
    svg.append('path').datum(data).attr('fill', 'url(#fyang-gradient)').attr('d', areaFYANG)
    svg.append('path').datum(data).attr('fill', 'url(#will-gradient)').attr('d', areaWILL)

    // ==========================
    // PEAK & FINAL DOTS + LABELS
    // ==========================
    const peakFYANG = data.reduce(
      (max, d) => (d['FYANG SMITH_delta'] > max['FYANG SMITH_delta'] ? d : max),
      data[0]
    )
    const peakWILL = data.reduce(
      (max, d) => (d['WILL ASHLEY_delta'] > max['WILL ASHLEY_delta'] ? d : max),
      data[0]
    )
    const finalFYANG = data[0]
    const finalWILL = data[0]

    console.log('Final FYANG:', finalFYANG['FYANG SMITH_delta'])
    console.log('Final WILL:', finalWILL['WILL ASHLEY_delta'])
    console.log('y(finalFYANG):', y(finalFYANG['FYANG SMITH_delta']))
    console.log('y(finalWILL):', y(finalWILL['WILL ASHLEY_delta']))

    // Helper: draw dot + label
    function addDotWithLabel(d, valueKey, color, labelOffset = { x: -10, y: -5 }) {
      svg
        .append('circle')
        .attr('cx', x(d.timestamp))
        .attr('cy', y(d[valueKey]))
        .attr('r', 5)
        .attr('fill', color)
    }

    // Add peaks
    // addDotWithLabel(peakFYANG, 'FYANG SMITH_delta', colors.fyang, { x: 0, y: -10 })
    // addDotWithLabel(peakWILL, 'WILL ASHLEY_delta', colors.will, { x: 0, y: -10 })

    // Add final points
    addDotWithLabel(finalFYANG, 'FYANG SMITH_delta', colors.fyang)
    addDotWithLabel(finalWILL, 'WILL ASHLEY_delta', colors.will)
  }, [selectedDelta])

  useEffect(() => {
    if (scrollRef.current && width > 0) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth
    }
  }, [width])

  return (
    <SectionContainer>
      <div className="flex flex-col items-center">
        <h2 className="text-color-foreground text-center text-xl leading-tight font-extrabold sm:text-xl">
          Momentum Chart (Gained votes every 5 mins)
        </h2>
        <p className="text-center text-xs italic">Scroll sideways to see other data.</p>
        {/* Legend */}
        <div className="mt-1 flex gap-4">
          <div className="flex items-center gap-1">
            <span
              style={{ backgroundColor: colors.will }}
              className="inline-block h-3 w-3 rounded-full"
            ></span>
            <span className="text-color-foreground text-xs">Will</span>
          </div>
          <div className="flex items-center gap-1">
            <span
              style={{ backgroundColor: colors.fyang }}
              className="inline-block h-3 w-3 rounded-full"
            ></span>
            <span className="text-color-foreground text-xs">Fyang</span>
          </div>
        </div>
      </div>

      <div ref={scrollRef} style={{ overflowX: 'scroll', width: '100%' }}>
        <svg ref={svgRef} width={width} height={300}></svg>
      </div>
    </SectionContainer>
  )
}
