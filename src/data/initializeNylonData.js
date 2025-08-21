import { API } from './api'
import fetcher from '@/lib/fetcher'
import { convertToPhTime } from '@/lib/convertToPhTime'
import { useDataStore } from '@/store/dataStore'
import { GENERAL_DETAILS } from './generalDetails'

let lastSavedTime = null
let intervalId = null
let versionControlInterval = null
let latestVersion = null

async function fetchNylonData(stateSetter) {
  let todayData
  let yesterdayData
  try {
    // Fetch today's data
    const TODAY = new Date().toISOString().slice(0, 10)
    todayData = await fetcher(API.appendEndpoint(TODAY))

    if (lastSavedTime === todayData.times.at(-1)) {
      return
    }

    // Fetch yesterday's data
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const YESTERDAY = yesterday.toISOString().slice(0, 10)
    yesterdayData = await fetcher(API.appendEndpoint(YESTERDAY))
  } catch (error) {
    console.error('Error fetching data', error)
  }

  // Combine data from today and yesterday
  const combinedData = {}

  combinedData.times = [...yesterdayData.times, ...todayData.times]
  let combinedVoteIncrements = {}

  for (const candidate of Object.keys(todayData.voteIncrements)) {
    combinedVoteIncrements[candidate] = [
      ...(yesterdayData.voteIncrements[candidate] || []),
      ...(todayData.voteIncrements[candidate] || []),
    ]
  }

  combinedData.voteIncrements = combinedVoteIncrements

  console.log(combinedData)

  // Update time snapshot tracker
  lastSavedTime = todayData.times.at(-1)

  const { fiveMinuteVoteMovement, lastVotesSnapshot, fiveMinuteGapMovement } =
    computeDeltaHistory(combinedData)

  stateSetter({
    fiveMinuteVoteMovement: fiveMinuteVoteMovement,
    lastVotesSnapshot: lastVotesSnapshot,
    fiveMinuteGapMovement,
    lastSnapshotDate: convertToPhTime(lastSavedTime),
  })
}

function computeDeltaHistory(data) {
  const deltaData = {}
  const { voteIncrements, times } = data
  const voteMovement = []
  const lastVotesSnapshot = {}
  const gapHistory = []
  const primaryPlayer = GENERAL_DETAILS.primaryPlayerNameInApi
  // const setState = useDataStore((state) => state.setState)

  // Part 1: Compute Deltas for all candidates
  for (const candidate in voteIncrements) {
    if (Object.prototype.hasOwnProperty.call(voteIncrements, candidate)) {
      const votes = voteIncrements[candidate]
      const deltas = []

      for (let i = 1; i < votes.length; i++) {
        const delta = votes[i] - votes[i - 1]
        deltas.push(delta)
      }

      deltaData[candidate] = deltas
      lastVotesSnapshot[candidate] = votes.at(-1)
    }
  }

  // Part 2: Compute how the gap moved
  gapHistory.push({
    time: convertToPhTime(times[0]),
    gapMovement: 'Base',
  })

  for (let i = 1; i < times.length; i++) {
    let primaryPlayerVotes = null
    let otherPlayerVotes = []

    for (const candidate in voteIncrements) {
      if (Object.prototype.hasOwnProperty.call(voteIncrements, candidate)) {
        if (candidate === primaryPlayer) {
          primaryPlayerVotes = voteIncrements[candidate][i]
        } else {
          otherPlayerVotes.push(voteIncrements[candidate][i])
        }
      }
    }

    // Compute for the delta between the current and previous gap movement
    let currentGap = primaryPlayerVotes - Math.max(...otherPlayerVotes)
    let previousGap = gapHistory[i - 1]?.gapMovement

    gapHistory.push({
      time: convertToPhTime(times[i]),
      gapMovement: currentGap,
      gapDelta: currentGap - previousGap,
    })
  }

  // Part 3: Find the greatest gainer for each time interval
  // Also find how the gap moved and its increments in each time interval

  const timeStamps = times.length - 1

  for (let i = 0; i < timeStamps; i++) {
    let maxDelta = -Infinity
    let greatestGainer = null
    const candidateDeltas = {}

    // Loop through each candidate to find the one with the highest delta for the current interval
    for (const candidate in deltaData) {
      if (Object.prototype.hasOwnProperty.call(deltaData, candidate)) {
        const currentDelta = deltaData[candidate][i]

        if (currentDelta > maxDelta) {
          maxDelta = currentDelta
          greatestGainer = candidate
        }
        candidateDeltas[`${candidate}_delta`] = currentDelta
      }
    }

    // Store the result for this interval
    voteMovement.push({
      time: convertToPhTime(times[i + 1]), // end of interval timestamp
      greatestGainer,
      delta: maxDelta,
      ...candidateDeltas,
    })
  }

  return {
    fiveMinuteVoteMovement: voteMovement.reverse(),
    lastVotesSnapshot,
    fiveMinuteGapMovement: gapHistory.reverse(),
  }
}

async function checkVersionControl() {
  try {
    const data = await fetcher(API.versionControl)

    if (latestVersion === null) {
      latestVersion = data.appVersion
      console.log('no version saved, saving', data.appVersion)
      return
    }
    if (data.appVersion === latestVersion) {
      return
    }
    console.log('new version detected!')

    window.location.reload()
  } catch (error) {
    console.error('Version check failed:', error)
  }
}

export async function initializeNylonData(stateSetter) {
  if (intervalId || versionControlInterval) {
    clearInterval(intervalId)
    clearInterval(versionControlInterval)
  }

  intervalId = setInterval(() => fetchNylonData(stateSetter), 1000)
  versionControlInterval = setInterval(checkVersionControl, 1000 * 60)
}
