import { PARTICIPANT_NAMES } from '@/data/votingDetails'
import { GENERAL_DETAILS } from '@/data/generalDetails'
import { convertToPhTime } from '@/lib/convertToPhTime'

function processData(data) {
  const lastUpdated = convertToPhTime(data?.updated)
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

export function processTotalFakeData(groupData) {
  if (!Array.isArray(groupData)) {
    return
  }

  const primaryPlayerDisplayName = GENERAL_DETAILS.primaryPlayerDisplayName
  const enemyPlayerDisplayName = GENERAL_DETAILS.enemyPlayerDisplayName

  const primaryPlayerTotalVotes = groupData.reduce((totalSum, currentTimeSlot) => {
    return totalSum + currentTimeSlot[primaryPlayerDisplayName]
  }, 0)

  const processedData = groupData.map((entry, index, arr) => {
    const currentGap = entry[primaryPlayerDisplayName] - entry[enemyPlayerDisplayName]

    // Get previous gap (if index > 0, else 0)
    const previousGap =
      index > 0 ? arr[index - 1].candidateA - arr[index - 1].candidateB : currentGap

    const movement = currentGap - previousGap

    entry.gap = currentGap
    entry.movement = movement

    // --- DELTAS FOR ALL CANDIDATES ---
    const candidates = ['candidateA', 'candidateB', 'candidateC', 'candidateD', 'candidateE']
    let highestDelta = -Infinity
    let highestCandidate

    candidates.forEach((candidate) => {
      // If not the first entry, compute difference from previous snapshot
      const prevVotes = index > 0 ? arr[index - 1][candidate] : entry[candidate]
      const delta = entry[candidate] - prevVotes
      entry[`${candidate}_delta`] = delta

      if (delta >= highestDelta) {
        highestDelta = delta
        highestCandidate = candidate
      }
    })

    entry.highestCandidate = highestCandidate

    return entry
  })

  const hourlyInterval = processedData.filter((entry) => {
    // Extract minutes from the time string
    const [timePart, period] = entry.time.split(' ') // ["6:19", "PM"]
    const [hour, minute] = timePart.split(':') // ["6", "19"]

    // Coerce to number
    return Number(minute) === 0
  })

  const fiveMinuteInterval = processedData
    .filter((entry) => {
      // Extract minutes from the time string
      const [timePart, period] = entry.time.split(' ') // ["6:19", "PM"]
      const [hour, minute] = timePart.split(':').map(Number) // ["6", "19"]

      // Keep only if minute % 5 === 0
      return minute % 5 === 0
    })
    .slice(-20)
    .reverse()

  // Process the latest data
  const latestData = processedData.at(-1)

  const primaryPlayerLatestVotes = latestData[primaryPlayerDisplayName]
  const enemyPlayerLatestVotes = latestData[enemyPlayerDisplayName]

  const gapBetweenPrimaryAndEnemy = primaryPlayerLatestVotes - enemyPlayerLatestVotes
  const isPrimaryPlayerLeading = gapBetweenPrimaryAndEnemy > 0

  return {
    primaryPlayerTotalVotes,
    fiveMinuteVoteMovement: fiveMinuteInterval,
    primaryPlayerDisplayName,
    enemyPlayerDisplayName,
    primaryPlayerLatestVotes,
    enemyPlayerLatestVotes,
    gapBetweenPrimaryAndEnemy,
    isPrimaryPlayerLeading,
  }
}
