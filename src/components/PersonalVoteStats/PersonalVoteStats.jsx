import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { HeartIcon, ChartLineUpIcon, ChartPieIcon } from '@phosphor-icons/react'
import { useRecordedVotes } from '@/store/useRecordedVotes'
import styled, { keyframes } from 'styled-components'
import Image from 'next/image'

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

// get current date in readable format
const today = new Date().toLocaleDateString(undefined, {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

export default function VoteStats({}) {
  const dailyRecordedVotes = useRecordedVotes((state) => state.dailyRecordedVotes)
  const totalRecordedVotes = useRecordedVotes((state) => state.totalRecordedVotes)

  return (
    <Card className="h-[350px] w-full max-w-sm rounded-xl border-2 border-sky-400 bg-none shadow-md">
      {/* Header */}
      <CardHeader className="flex flex-col items-center justify-center gap-2">
        <div className="mx-auto w-[150px]">
          <Image
            src="/nylon-logo.svg" // from /public folder
            alt="Nylon Logo"
            width={3443}
            height={590}
          />
        </div>
        <h2 className="text-lg font-bold">Boldest Breakout Star</h2>
        <p className="text-center text-sm italic">
          {'Your stats may look different across browsers.'}
        </p>
      </CardHeader>

      {/* Content / Stats */}
      <CardContent className="flex w-full gap-4 text-center">
        {/* Daily Votes */}
        <div className="border-outline bg-card flex flex-1 flex-col items-center gap-1 rounded-lg border p-3">
          <HeartIcon size={28} weight="fill" className="text-red-500" />
          <p className="mt-2 text-xl font-semibold">
            <FlashingSpan key={dailyRecordedVotes}>
              {dailyRecordedVotes.toLocaleString()}
            </FlashingSpan>
          </p>
          <p className="text-xs opacity-70">
            Votes Sent <br /> Today
          </p>
        </div>

        {/* Total Votes */}
        <div className="border-outline bg-card flex flex-1 flex-col items-center gap-1 rounded-lg border p-3">
          <ChartLineUpIcon size={28} weight="duotone" className="text-blue-400" />
          <p className="mt-2 text-xl font-semibold">{totalRecordedVotes.toLocaleString()}</p>
          <p className="text-xs opacity-70">
            Overall Votes <br /> Sent
          </p>
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="text-md justify-center opacity-75">
        Votes add up — yours included. 🩵
      </CardFooter>
    </Card>
  )
}
