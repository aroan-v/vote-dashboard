import React from 'react'
import NumberFlowContainer from '../NumberFlowContainer'
import Image from 'next/image'
import { cn } from '@/lib/utils'

function HotCard({ isHot, votes, name, src, gains }) {
  return (
    <div
      className={cn(
        `bg-background relative flex h-[135px] w-full rounded-md border lg:flex-row ${isHot ? 'animate-pulse-glow border-red-500' : ''}`
      )}
    >
      {/* Image Section */}
      {src && (
        <div className="h-full">
          <Image
            src={src}
            alt="Hero banner"
            width={2048}
            height={2560}
            sizes="100px"
            className="h-full w-auto object-cover"
            priority
          />
        </div>
      )}

      {/* Triangle Ribbon (only if hot) */}
      {isHot && (
        <div className="absolute top-0 right-0 h-0 w-0 border-t-[60px] border-l-[60px] border-t-red-600 border-l-transparent">
          <span className="absolute -top-[50px] -right-[0px] rotate-45 text-center text-[10px] leading-none font-bold text-white">
            Top Gainer
          </span>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        <h2 className="text-xl font-bold">{name}</h2>
        <NumberFlowContainer value={votes} />
        <NumberFlowContainer
          enablePlusSign={true}
          value={gains}
          className={`text-lg font-normal text-green-500`}
        />
      </div>
    </div>
  )
}

export default HotCard
