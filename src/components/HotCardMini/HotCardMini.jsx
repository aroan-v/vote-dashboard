import React from 'react'
import NumberFlowContainer from '../NumberFlowContainer'
import Image from 'next/image'
import { cn } from '@/lib/utils'

function HotCardMini({ isHot, votes, name, placement, src, gains }) {
  return (
    <div
      className={cn(
        `bg-card/60 relative flex h-[100px] w-full rounded-md lg:flex-row ${isHot ? 'bg-indigo-900/50' : ''}`
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
        <div className="absolute top-0 right-0 h-0 w-0 border-t-[60px] border-l-[60px] border-t-indigo-600 border-l-transparent">
          <span className="absolute -top-[50px] -right-[0px] rotate-45 text-center text-[10px] leading-none font-bold text-white">
            Top Gainer
          </span>
        </div>
      )}

      {/* Placement Number (Bottom-Right) */}
      {placement && (
        <div
          className={`absolute right-3 bottom-2 text-3xl font-extrabold italic ${isHot ? 'text-indigo-500' : 'text-gray-800'}`}
        >
          #{placement}
        </div>
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col items-start justify-center pl-4">
        <h2 className="text-md truncate font-bold">{name}</h2>
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

export default HotCardMini
