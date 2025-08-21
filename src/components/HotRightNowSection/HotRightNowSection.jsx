import React from 'react'
import SectionContainer from '../SectionContainer'
import { HotCard } from '.'

import { useDataStore } from '@/store/dataStore'

function HotRightNowSection() {
  const allParticipantsData = useDataStore((state) => state.allParticipantsData)
  const lastSnapshotDate = useDataStore((state) => state.lastSnapshotDate)

  const greatestGainer = Math.max(
    ...(allParticipantsData ?? []).map((p) => p.deltaFromLastSnapshot || 0)
  )

  // Check if more than one participant has the top delta
  const moreThanOneGainer =
    (allParticipantsData ?? []).filter((p) => p.deltaFromLastSnapshot === greatestGainer).length > 1

  return (
    <SectionContainer className="min-w-[350px]">
      <p className="pb-6 text-center italic">
        <span className="font-bold text-red-500">Top Gainer:</span>
        &nbsp; This person has gained{' '}
        <span className="text-nowrap"> the most votes since {lastSnapshotDate}</span>
      </p>
      {allParticipantsData?.map(({ name, src, votes, deltaFromLastSnapshot }) => (
        <HotCard
          key={name}
          isHot={
            deltaFromLastSnapshot === greatestGainer && greatestGainer > 0 && !moreThanOneGainer
          }
          name={name}
          src={src}
          votes={votes}
          gains={deltaFromLastSnapshot}
        />
      ))}
    </SectionContainer>
  )
}

export default HotRightNowSection
