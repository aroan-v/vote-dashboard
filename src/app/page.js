'use client'
import PageHeader from '@/components/PageHeader'
import { HEADER_CONTENT } from '@/data/header'
import ThemePreview from '@/components/ThemePreview'
import GapCounterSection from '@/components/GapCounterSection'
import GapHistory from '@/components/GapHistory'
import { useDataStore } from '@/store/dataStore'
import VoteDeltaSection from '@/components/VoteDeltaSection'
import HotRightNowSection from '@/components/HotRightNowSection'
import NylonVotesSection from '@/components/NylonVotesSection'
import { getPhDateTime } from '@/lib/getPhDateTime'
import { useNylonData } from '@/data/initializeNylonData'
import VoteLineChart from '@/components/VoteLineChart'
import VoteIncrementsChart from '@/components/VoteIncrementsChart'

export default function Home() {
  const lastApiUpdate = useDataStore((state) => state.lastApiUpdate)

  return (
    <div className="min-h-screen min-w-[370px] space-y-8 p-4 pb-20 font-sans sm:p-20">
      <PageHeader content={HEADER_CONTENT} />
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-color-foreground text-xl leading-tight font-extrabold sm:text-2xl">
          Vote stats
        </h2>
        <p>as of {getPhDateTime()}</p>
      </div>

      <VoteLineChart />
      <VoteIncrementsChart />

      {/* Desktop grid layout */}
      <div className="space-y-8 lg:grid lg:grid-cols-[1fr_1fr] lg:gap-8 lg:space-y-0">
        {/* Left column */}
        <div className="lg:sticky lg:top-20">
          <HotRightNowSection />
        </div>

        {/* Right column */}
        <div className="space-y-8 lg:grid lg:min-w-[600px] lg:grid-rows-[auto_1fr_auto] lg:gap-4 lg:space-y-0">
          {/* Top: full width */}
          <GapCounterSection useImage={true} />

          {/* Bottom: two side-by-side */}
          <div className="space-y-8 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
            <VoteDeltaSection />
            <GapHistory />
          </div>

          <Attribution />
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen max-w-lg space-y-8 p-4 pb-20 font-sans sm:p-20">
      <PageHeader content={HEADER_CONTENT} />
      <NylonVotesSection />

      <div className="flex flex-col items-center justify-center">
        <h2 className="text-color-foreground text-xl leading-tight font-extrabold sm:text-2xl">
          Vote stats
        </h2>
        <p>as of {lastApiUpdate}</p>
      </div>

      <HotRightNowSection />
      {/* <TotalVotesSection /> */}
      <GapCounterSection />

      <VoteDeltaSection />
      <GapHistory />

      {/* <MaterialChart /> */}
      {/* 
      <SplineChartSection /> */}
      {/* <NegativeAreaChartSection /> */}
      {/* <TotalVotesChart /> */}
      <ThemePreview />
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
