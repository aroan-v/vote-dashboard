import React from 'react'
import styles from './TotalVotesSection.module.css'
import useData from '@/hooks/useData'
import { generateRandomMillion } from '@/lib/generateRandomMillion'
import Spinner from '../Spinner'
import { SETTINGS } from '@/data/settings'
import { PAGE_DETAILS } from '@/data/generalDetails'
import { cn } from '@/lib/utils'
import NumberFlowContainer from '../NumberFlowContainer'
import NightCard from '../NightCard'

function TotalVotesSection() {
  let { isLoading, isPrimaryPlayerLeading, primaryPlayerDisplayName, primaryPlayerTotalVotes } =
    useData()

  primaryPlayerTotalVotes = primaryPlayerTotalVotes || 0

  // Tester for NumberFlow
  const [randomMillion, setRandomMillion] = React.useState(1349059)
  React.useEffect(() => {
    const id = window.setInterval(() => {
      setRandomMillion(generateRandomMillion())
    }, 1000 * 10)

    return () => {
      window.clearInterval(id)
    }
  }, [])

  // For testing purposes
  // Comment out everything when done
  isLoading = SETTINGS.forceLoadingState
  isPrimaryPlayerLeading = SETTINGS.forceWinningState

  return (
    <section className="text-card-foreground relative isolate flex min-h-[175px] flex-col items-center justify-center gap-4 rounded-lg border p-4 shadow-md">
      <h3>{PAGE_DETAILS.totalVoteCountHeader}</h3>

      <NumberFlowContainer fontSize="2.5rem" value={primaryPlayerTotalVotes} />

      <NightCard />
    </section>
  )
}

export default TotalVotesSection
