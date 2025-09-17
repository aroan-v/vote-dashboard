'use client'
import React, { useRef, useEffect } from 'react'
import { useApiStore } from '@/store/useApiStore'
import * as d3 from 'd3'
import SectionContainer from '../SectionContainer'

function transformData(apiData) {
  const { times, voteIncrements } = apiData

  const participants = ['FYANG SMITH', 'WILL ASHLEY']

  return times.map((t, i) => ({
    timestamp: d3.isoParse(t),
    FYANG: voteIncrements['FYANG SMITH'][i],
    WILL: voteIncrements['WILL ASHLEY'][i],
  }))
}

export default function VoteLineChart({ apiData }) {
  const svgRef = useRef()
  const rawData = useApiStore((state) => (state.selectedDate ? state.selectedCombinedData() : null))
  const [width, setWidth] = React.useState(0)
  const height = 300 // your desired chart height

  const scrollRef = useRef(null)

  // ==========================
  // COLORS
  // ==========================
  const colors = {
    fyang: '#9e2a2f',
    will: '#0097d3',
    text: '#fff',
    grid: '#888',
    shade1: '#061637',
    shade2: '#0d186e',
  }

  useEffect(() => {
    if (!rawData || rawData.length === 0) return

    // Parse timestamp
    const data = transformData(rawData)

    // rest of my code

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove() // clear previous chart

    // ==========================
    // SETUP
    // ==========================
    const height = 300
    const maxYValue = d3.max(data, (d) => Math.max(d.FYANG, d.WILL))
    const formattedMax = d3.format('.2~s')(maxYValue)
    const approxLabelWidth = formattedMax.length * 8 // ~8px per character
    const formatNumber = d3.format('.2~s') // "~" trims insignificant trailing zeros // ".2s" = SI prefix, 2 significant digits

    const margin = {
      top: 20,
      right: 40 + approxLabelWidth, // add extra space for right axis labels
      bottom: 40,
      left: 60,
    }

    const [minTime, maxTime] = d3.extent(data, (d) => d.timestamp)
    const hours = (maxTime - minTime) / (1000 * 60 * 60)
    const widthPerHour = 60
    const width = Math.max(1000, hours * widthPerHour)
    setWidth(width)

    // X scale
    const x = d3
      .scaleTime()
      .domain([minTime, maxTime])
      .range([margin.left, width - margin.right])

    // Y scale (votes)
    const y = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => Math.min(d.FYANG, d.WILL)),
        d3.max(data, (d) => Math.max(d.FYANG, d.WILL)),
      ])
      .nice()
      .range([height - margin.bottom, margin.top])

    // Line generators
    const lineFYANG = d3
      .line()
      .x((d) => x(d.timestamp))
      .y((d) => y(d.FYANG))

    const lineWILL = d3
      .line()
      .x((d) => x(d.timestamp))
      .y((d) => y(d.WILL))

    // ==========================
    // AXES
    // ==========================
    // X-axis
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

    // Right Y-axis with formatted ticks
    svg
      .append('g')
      .attr('transform', `translate(${width - margin.right},0)`)
      .call(
        d3.axisRight(y).tickFormat((d) => formatNumber(d)) // format tick labels
      )

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
            .attr('stroke', '#88888855') // semi-transparent grey
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
      .attr('cy', (d) => y(d.FYANG))
      .attr('r', 1)
      .attr('fill', colors.fyang)

    svg
      .selectAll('.dot-will')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot-will')
      .attr('cx', (d) => x(d.timestamp))
      .attr('cy', (d) => y(d.WILL))
      .attr('r', 1)
      .attr('fill', colors.will)

    // ==========================
    // DAILY GRID & SHADING
    // ==========================
    const allDates = d3.timeDay.range(
      d3.min(data, (d) => d.timestamp),
      d3.max(data, (d) => d.timestamp)
    )

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
    // DOTS
    // ==========================

    const hourlyData = data.filter((d) => d.timestamp.getMinutes() === 0)
    const labelPadding = 4 // px padding around text

    // --- FYANG dots ---
    svg
      .selectAll('.dotFY')
      .data(hourlyData)
      .join('circle')
      .attr('class', 'dotFY')
      .attr('cx', (d) => x(d.timestamp))
      .attr('cy', (d) => y(d.FYANG))
      .attr('r', 4)
      .attr('fill', colors.fyang)

    // --- FYANG labels with red box ---
    const fyLabels = svg
      .selectAll('.labelFY-group')
      .data(hourlyData)
      .join('g')
      .attr('class', 'labelFY-group')
      .attr('transform', (d) => `translate(${x(d.timestamp)}, ${y(d.FYANG) - 12})`)

    // Text first to measure width
    fyLabels
      .append('text')
      .attr('class', 'textFY')
      .attr('x', 0)
      .attr('y', 0)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', 10)
      .attr('fill', colors.text)
      .text((d) => formatNumber(d.FYANG))
      .each(function (d) {
        const bbox = this.getBBox() // measure text
        d.bboxWidth = bbox.width
        d.bboxHeight = bbox.height
      })

    // Rect behind text
    fyLabels
      .insert('rect', 'text')
      .attr('x', (d) => -d.bboxWidth / 2 - labelPadding)
      .attr('y', (d) => -d.bboxHeight / 2 - labelPadding)
      .attr('width', (d) => d.bboxWidth + labelPadding * 2)
      .attr('height', (d) => d.bboxHeight + labelPadding * 2)
      .attr('rx', 3)
      .attr('fill', colors.fyang)
      .attr('opacity', 0.8)

    // --- WILL dots ---
    svg
      .selectAll('.dotWILL')
      .data(hourlyData)
      .join('circle')
      .attr('class', 'dotWILL')
      .attr('cx', (d) => x(d.timestamp))
      .attr('cy', (d) => y(d.WILL))
      .attr('r', 4)
      .attr('fill', colors.will)

    // --- WILL labels with blue box ---
    const willLabels = svg
      .selectAll('.labelWILL-group')
      .data(hourlyData)
      .join('g')
      .attr('class', 'labelWILL-group')
      .attr('transform', (d) => `translate(${x(d.timestamp)}, ${y(d.WILL) - 12})`)

    willLabels
      .append('text')
      .attr('class', 'textWILL')
      .attr('x', 0)
      .attr('y', 0)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', 10)
      .attr('fill', colors.text)
      .text((d) => formatNumber(d.WILL))
      .each(function (d) {
        const bbox = this.getBBox()
        d.bboxWidth = bbox.width
        d.bboxHeight = bbox.height
      })

    willLabels
      .insert('rect', 'text')
      .attr('x', (d) => -d.bboxWidth / 2 - labelPadding)
      .attr('y', (d) => -d.bboxHeight / 2 - labelPadding)
      .attr('width', (d) => d.bboxWidth + labelPadding * 2)
      .attr('height', (d) => d.bboxHeight + labelPadding * 2)
      .attr('rx', 3)
      .attr('fill', colors.will)
      .attr('opacity', 0.8)

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
      .y1((d) => y(d.FYANG))

    const areaWILL = d3
      .area()
      .x((d) => x(d.timestamp))
      .y0(height - margin.bottom)
      .y1((d) => y(d.WILL))

    svg.append('path').datum(data).attr('fill', 'url(#fyang-gradient)').attr('d', areaFYANG)
    svg.append('path').datum(data).attr('fill', 'url(#will-gradient)').attr('d', areaWILL)
  }, [rawData])

  useEffect(() => {
    if (scrollRef.current && width > 0) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth
    }
  }, [width])

  return (
    <SectionContainer>
      <div className="flex flex-col items-center">
        <h2 className="text-color-foreground text-center text-xl leading-tight font-extrabold sm:text-xl">
          Overall Votes Chart
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
        <svg ref={svgRef} width={width} height={height}></svg>
      </div>
    </SectionContainer>
  )
}
