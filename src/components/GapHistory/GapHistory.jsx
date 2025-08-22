import React from 'react'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from '../ui/table'
import SectionContainer from '../SectionContainer'
import { useDataStore } from '@/store/dataStore'

function GapHistory() {
  const fiveMinuteGapMovement = useDataStore((state) => state.fiveMinuteGapMovement)
  const [rowsToShow, setRowsToShow] = React.useState(24) // default 12

  const handleLoadMore = () => {
    setRowsToShow((prev) => prev + 12) // load next 12 rows
  }

  // Slice the data to show only latest 'rowsToShow' entries
  const visibleRows = fiveMinuteGapMovement?.slice(0, rowsToShow)

  return (
    <SectionContainer className="max-h-[600px] overflow-y-scroll">
      <div className="flex flex-col items-center">
        <h2 className="text-color-foreground text-center text-xl leading-tight font-extrabold sm:text-xl">
          Gap History
        </h2>
        <p className="text-center text-sm italic">
          <span className="text-green-600">Green</span> update is favorable to Will
        </p>
      </div>
      <Table>
        <TableCaption>Gap movement over time</TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>Gap Movement</TableHead>
            <TableHead>Change in Gap</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {visibleRows?.map((obj, index) => {
            const isLeading = obj.gapMovement > 0

            // 8:25 - 8:30 AM
            // previous gap: -79,031
            //  new gap: -81,289 (bad)
            // movement: -2,249 (bad)

            // 8:25 - 8:30 AM
            // previous gap: -79,031
            //  new gap: -78,031(bad)
            // movement: 1,000 (good)

            const goodMovement = (isLeading && obj.gapDelta > 0) || (!isLeading && obj.gapDelta > 0)
            const gapDecreased = obj.gapDelta < 0

            return (
              <TableRow key={obj.time}>
                <TableCell>{obj.time}</TableCell>
                <TableCell isGreen={isLeading} isRed={!isLeading}>
                  {`${Math.abs(obj.gapMovement)}`}
                </TableCell>
                <TableCell
                  isGreen={goodMovement && obj.gapDelta !== 0}
                  isRed={!goodMovement && obj.gapDelta !== 0}
                >
                  {obj.gapDelta === 0
                    ? '0'
                    : `${gapDecreased ? '↑' : '↓'} ${Math.abs(obj.gapDelta)}`}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      {/* Load More button */}
      {rowsToShow < (fiveMinuteGapMovement?.length || 0) && (
        <div className="bg-muted/50 mt-2 flex w-full items-center justify-between rounded p-4 text-center align-middle">
          <span className="text-left text-xs">
            Showing {visibleRows.length} out of{' '}
            <span className="text-nowrap">{fiveMinuteGapMovement?.length} entries</span>
          </span>
          <button
            className="bg-muted rounded px-4 py-2 text-xs text-white hover:bg-[#1A3BE0]/50"
            onClick={handleLoadMore}
          >
            Load More Entries
          </button>
        </div>
      )}
    </SectionContainer>
  )
}

export default GapHistory
