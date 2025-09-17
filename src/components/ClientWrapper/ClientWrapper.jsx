'use client'
import React from 'react'
import { useNylonData } from '@/data/initializeNylonData'

function ClientWrapper({ children }) {
  useNylonData()
  // const addVote = useRecordedVotes((state) => state.addVote)

  // Legacy
  // React.useEffect(() => {
  //   const handleMessage = (event) => {
  //     if (!event.data) return

  //     if (event.data.type === 'vote') {
  //       addVote()
  //     }
  //   }

  //   window.addEventListener('message', handleMessage)
  //   return () => window.removeEventListener('message', handleMessage)
  // }, [addVote])

  return <>{children}</>
}

export default ClientWrapper
