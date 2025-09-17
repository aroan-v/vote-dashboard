import React from 'react'
import SectionContainer from '../SectionContainer'
import { HotCard } from '.'
import styled, { keyframes } from 'styled-components'
import { useDataStore } from '@/store/dataStore'
import { useApiStore } from '@/store/useApiStore'
import { HotCardSkeleton } from '.'
import { GENERAL_DETAILS } from '@/data/generalDetails'

const instantFlash = keyframes`
  0% { color: white; }
  1% { color: cyan; } /* Instant jump to orange */
  99% { color: cyan; } /* Hold orange for almost the entire duration */
  100% { color: white; } /* Instant return to white */
`

const FlashingSpan = styled.span`
  display: inline-block;
  font-weight: 700;
  animation: ${instantFlash} 1.5s steps(1) forwards;
`

function HotRightNowSection() {
  const finalSnapshot = useApiStore((state) => state.finalSnapshot)
  const lastSnapshotDate = useDataStore((state) => state.lastSnapshotDate)
  const lastApiUpdate = useDataStore((state) => state.lastApiUpdate)
  const isLoading = useApiStore((state) => state.isLoading)
  const hasData = finalSnapshot

  const greatestGainer = Math.max(...(finalSnapshot ?? []).map((p) => p.deltaFromLastSnapshot || 0))

  const moreThanOneGainer =
    (finalSnapshot ?? []).filter((p) => p.deltaFromLastSnapshot === greatestGainer).length > 1

  return (
    <SectionContainer className="min-w-[350px] border-none p-0">
      {/* {hasData ? (
        <Header lastApiUpdate={lastApiUpdate} lastSnapshotDate={lastSnapshotDate} />
      ) : (
        <HeaderSkeleton />
      )} */}

      {isLoading &&
        GENERAL_DETAILS.candidateNames.map((_, index) => <HotCardSkeleton key={index} />)}

      {finalSnapshot?.map(({ name, src, votes, deltaFromLastSnapshot = 0 }, index) => (
        <HotCard
          key={name}
          isHot={
            deltaFromLastSnapshot === greatestGainer && greatestGainer > 0 && !moreThanOneGainer
          }
          isWinner={name === 'FYANG SMITH'}
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
        <FlashingSpan key={`lastSnapshotDate` + lastSnapshotDate}>
          {lastSnapshotDate}
        </FlashingSpan>{' '}
        to {/* Use the FlashingSpan component with a key */}
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
