'use client'
import PageHeader from '@/components/PageHeader'
import { HEADER_CONTENT } from '@/data/header'
import GapHistory from '@/components/GapHistory'
import VoteDeltaSection from '@/components/VoteDeltaSection'
import HotRightNowSection from '@/components/HotRightNowSection'
import VoteLineChart from '@/components/VoteLineChart'
import VoteIncrementsChart from '@/components/VoteIncrementsChart'
import TotalVotesSection from '@/components/TotalVotesSection'
import { snapshotDates } from '@/data/api'
import { getDate } from '@/lib/getDate'
import { useApiStore } from '@/store/useApiStore'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="min-h-screen min-w-[370px] space-y-8 p-4 pb-20 sm:p-20">
      <PageHeader content={HEADER_CONTENT} />
      <DateButtons />
      <VoteLineChart />
      <VoteIncrementsChart />
      <div className="space-y-8 lg:grid lg:grid-cols-[1fr_1fr] lg:gap-8 lg:space-y-0">
        <div className="lg:sticky lg:top-20">
          <HotRightNowSection />
        </div>

        <div className="space-y-8 lg:grid lg:min-w-[600px] lg:grid-rows-[auto_1fr_auto] lg:gap-4 lg:space-y-0">
          <TotalVotesSection useImage={true} />

          <div className="space-y-8 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
            <VoteDeltaSection />
            <GapHistory />
          </div>

          <Attribution />
        </div>
      </div>
    </div>
  )
}

function DateButtons() {
  const setApiState = useApiStore((state) => state.setApiState)
  const selectedDate = useApiStore((state) => state.selectedDate)

  return (
    <div className="flex flex-col gap-2">
      <p className="text-center font-medium">Choose a date to explore the vote snapshots</p>
      <div className="flex flex-wrap justify-center gap-2">
        {snapshotDates.map((date) => (
          <Button
            variant={selectedDate === date ? 'selected' : 'outline'}
            onClick={() => setApiState({ selectedDate: date })}
            key={date}
          >
            {getDate(date)}
          </Button>
        ))}
      </div>
    </div>
  )
}

function Attribution() {
  return (
    <div className="mx-auto">
      <p className="text-center text-sm text-gray-500 italic">
        Made with love by{' '}
        <a
          href="https://x.com/sovereignswifts"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sky-300 hover:underline"
        >
          @SovereignSwifts
        </a>{' '}
        🩵🩷
        <br />
        Message me in X / Twitter if there are bugs / problems.
      </p>
    </div>
  )
}
