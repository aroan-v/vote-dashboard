import React, { useEffect } from 'react'
import { useDataStore } from '@/store/dataStore'
import { GENERAL_DETAILS } from '@/data/generalDetails'
import getPhTime from '@/lib/getPhTime'

function processVotes(votes, stateSetter, lastVotesSnapshot) {
  // Find the primary player's data
  const primaryPlayerName = GENERAL_DETAILS.primaryPlayerNameInApi
  const primaryPlayerVotes = votes[primaryPlayerName]

  // Convert the votes object into an array for easier sorting and filtering
  const allParticipants = Object.entries(votes)
    .map(([name, count]) => {
      const src = GENERAL_DETAILS.candidateProperties.find(
        ({ name: pName, src }) => pName === name
      ).src

      // Compute the delta from last snapshot
      let deltaFromLastSnapshot = null

      if (lastVotesSnapshot) {
        deltaFromLastSnapshot = Math.max(count - lastVotesSnapshot[name], 0)
      }

      return { name, src, votes: count, deltaFromLastSnapshot }
    })
    .sort((a, b) => b.votes - a.votes)

  console.log(allParticipants)

  // Find the highest-voted enemy by excluding the primary player
  const otherParticipants = allParticipants.filter(
    (participant) => participant.name !== primaryPlayerName
  )

  const enemyPlayerData = otherParticipants.reduce(
    (highest, current) => {
      return current.votes > highest.votes ? current : highest
    },
    { name: null, votes: -1 }
  )

  // Calculate the gap and determine who is leading
  const gapBetweenPrimaryAndEnemy = Math.abs(primaryPlayerVotes - enemyPlayerData.votes)
  const isPrimaryPlayerLeading = primaryPlayerVotes > enemyPlayerData.votes

  // Update the Zustand store using the provided setState method
  stateSetter({
    isLoading: false,
    enemyPlayerData,
    allParticipantsData: allParticipants,
    gapBetweenPrimaryAndEnemy,
    enemyPlayerDisplayName: enemyPlayerData.name,
    isPrimaryPlayerLeading,
    primaryPlayerTotalVotes: primaryPlayerVotes,
    lastApiUpdate: getPhTime(),
  })
}

function NylonVotesSection() {
  const [isClient, setIsClient] = React.useState(false)
  const setState = useDataStore((state) => state.setState)
  const lastVotesSnapshot = useDataStore((state) => state.lastVotesSnapshot)

  React.useEffect(() => {
    setIsClient(true)
  }, [])

  React.useEffect(() => {
    const handleMessage = (event) => {
      // It's crucial to verify the origin in a real app to prevent security vulnerabilities
      // For this example, we'll skip it, but production code should check event.origin

      // Check if the message is from your iframe and has the correct type
      if (event.data && event.data.type === 'poll-data') {
        const { votes } = event.data
        // Update the Zustand store with the received data
        // setVotes(votes)

        processVotes(votes, setState, lastVotesSnapshot)
      }
    }

    // Add the event listener for messages
    window.addEventListener('message', handleMessage)

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [lastVotesSnapshot])

  return (
    <div className="hidden">
      {/* 3. Conditionally render the iframe only when isClient is true. */}
      {isClient && (
        <iframe
          src="/poll.html" // Path to your local HTML file
          title="Polldaddy Poll"
          width="100%"
          height="600"
        >
          <p>Your browser does not support iframes.</p>
        </iframe>
      )}
    </div>
  )
}

export default NylonVotesSection
