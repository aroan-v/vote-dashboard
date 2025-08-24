import React from 'react'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../ui/table'
import SectionContainer from '../SectionContainer'
import { useDataStore } from '@/store/dataStore'
import { GENERAL_DETAILS } from '@/data/generalDetails'

function VoteDeltaSection() {
  const fiveMinuteVoteMovement = useDataStore((state) => state.fiveMinuteVoteMovement)
  const [rowsToShow, setRowsToShow] = React.useState(24) // default 12

  const handleLoadMore = () => {
    setRowsToShow((prev) => prev + 12) // load next 12 rows
  }

  // Slice the data to show only latest 'rowsToShow' entries
  const visibleRows = fiveMinuteVoteMovement?.slice(0, rowsToShow)
  return (
    <SectionContainer className="max-h-[600px] overflow-y-scroll">
      <div className="flex flex-col items-center">
        <h2 className="text-color-foreground text-center text-xl leading-tight font-extrabold sm:text-xl">
          Gained Votes Tracker
        </h2>
        <p className="text-center text-sm italic">Scroll sideways to see other candidates.</p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            {GENERAL_DETAILS.candidateNames.map((name) => (
              <TableHead key={name}>{name}</TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {visibleRows?.map((obj, index) => {
            return (
              <TableRow key={obj.time}>
                <TableCell>{obj.time}</TableCell>
                {GENERAL_DETAILS.candidateNames.map((name) => {
                  const isPrimaryPlayer = name === GENERAL_DETAILS.primaryPlayerDisplayName

                  return (
                    <TableCell
                      key={name}
                      isGreen={isPrimaryPlayer && obj.greatestGainer === name}
                      isRed={!isPrimaryPlayer && obj.greatestGainer === name}
                    >
                      {obj[`${name}_delta`] > 0 ? '+' + obj[`${name}_delta`].toLocaleString() : '-'}
                    </TableCell>
                  )
                })}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      {rowsToShow < (fiveMinuteVoteMovement?.length || 0) && (
        <div className="bg-muted/50 mt-2 flex w-full items-center justify-between rounded p-4 text-center align-middle">
          <span className="text-left text-xs">
            Showing {visibleRows.length} out of{' '}
            <span className="text-nowrap">{fiveMinuteVoteMovement?.length} entries</span>
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

export default VoteDeltaSection
