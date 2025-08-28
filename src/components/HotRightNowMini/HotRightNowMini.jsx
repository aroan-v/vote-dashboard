import React from 'react'
import SectionContainer from '../SectionContainer'
import { HotCard } from '../HotRightNowSection'
import HotCardMini from '../HotCardMini'
import { HotCardSkeleton } from '../HotRightNowSection'
import { Label } from '../ui/label'
import { Switch } from '../ui/switch'

import { useDataStore } from '@/store/dataStore'
import { GENERAL_DETAILS } from '@/data/generalDetails'

function HotRightNowMini() {
  const allParticipantsData = useDataStore((state) => state.allParticipantsData)
  const isLoading = useDataStore((state) => state.isLoading)

  // 🔥 local state to toggle
  const [showTopOnly, setShowTopOnly] = React.useState(false)

  // find greatest gainer
  const greatestGainer = Math.max(
    ...(allParticipantsData ?? []).map((p) => p.deltaFromLastSnapshot || 0)
  )

  // check if more than one participant has the top delta
  const moreThanOneGainer =
    (allParticipantsData ?? []).filter((p) => p.deltaFromLastSnapshot === greatestGainer).length > 1

  // ✂️ apply slicing depending on state
  const displayedData = showTopOnly
    ? (allParticipantsData ?? []).slice(0, 2)
    : (allParticipantsData ?? [])

  return (
    <SectionContainer className="h-[350px] w-full max-w-sm justify-start overflow-scroll border-2 border-indigo-700 p-2">
      {/* Toggle Button */}
      {/* <div className="flex items-center justify-end gap-2 p-2">
        <Label htmlFor="showTopOnly" className="text-sm">
          {showTopOnly ? 'Show top 2 only' : 'Show all'}
        </Label>
        <Switch
          id="showTopOnly"
          checked={showTopOnly}
          onCheckedChange={() => setShowTopOnly((prev) => !prev)}
        />
      </div> */}
      {/* Loading skeletons */}
      {isLoading &&
        (showTopOnly
          ? GENERAL_DETAILS.candidateNames?.slice(0, 2).map((_, i) => <HotCardSkeleton key={i} />)
          : GENERAL_DETAILS.candidateNames?.map((_, i) => <HotCardSkeleton key={i} />))}

      {/* Participant cards */}
      {displayedData.map(({ name, src, votes, deltaFromLastSnapshot }, index) => (
        <HotCardMini
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

export default HotRightNowMini
