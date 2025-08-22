import React from 'react'
import { API } from './api'
import fetcher from '@/lib/fetcher'
import { convertToPhTime } from '@/lib/convertToPhTime'
import { useDataStore } from '@/store/dataStore'
import { GENERAL_DETAILS } from './generalDetails'
import getPhTime from '@/lib/getPhTime'

let lastSavedTime = null
let latestVersion = null


export function useNylonData() {
  const setState = useDataStore((state) => state.setState);

  const lastVoteSnapshotRef = React.useRef(null)

  

  React.useEffect(() => {
    const intervals = {}

    const clearAllIntervals = () => {
      Object.values(intervals).forEach(clearInterval)
    }

    intervals.fetch = setInterval(() => fetchGithubData(setState, lastVoteSnapshotRef), 1000)
    intervals.version = setInterval(checkVersionControl, 1000 * 60)
    intervals.htmlParse = setInterval(() => fetchVotes(setState,lastVoteSnapshotRef), 1000 * 3)

    return clearAllIntervals
  }, [setState])
}

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


  // Update time snapshot tracker
  lastSavedTime = todayData.times.at(-1)

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

async function fetchVotes(setState,lastVoteSnapshotRef) {
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

  console.log(votes)

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
