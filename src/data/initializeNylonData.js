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
  let data
  try {
    data = await fetcher(API.endpoint)

    if (lastSavedTime === data.times.at(-1)) {
      return
    }

    lastSavedTime = data.times.at(-1)

    const { fiveMinuteGapMovement, lastVotesSnapshot } = computeDeltaHistory(data)
    console.log('setting lastVotesSnapshot:')
    console.log(lastVotesSnapshot)
    stateSetter({
      fiveMinuteGapMovement: fiveMinuteGapMovement,
      lastVotesSnapshot: lastVotesSnapshot,
    })
  } catch (error) {
    console.error('Error fetching data', error)
  }
}

function computeDeltaHistory(data) {
  const deltaData = {}
  const { voteIncrements, times } = data
  const voteMovement = []
  const lastVotesSnapshot = {}
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

  // Part 2: Find the greatest gainer for each time interval
  // We need to determine the number of time intervals, which is times.length - 1
  const timeStamps = times.length - 1

  for (let i = 0; i < timeStamps; i++) {
    let maxDelta = -Infinity
    let greatestGainer = null
    const candidateDeltas = {}

    let primaryPlayerVotes = null
    let allOtherPlayerVotes = []

    // Loop through each candidate to find the one with the highest delta for the current interval
    for (const candidate in deltaData) {
      if (Object.prototype.hasOwnProperty.call(deltaData, candidate)) {
        // Access the delta at the current index 'i'
        const currentDelta = deltaData[candidate][i]

        // Compare and update the greatest gainer
        if (currentDelta > maxDelta) {
          maxDelta = currentDelta
          greatestGainer = candidate
        }
        candidateDeltas[`${candidate}_delta`] = currentDelta

        // Get gap movement between primary and enemy
        if (candidate === GENERAL_DETAILS.primaryPlayerNameInApi) {
          primaryPlayerVotes = voteIncrements[candidate][i]
        } else {
          allOtherPlayerVotes.push(voteIncrements[candidate][i])
        }
      }
    }

    // Store the result for this interval
    voteMovement.push({
      time: convertToPhTime(times[i + 1]), // Use the ending time of the interval
      greatestGainer,
      gapMovement: primaryPlayerVotes - Math.max(...allOtherPlayerVotes),
      delta: maxDelta,
      ...candidateDeltas,
    })
  }
  // Part 3: Find the delta of gap movement
  for (let i = 1; i < voteMovement.length; i++) {
    const currentInterval = voteMovement[i]
    const previousInterval = voteMovement[i - 1]

    // Calculate how much the gap changed since the previous interval
    currentInterval.gapDelta = currentInterval.gapMovement - previousInterval.gapMovement
  }

  // For the first interval, there is no previous interval, so we can default it to 0
  if (voteMovement.length > 0) {
    voteMovement[0].gapDelta = 0
  }

  console.log(voteMovement)

  return {
    fiveMinuteGapMovement: voteMovement.reverse(),
    lastVotesSnapshot,
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
