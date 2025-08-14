'use client'
import Image from 'next/image'
import PageHeader from '@/components/PageHeader'
import { HEADER_CONTENT } from '@/data/header'
import ThemePreview from '@/components/ThemePreview'
import useData from '@/hooks/useData'
import GapCounterSection from '@/components/GapCounterSection'
import SplineChartSection from '@/components/SplineChartSection'
import NegativeAreaChartSection from '@/components/NegativeAreaChartSection'
import GapHistory from '@/components/GapHistory'
import TotalVotesSection from '@/components/TotalVotesSection'

export default function Home() {
  const { lastApiUpdate } = useData()

  return (
    <div className="min-h-screen space-y-8 p-4 pb-20 font-sans sm:p-20">
      <PageHeader content={HEADER_CONTENT} />

      <div className="flex flex-col items-center justify-center">
        <h2 className="text-color-foreground text-xl leading-tight font-extrabold sm:text-2xl">
          Vote stats
        </h2>
        <p>as of {lastApiUpdate}</p>
      </div>
      <TotalVotesSection />
      <GapCounterSection />
      <GapHistory />
      <SplineChartSection />
      <NegativeAreaChartSection />
      <ThemePreview />
    </div>
  )
}
