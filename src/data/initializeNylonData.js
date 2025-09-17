import React from 'react'
import { API, snapshotDates } from './api'
import fetcher from '@/lib/fetcher'
import { GENERAL_DETAILS } from './generalDetails'
import getPhTime from '@/lib/getPhTime'
import { convertToPhTime } from '@/lib/convertToPhTime'
import { useRecordedVotes } from '@/store/useRecordedVotes'
import { useApiStore } from '@/store/useApiStore'

let lastSavedTime = null
let latestVersion = null

export function useNylonData() {
  const hydrate = useRecordedVotes((state) => state.hydrate)
  const setApiState = useApiStore((state) => state.setApiState)
  const setDailySnapshot = useApiStore((state) => state.setDailySnapshot)
  const lastVoteSnapshotRef = React.useRef(null)

  React.useEffect(() => {
    // fetch data once on mount
    fetchGithubData(setApiState, lastVoteSnapshotRef, setDailySnapshot)

    // hydrate & start polling initially
    hydrate()

    // start version control polling
    const versionIntervalId = setInterval(checkVersionControl, 1000 * 60)

    // cleanup
    return () => clearInterval(versionIntervalId)
  }, [])
}

async function fetchGithubData(setApiState, lastVoteSnapshotRef, setDailySnapshot) {
  let data = []
  try {
    data = await Promise.all(
      snapshotDates.map(async (date) => await fetcher(API.appendEndpoint(date)))
    )
  } catch (error) {
    console.error('Error fetching data', error)
  }

  let finalSnapshot = null

  // Group the data according to the date in PH time.
  const groupedByDay = ((data) => {
    const grouped = {}

    data.forEach(({ times, voteIncrements }) => {
      times.forEach((utcTime, index) => {
        // Convert to PH local date string (YYYY-MM-DD)
        const phDate = new Date(utcTime).toLocaleDateString('en-CA', { timeZone: 'Asia/Manila' }) // en-CA → YYYY-MM-DD format

        // Initialize group if not exists
        if (!grouped[phDate]) {
          grouped[phDate] = { times: [], voteIncrements: {} }
        }

        // Push timestamp
        grouped[phDate].times.push(utcTime)

        // For each participant
        for (const participant in voteIncrements) {
          if (voteIncrements.hasOwnProperty(participant)) {
            grouped[phDate].voteIncrements[participant] ??= []
            grouped[phDate].voteIncrements[participant].push(voteIncrements[participant][index])
          }
        }
      })
    })

    // Merge the last two days because the last one is only has one entry
    const dates = Object.keys(grouped).sort()
    const lastDate = dates.at(-1)
    const newLastDate = dates.at(-2)
    const lastData = grouped[lastDate]
    finalSnapshot = lastData
    const newLastData = grouped[newLastDate]

    newLastData.times.push(...lastData.times)

    for (const participant in lastData.voteIncrements) {
      newLastData.voteIncrements[participant].push(...lastData.voteIncrements[participant])
    }

    delete grouped[lastDate]

    return grouped
  })(data)

  // Convert the votes object into an array for easier sorting and filtering
  const processedFinalSnapshot = Object.entries(finalSnapshot.voteIncrements)
    .map(([name, [count]]) => {
      const src = GENERAL_DETAILS.candidateProperties.find(
        ({ name: pName, src }) => pName === name
      ).src

      return { name, src, votes: count }
    })
    .sort((a, b) => b.votes - a.votes)

  // Process the data for each day
  for (const date of Object.keys(groupedByDay)) {
    console.log(date)

    const { fiveMinuteVoteMovement, fiveMinuteGapMovement } = computeDeltaHistory(
      groupedByDay[date]
    )

    setDailySnapshot({
      date,
      times: groupedByDay[date].times,
      gapMovement: fiveMinuteGapMovement,
      combinedDelta: fiveMinuteVoteMovement,
      combinedData: groupedByDay[date],
    })
  }

  setApiState({
    isLoading: false,
    finalSnapshot: processedFinalSnapshot,
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
  // Initialize gap history
  gapHistory.push({
    time: convertToPhTime(times[0]),
    currentGap: 0, // base case, no real gap yet
    gapDelta: 0,
    isPrimaryPlayerLeading: null,
    isGapMovementFavorable: null,
    displayGap: 'Base',
  })

  for (let i = 1; i < times.length; i++) {
    let primaryPlayerVotes = null
    let otherPlayerVotes = []

    // Segregate the votes, get the primaryPlayer votes in the current time iteration
    for (const candidate in voteIncrements) {
      if (Object.prototype.hasOwnProperty.call(voteIncrements, candidate)) {
        if (candidate === primaryPlayer) {
          primaryPlayerVotes = voteIncrements[candidate][i]
        } else {
          otherPlayerVotes.push(voteIncrements[candidate][i])
        }
      }
    }

    const isPrimaryPlayerLeading = primaryPlayerVotes > Math.max(...otherPlayerVotes)

    const currentGap = Math.abs(primaryPlayerVotes - Math.max(...otherPlayerVotes))

    const previousGap = gapHistory[i - 1]?.currentGap ?? currentGap
    const gapDelta = currentGap - previousGap

    // Decide if the movement is favorable
    // If leading → favorable when gapDelta > 0
    // If losing  → favorable when gapDelta < 0
    const isGapMovementFavorable = isPrimaryPlayerLeading ? gapDelta > 0 : gapDelta < 0

    // Decide arrow direction (from perspective of rawGap change)
    const arrowDirection = gapDelta === 0 ? '' : gapDelta > 0 ? '↑' : '↓'

    // Push computed snapshot
    gapHistory.push({
      time: convertToPhTime(times[i]),
      currentGap, // absolute version for display
      gapDelta, // signed difference
      displayGapDelta: Math.abs(gapDelta), // absolute for display
      isPrimaryPlayerLeading,
      isGapMovementFavorable,
      arrowDirection,
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
        } else if (currentDelta === maxDelta) {
          greatestGainer = null
        }
        candidateDeltas[`${candidate}_delta`] = currentDelta
      }
    }

    // Store the result for this interval
    voteMovement.push({
      time: convertToPhTime(times[i + 1]), // end of interval timestamp
      greatestGainer,
      rawTime: times[i + 1],
      delta: maxDelta,
      ...candidateDeltas,
    })
  }

  // Part 4: Create more intervals

  const hourlyGapMovement = []
  const hourlyVoteMovement = []
  const thirtyMinuteGapMovement = []
  const thirtyMinuteVoteMovement = []

  return {
    fiveMinuteVoteMovement: voteMovement.reverse(),
    lastVotesSnapshot,
    fiveMinuteGapMovement: gapHistory.reverse(),
    hourlyGapMovement,
    hourlyVoteMovement,
    thirtyMinuteGapMovement,
    thirtyMinuteVoteMovement,
  }
}

async function checkVersionControl() {
  try {
    const data = await fetcher(API.versionControl)

    if (latestVersion === null) {
      latestVersion = data.appVersion
      return
    }
    if (data.appVersion === latestVersion) {
      return
    }

    window.location.reload()
  } catch (error) {
    console.error('Version check failed:', error)
  }
}

async function fetchVotes(setState, lastVoteSnapshotRef) {
  try {
    const response = await fetch('https://polls.polldaddy.com/vote-js.php?p=15909793')
    const text = await response.text()
    const pollData = extractPollData(text)
    processVotes(pollData, setState, lastVoteSnapshotRef)
  } catch (err) {
    console.error('Error fetching votes:', err)
  }
}

function extractPollData(htmlString) {
  // Regex pattern for individual names and votes
  // The global 'g' flag is necessary for matchAll()
  const nameVotePattern = /title="([^"]+)"[\s\S]*?\(([\d,.]+) votes\)/g

  // Regex pattern for total votes
  const totalVotesPattern = /Total Votes: <span>([\d,.]+)<\/span>/

  const results = {}

  // Use matchAll() to get an iterator of all individual matches
  for (const match of htmlString.matchAll(nameVotePattern)) {
    // match[0] is the full match, match[1] is the first capture group (name),
    // and match[2] is the second capture group (votes).
    const name = match[1]
    const votes = match[2]

    results[name] = Number(votes.replace(/,/g, ''))
  }

  // Use match() to find the single match for total votes
  const totalVotesMatch = htmlString.match(totalVotesPattern)
  const totalVotes = totalVotesMatch ? totalVotesMatch[1] : null

  return results
}

function processVotes(votes, stateSetter, lastVotesSnapshot) {
  const lastVotesSnapshotCurrent = lastVotesSnapshot.current

  // Sample votes value:
  //   {
  //     "FYANG SMITH": 390108,
  //     "WILL ASHLEY": 350520,
  //     "ASHTINE OLVIGA": 42533,
  //     "EMILIO DAEZ": 3644,
  //     "ESNYR": 3576,
  //     "CUP OF JOE": 1998
  // }

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

      if (lastVotesSnapshotCurrent) {
        deltaFromLastSnapshot = Math.max(count - lastVotesSnapshotCurrent[name], 0)
      }

      return { name, src, votes: count, deltaFromLastSnapshot }
    })
    .sort((a, b) => b.votes - a.votes)

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
