import React from 'react'
import { SETTINGS } from '@/data/settings'
import { PAGE_DETAILS } from '@/data/generalDetails'
import NumberFlowContainer from '../NumberFlowContainer'
import NightCard from '../NightCard'
import { useDataStore } from '@/store/dataStore'

function TotalVotesSection() {
  let isLoading = useDataStore((state) => state.isLoading)
  let isPrimaryPlayerLeading = useDataStore((state) => state.isPrimaryPlayerLeading)
  let primaryPlayerTotalVotes = useDataStore((state) => state.primaryPlayerTotalVotes)

  isLoading = false
  primaryPlayerTotalVotes = isLoading ? 0 : primaryPlayerTotalVotes

  // For testing purposes
  // Comment out everything when done
  isLoading = SETTINGS.forceLoadingState
  isPrimaryPlayerLeading = SETTINGS.forceWinningState

  return (
    <section className="text-card-foreground relative isolate flex min-h-[175px] flex-col items-center justify-center gap-4 rounded-lg border p-4 shadow-md">
      <h3>{PAGE_DETAILS.totalVoteCountHeader}</h3>
      <NumberFlowContainer fontSize="2.5rem" value={primaryPlayerTotalVotes} />
      {/* <NightCard /> */}
    </section>
  )
}

export default TotalVotesSection
