'use client'
import Image from 'next/image'
import PageHeader from '@/components/PageHeader'
import { HEADER_CONTENT } from '@/data/header'
import ThemePreview from '@/components/ThemePreview'
import GapCounterSection from '@/components/GapCounterSection'
import SplineChartSection from '@/components/SplineChartSection'
import NegativeAreaChartSection from '@/components/NegativeAreaChartSection'
import GapHistory from '@/components/GapHistory'
import TotalVotesSection from '@/components/TotalVotesSection'
import { useDataStore } from '@/store/dataStore'
import useData from '@/hooks/useData'
import TotalVotesChart from '@/components/TotalVotesChart'
import MaterialChart from '@/components/MaterialChart'
import VoteDeltaSection from '@/components/VoteDeltaSection'
import HotRightNowSection from '@/components/HotRightNowSection'
import NylonVotesSection from '@/components/NylonVotesSection'
import { initializeNylonData } from '@/data/initializeNylonData'

export default function Home() {
  const lastApiUpdate = useDataStore((state) => state.lastApiUpdate)
  const setState = useDataStore((state) => state.setState)
  initializeNylonData(setState)

  console.log('Home page mounted')

  return (
    <div className="min-h-screen space-y-8 p-4 pb-20 font-sans sm:p-20">
      <PageHeader content={HEADER_CONTENT} />
      <NylonVotesSection />

      <div className="flex flex-col items-center justify-center">
        <h2 className="text-color-foreground text-xl leading-tight font-extrabold sm:text-2xl">
          Vote stats
        </h2>
        <p>as of {lastApiUpdate}</p>
      </div>

      {/* Desktop grid layout */}
      <div className="sm:grid sm:grid-cols-[500px_1fr] sm:gap-8">
        {/* Left column */}
        <div className="sm:sticky sm:top-20">
          <HotRightNowSection />
        </div>

        {/* Right column */}
        <div className="sm:grid sm:grid-rows-[auto_1fr] sm:gap-4">
          {/* Top: full width */}
          <GapCounterSection />

          {/* Bottom: two side-by-side */}
          <div className="sm:grid sm:grid-cols-2 sm:gap-4">
            <VoteDeltaSection />
            <GapHistory />
          </div>
        </div>
      </div>

      {/* Commented out */}
      {/* <ThemePreview /> */}
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
