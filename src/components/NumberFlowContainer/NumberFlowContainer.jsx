import React from 'react'
import NumberFlow, { continuous } from '@number-flow/react'
import { cn } from '@/lib/utils'

function NumberFlowContainer({ enablePlusSign, value, className }) {
  const isValidValue = Number.isFinite(value)

  return (
    <div>
      {isValidValue ? (
        <span className={cn('text-xl font-bold', className)}>
          {enablePlusSign && value > 0 && '+'}
          <NumberFlow plugins={[continuous]} value={value} />
        </span>
      ) : (
        '-'
      )}
    </div>
  )
}

export default NumberFlowContainer
