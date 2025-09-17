import { cn } from '@/lib/utils'
import React from 'react'
import Image from 'next/image'

function PageHeader({ className, children, content = {}, ...props }) {
  const { title = 'Page Title', description } = content

  return (
    <header className={cn('space-y-2', className)} {...props}>
      <div className="mx-auto max-w-lg">
        <Image src="/nylon-logo.svg" alt="Nylon Logo" width={3443} height={590} />
      </div>
      <h1 className="text-color-foreground text-center text-3xl leading-tight font-extrabold sm:text-4xl">
        {title}
      </h1>
      <p className="text-muted-foreground text-center leading-tight whitespace-pre-line">
        {description}
      </p>
      {children}
    </header>
  )
}

export default PageHeader
