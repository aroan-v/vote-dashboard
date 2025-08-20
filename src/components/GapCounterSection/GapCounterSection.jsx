import React from 'react'
import NumberFlow, { continuous } from '@number-flow/react'
import useData from '@/hooks/useData'
import { generateRandomMillion } from '@/lib/generateRandomMillion'
import Spinner from '../Spinner'
import { SETTINGS } from '@/data/settings'
import SectionContainer from '../SectionContainer'
import { useDataStore } from '@/store/dataStore'

function GapCounterSection({ gap }) {
  let isLoading = useDataStore((state) => state.isLoading)
  let isPrimaryPlayerLeading = useDataStore((state) => state.isPrimaryPlayerLeading)
  const primaryPlayerDisplayName = useDataStore((state) => state.primaryPlayerDisplayName)
  const enemyPlayerDisplayName = useDataStore((state) => state.enemyPlayerDisplayName)
  let gapBetweenPrimaryAndEnemy = useDataStore((state) => state.gapBetweenPrimaryAndEnemy)

  // Tester for NumberFlow
  // const [randomMillion, setRandomMillion] = React.useState(1349059)
  // React.useEffect(() => {
  //   const id = window.setInterval(() => {
  //     setRandomMillion(generateRandomMillion())
  //   }, 1000 * 10)

  //   return () => {
  //     window.clearInterval(id)
  //   }
  // }, [])

  // For testing purposes
  // Comment out everything when done
  // isLoading = SETTINGS.forceLoadingState
  // isPrimaryPlayerLeading = SETTINGS.forceWinningState

  return (
    <SectionContainer className="bg-gradient-to-br from-red-600/50 to-gray-900">
      <HeaderWrapper
        isLoading={isLoading}
        primaryPlayerDisplayName={primaryPlayerDisplayName}
        enemyPlayerDisplayName={enemyPlayerDisplayName}
        isPrimaryPlayerLeading={isPrimaryPlayerLeading}
      />
      <div className="flex min-h-[2rem] flex-col justify-center">
        {isLoading && <Spinner size={48} />}
        {!isLoading && (
          <>
            <NumberFlow
              plugins={[continuous]}
              style={{
                color: '#ffffff', // Tailwind's gray-600 equivalent
                fontSize: '2.25rem', // Tailwind's text-xl equivalent (20px)
                fontWeight: '700',
                fontVariantNumeric: 'tabular-nums', // this enforces fixed-width digits
              }}
              value={gapBetweenPrimaryAndEnemy}
            />
          </>
        )}
      </div>
      <FooterWrapper
        isLoading={isLoading}
        primaryPlayerDisplayName={primaryPlayerDisplayName}
        enemyPlayerDisplayName={enemyPlayerDisplayName}
        isPrimaryPlayerLeading={isPrimaryPlayerLeading}
      />
    </SectionContainer>
  )
}

export default GapCounterSection

function LeadingHeader({ primaryPlayerName = 'Primary Player', enemyPlayerName = 'Enemy Player' }) {
  return (
    <p className="text-center">
      <strong>{primaryPlayerName}</strong> is leading{' '}
      <span className="whitespace-nowrap">
        against <strong>{enemyPlayerName}</strong> with:
      </span>
    </p>
  )
}

function LeadingFooter() {
  return <p>Keep voting and widen the gap!</p>
}

function LosingHeader() {
  return <p className="text-center">We're losing. We need: </p>
}

function LosingFooter({ primaryPlayerName = 'Primary Player', enemyPlayerName = 'Enemy Player' }) {
  return (
    <p className="text-center">
      votes for <strong>{primaryPlayerName}</strong> to overtake <strong>{enemyPlayerName}</strong>
    </p>
  )
}

function HeaderWrapper({
  isLoading,
  primaryPlayerDisplayName = 'Primary Player',
  enemyPlayerDisplayName = 'Enemy Player',
  isPrimaryPlayerLeading,
}) {
  if (isLoading) {
    return <p className="text-muted-foreground text-center italic"> Loading... </p>
  }

  return isPrimaryPlayerLeading ? (
    <LeadingHeader
      primaryPlayerName={primaryPlayerDisplayName}
      enemyPlayerName={enemyPlayerDisplayName}
    />
  ) : (
    <LosingHeader />
  )
}

function FooterWrapper({
  isLoading,
  primaryPlayerDisplayName = 'Primary Player',
  enemyPlayerDisplayName = 'Enemy Player',
  isPrimaryPlayerLeading,
}) {
  if (isLoading) {
    return <p className="text-muted-foreground text-center">--</p>
  }

  return isPrimaryPlayerLeading ? (
    <LeadingFooter />
  ) : (
    <LosingFooter
      primaryPlayerName={primaryPlayerDisplayName}
      enemyPlayerName={enemyPlayerDisplayName}
    />
  )
}
