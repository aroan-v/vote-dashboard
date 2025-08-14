import React from 'react'
import { cn } from '@/lib/utils'

function SectionContainer({ className, children }) {
  return (
    <section
      className={cn(
        'text-card-foreground flex min-h-[175px] flex-col items-center justify-center gap-4 rounded-lg border p-4 shadow-md',
        className
      )}
    >
      {children}
    </section>
  )
}

export default SectionContainer
