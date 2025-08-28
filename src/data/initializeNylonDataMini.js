import React from 'react'
import { API } from './api'
import fetcher from '@/lib/fetcher'
import { useDataStoreMini } from '@/store/useDataStoreMini'
import { GENERAL_DETAILS } from './generalDetails'
import getPhTime from '@/lib/getPhTime'
import { convertToPhTime } from '@/lib/convertToPhTime'
import { useRecordedVotes } from '@/store/useRecordedVotes'

let lastSavedTime = null
let latestVersion = null

export function useNylonDataMini() {
  const setState = useDataStoreMini((state) => state.setState)
  const hydrate = useRecordedVotes((state) => state.hydrate)
  const lastVoteSnapshotRef = React.useRef(null)
  const addVote = useRecordedVotes((state) => state.addVote)
  React.useEffect(() => {
    const handleMessage = (event) => {
      if (!event.data) return

      if (event.data.type === 'vote') {
        addVote()
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [addVote])

  React.useEffect(() => {
    console.log('initializeData mounted')
    const intervals = {}

    // --- utility: start polling ---
    const startPolling = () => {
      if (!intervals.fetch) {
        intervals.fetch = setInterval(() => fetchGithubData(setState, lastVoteSnapshotRef), 1000)
      }
      if (!intervals.version) {
        intervals.version = setInterval(checkVersionControl, 1000 * 60)
      }
      if (!intervals.htmlParse) {
        intervals.htmlParse = setInterval(() => fetchVotes(setState, lastVoteSnapshotRef), 1000 * 3)
      }
    }

    // --- utility: stop polling ---
    const stopPolling = () => {
      Object.values(intervals).forEach(clearInterval)
      Object.keys(intervals).forEach((k) => delete intervals[k])
    }

    // --- visibility handler ---
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopPolling()
      } else {
        startPolling()
      }
    }

    // attach listener
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // hydrate & start polling initially
    hydrate()
    startPolling()

    // cleanup
    return () => {
      stopPolling()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [setState, hydrate])
}

async function fetchVersionAndAuthentication(setState) {
  const res = await fetch(API.password)
  const data = await res.json()

  setState({
    serverPassword: data.password,
    currentVersion: data.version,
  })
}

// async function fetchPassword() {
//   const res = await fetch(
//     'https://raw.githubusercontent.com/aroan-v/nylon-biggest-breakout-star-cache/refs/heads/main/password.json'
//   ) // replace with your real endpoint
//   const data = await res.json()
//   setServerPassword(data.password)

//   // 2. Check if user already has valid auth in localStorage
//   const storedPassword = localStorage.getItem('auth_password')
//   if (storedPassword && storedPassword === data.password) {
//     setIsAuthenticated(true)
//   }
//   setLoading(false)
// }

async function fetchGithubData(stateSetter, lastVoteSnapshotRef) {
  let todayData
  let yesterdayData
  try {
    // Fetch today's data from Github
    const TODAY = new Date().toISOString().slice(0, 10)
    todayData = await fetcher(API.appendEndpoint(TODAY))

    if (lastSavedTime === todayData.times.at(-1)) {
      return
    }

    lastSavedTime = todayData.times.at(-1)

    // Fetch yesterday's data from Github
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

  // // Update time snapshot tracker
  // lastSavedTime = todayData.times.at(-1)

  // const hourly = { times: [], voteIncrements: []}
  // const halfHourly = { times: [], voteIncrements: [] }

  // combinedData.times.forEach((t, index) => {
  //   const d = new Date(t)
  //   const minutes = d.getUTCMinutes()

  //   if (isNearTime(minutes, 0)) {
  //     hourly.times.push(t) // near :00

  //     for

  //   } else if (isNearTime(minutes, 30)) {
  //     halfHourly.push(t) // near :30
  //   }
  // })

  const { fiveMinuteVoteMovement, lastVotesSnapshot, fiveMinuteGapMovement } =
    computeDeltaHistory(combinedData)

  lastVoteSnapshotRef.current = lastVotesSnapshot

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

    // Flag: Is primary player ahead?
    const isPrimaryPlayerLeading = primaryPlayerVotes > Math.max(...otherPlayerVotes)

    // Compute the gap: (primary - strongest opponent)
    const currentGap = Math.abs(primaryPlayerVotes - Math.max(...otherPlayerVotes))

    // Compute delta vs previous gap
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
;`1`
