import phTime from '@/lib/getPhTime'
import { PARTICIPANT_NAMES } from '@/data/votingDetails'
import { GENERAL_DETAILS } from '@/data/generalDetails'

function processData(data) {
  const lastUpdated = phTime(data?.updated)
  const participantData = Object.entries(data?.participants || {}).map(([key, obj]) => ({
    name: PARTICIPANT_NAMES[key] || 'Unknown',
    ...obj,
  }))

  const primaryPlayer = participantData.find(
    ({ name }) => name === GENERAL_DETAILS.primaryPlayerNameInApi
  )
  const enemyPlayer = participantData.find(
    ({ name }) => name === GENERAL_DETAILS.enemyPlayerNameInApi
  )

  const gapBetweenPrimaryAndEnemy = primaryPlayer.count - enemyPlayer.count

  const isPrimaryPlayerLeading = gapBetweenPrimaryAndEnemy > 0

  const primaryPlayerTotalVotes = primaryPlayer.count

  return {
    lastUpdated,
    participantData,
    primaryPlayer,
    enemyPlayer,
    gapBetweenPrimaryAndEnemy,
    isPrimaryPlayerLeading,
    primaryPlayerTotalVotes,
  }
}

export default processData
