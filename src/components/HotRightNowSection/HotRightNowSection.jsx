import React from 'react'
import SectionContainer from '../SectionContainer'
import { HotCard } from '.'
import styled, { keyframes } from 'styled-components'
import { useDataStore } from '@/store/dataStore'
import { HotCardSkeleton } from '.'
import { GENERAL_DETAILS } from '@/data/generalDetails'

const instantFlash = keyframes`
  0% { color: white; }
  1% { color: cyan; } /* Instant jump to orange */
  99% { color: cyan; } /* Hold orange for almost the entire duration */
  100% { color: white; } /* Instant return to white */
`

// Create the styled component with the new keyframes and timing
const FlashingSpan = styled.span`
  display: inline-block;
  font-weight: 700;
  animation: ${instantFlash} 1.5s steps(1) forwards;
  /* 2.5s duration (2s hold + 0.5s for the instant on/off)
    steps(1) makes the animation jump to the next keyframe instantly
    forwards keeps the final state until the animation is re-triggered
  */
`

function HotRightNowSection() {
  const allParticipantsData = useDataStore((state) => state.allParticipantsData)
  const lastSnapshotDate = useDataStore((state) => state.lastSnapshotDate)
  const lastApiUpdate = useDataStore((state) => state.lastApiUpdate)
  const isLoading = useDataStore((state) => state.isLoading)
  const hasData = allParticipantsData && lastSnapshotDate && lastApiUpdate

  const greatestGainer = Math.max(
    ...(allParticipantsData ?? []).map((p) => p.deltaFromLastSnapshot || 0)
  )

  // Check if more than one participant has the top delta
  const moreThanOneGainer =
    (allParticipantsData ?? []).filter((p) => p.deltaFromLastSnapshot === greatestGainer).length > 1

  return (
    <SectionContainer className="min-w-[350px] border-none">
      {hasData ? (
        <Header lastApiUpdate={lastApiUpdate} lastSnapshotDate={lastSnapshotDate} />
      ) : (
        <HeaderSkeleton />
      )}

      {isLoading &&
        GENERAL_DETAILS.candidateNames.map((_, index) => <HotCardSkeleton key={index} />)}

      {allParticipantsData?.map(({ name, src, votes, deltaFromLastSnapshot }, index) => (
        <HotCard
          key={name}
          isHot={
            deltaFromLastSnapshot === greatestGainer && greatestGainer > 0 && !moreThanOneGainer
          }
          name={name}
          placement={index + 1}
          src={src}
          votes={votes}
          gains={deltaFromLastSnapshot}
        />
      ))}
    </SectionContainer>
  )
}

export default HotRightNowSection

function Header({ lastSnapshotDate, lastApiUpdate }) {
  return (
    <p className="p-6 pt-0 text-center italic">
      The person with <span className="font-bold text-red-500">Top Gainer</span> gained{' '}
      <span className="text-nowrap">
        the most votes from {/* Use the FlashingSpan component with a key */}
        <FlashingSpan key={lastSnapshotDate}>{lastSnapshotDate}</FlashingSpan> to{' '}
        {/* Use the FlashingSpan component with a key */}
        <FlashingSpan key={lastApiUpdate}>{lastApiUpdate}</FlashingSpan> (PH Time)
      </span>
    </p>
  )
}

function HeaderSkeleton() {
  return (
    <p className="p-6 pt-0 text-center italic">
      The person with <span className="font-bold text-red-500">Top Gainer</span> gained{' '}
      <span className="text-nowrap">
        the most votes from {/* Skeleton for lastSnapshotDate */}
        <span className="mx-1 inline-block h-4 w-15 rounded bg-gray-300" />
        to {/* Skeleton for lastApiUpdate */}
        <span className="mx-1 inline-block h-4 w-15 rounded bg-gray-300" />
      </span>
    </p>
  )
}
