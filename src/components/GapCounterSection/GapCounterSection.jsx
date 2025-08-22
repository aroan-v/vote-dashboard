import React from 'react'
import NumberFlow, { continuous } from '@number-flow/react'
import Spinner from '../Spinner'
import { useDataStore } from '@/store/dataStore'
import styled from 'styled-components'
import Image from 'next/image'
import { cn } from '@/lib/utils'

const StyledWrapper = styled.div`
  .card {
    --white: hsl(0, 0%, 100%);
    --black: hsl(240, 15%, 9%);
    --paragraph: hsl(0, 0%, 83%);
    --line: hsl(240, 9%, 17%);
    --primary: hsl(266, 92%, 58%);

    position: relative;
    display: flex;
    width: 100%;
    border-radius: 0.5rem;
    box-shadow: 0px -16px 24px 0px rgba(255, 255, 255, 0.25) inset;
  }

  .card.loading {
    background-color: hsla(240, 15%, 9%, 1); /* neutral dark */
    background-image:
      radial-gradient(at 88% 40%, hsla(240, 15%, 9%, 1) 0px, transparent 85%),
      radial-gradient(at 49% 30%, hsla(240, 15%, 9%, 1) 0px, transparent 85%),
      radial-gradient(at 14% 26%, hsla(240, 15%, 9%, 1) 0px, transparent 85%),
      radial-gradient(at 0% 64%, hsla(240, 20%, 15%, 1) 0px, transparent 85%),
      radial-gradient(at 41% 94%, hsla(240, 25%, 20%, 1) 0px, transparent 85%),
      radial-gradient(at 100% 99%, hsla(240, 30%, 25%, 1) 0px, transparent 85%);
    transition: background 0.4s ease; /* smooth transition */
  }

  .card.losing {
    background-color: hsla(0, 20%, 8%, 1); /* dark, ominous base */
    background-image:
      radial-gradient(at 88% 40%, hsla(0, 20%, 8%, 1) 0px, transparent 85%),
      radial-gradient(at 49% 30%, hsla(0, 20%, 8%, 1) 0px, transparent 85%),
      radial-gradient(at 14% 26%, hsla(0, 20%, 8%, 1) 0px, transparent 85%),
      /* Fiery reds */ radial-gradient(at 0% 64%, hsla(0, 95%, 55%, 1) 0px, transparent 85%),
      /* bright scarlet */ radial-gradient(at 41% 94%, hsla(10, 90%, 50%, 1) 0px, transparent 85%),
      /* glowing ember */ radial-gradient(at 100% 99%, hsla(0, 100%, 40%, 1) 0px, transparent 85%); /* deep danger red */
  }

  /* Leading (baby blue + cyan) */
  .card.leading {
    background-color: hsla(200, 15%, 9%, 1);
    background-image:
      radial-gradient(at 88% 40%, hsla(200, 15%, 9%, 1) 0px, transparent 85%),
      radial-gradient(at 49% 30%, hsla(200, 15%, 9%, 1) 0px, transparent 85%),
      radial-gradient(at 14% 26%, hsla(200, 15%, 9%, 1) 0px, transparent 85%),
      radial-gradient(at 0% 64%, hsla(195, 93%, 56%, 1) 0px, transparent 85%),
      radial-gradient(at 41% 94%, hsla(185, 100%, 70%, 1) 0px, transparent 85%),
      radial-gradient(at 100% 99%, hsla(180, 100%, 65%, 1) 0px, transparent 85%);
  }
`

function GapCounterSection() {
  let isLoading = useDataStore((state) => state.isLoading)
  let isPrimaryPlayerLeading = useDataStore((state) => state.isPrimaryPlayerLeading)
  const primaryPlayerDisplayName = useDataStore((state) => state.primaryPlayerDisplayName)
  const enemyPlayerDisplayName = useDataStore((state) => state.enemyPlayerDisplayName)
  let gapBetweenPrimaryAndEnemy = useDataStore((state) => state.gapBetweenPrimaryAndEnemy)

  return (
    <StyledWrapper>
      <div
        className={cn(
          'card',
          isLoading
            ? 'loading' // new case: while null/loading
            : isPrimaryPlayerLeading
              ? 'leading'
              : 'losing'
        )}
      >
        <div className="relative min-w-[100px] flex-1">
          <div className="animate-short-bounce absolute bottom-0 left-0 h-[120px] translate-x-5 -translate-y-7 -bg-conic-150 opacity-85 sm:h-[150px] sm:translate-x-10 sm:-translate-y-0 lg:h-[180px]">
            {!isLoading && (
              <Image
                src="/will-sticker.png"
                alt="Will Ashley Sticker"
                width={887}
                height={1114}
                sizes="(max-width: 640px) 120px, (max-width: 1024px) 160px, 200px"
                className="h-full w-auto object-cover"
                priority
              />
            )}
          </div>
        </div>
        <div className="flex-3 p-6">
          <HeaderWrapper
            isLoading={isLoading}
            primaryPlayerDisplayName={primaryPlayerDisplayName}
            enemyPlayerDisplayName={enemyPlayerDisplayName}
            isPrimaryPlayerLeading={isPrimaryPlayerLeading}
          />
          <div className="flex min-h-[2rem] flex-col items-center justify-center">
            {isLoading && <Spinner size={48} />}
            {!isLoading && (
              <>
                <NumberFlow
                  plugins={[continuous]}
                  style={{
                    color: '#ffffff', // Tailwind's gray-600 equivalent
                    fontSize: '3rem', // Tailwind's text-xl equivalent (20px)
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
        </div>
      </div>
    </StyledWrapper>
  )
}

export default GapCounterSection

function LeadingHeader({ primaryPlayerName = 'Primary Player', enemyPlayerName = 'Enemy Player' }) {
  return (
    <p className="text-center leading-tight text-shadow-md/30">
      <strong>{primaryPlayerName}</strong> is leading{' '}
      <span className="whitespace-nowrap">
        against <strong className="text-nowrap">{enemyPlayerName}</strong> with:
      </span>
    </p>
  )
}

function LeadingFooter() {
  return (
    <p className="text-center leading-tight text-shadow-md/30">Keep voting and widen the gap!</p>
  )
}

function LosingHeader() {
  return <p className="text-center text-shadow-md/30">{"We're losing. We need:"}</p>
}

function LosingFooter({ primaryPlayerName = 'Primary Player', enemyPlayerName = 'Enemy Player' }) {
  return (
    <p className="text-center leading-tight text-shadow-md/30">
      votes for <strong>{primaryPlayerName}</strong> to overtake{' '}
      <span className="text-nowrap">
        <strong>{enemyPlayerName}</strong>
      </span>
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
