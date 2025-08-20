import fetcher from '@/lib/fetcher'
import React from 'react'
import useSWR from 'swr'
import { API } from '@/data/api'
import { GENERAL_DETAILS } from '@/data/generalDetails'

import { useDataStore } from '@/store/dataStore'
import votesData from '@/data/votesData.json' // Path relative to this file
import getPhTime from '@/lib/getPhTime'

// function useData() {
//   // const { data, error, isLoading } = useSWR(API.endpoint, fetcher, {
//   //   refreshInterval: 1000, // This will poll the API every second.
//   // })
//   let data = null

//   const setState = useDataStore((state) => state.setState)

//   React.useEffect(() => {
//     console.log(votesData)
//     let savedTime = null

//     const intervalId = window.setInterval(() => {
//       const currentPhTime = getPhTime()

//       if (savedTime === currentPhTime) {
//         return
//       }

//       savedTime = currentPhTime
//       const latestDataIndex = votesData.findIndex(({ time }) => time === currentPhTime)
//       const processedGroupData = processTotalFakeData(votesData.slice(0, latestDataIndex + 1))

//       console.log(latestDataIndex)

//       setState({
//         isLoading: false,
//         lastApiUpdate: savedTime,
//         gapBetweenPrimaryAndEnemy: processedGroupData.gapBetweenPrimaryAndEnemy,
//         isPrimaryPlayerLeading: processedGroupData.isPrimaryPlayerLeading,
//         primaryPlayerDisplayName: processedGroupData.primaryPlayerDisplayName,
//         enemyPlayerDisplayName: processedGroupData.enemyPlayerDisplayName,
//         primaryPlayerTotalVotes: processedGroupData.primaryPlayerTotalVotes,
//         fiveMinuteGapMovement: processedGroupData.fiveMinuteGapMovement,
//       })
//     }, 1000)

//     return () => {
//       window.clearInterval(intervalId)
//     }
//   }, [])

//   // React.useEffect(() => {
//   //   console.log(data)
//   //   if (data) {
//   //     const processedData = processData(data)
//   //     console.log(processedData)
//   //     setState({
//   //       data,
//   //       error,
//   //       isLoading: false,
//   //       lastApiUpdate: processedData.lastUpdated,
//   //       allParticipantsData: processedData.participantData,
//   //       primaryPlayerData: processedData.primaryPlayer,
//   //       enemyPlayerData: processedData.enemyPlayer,
//   //       gapBetweenPrimaryAndEnemy: processedData.gapBetweenPrimaryAndEnemy,
//   //       isPrimaryPlayerLeading: processedData.isPrimaryPlayerLeading,
//   //       primaryPlayerDisplayName: GENERAL_DETAILS.primaryPlayerDisplayName,
//   //       enemyPlayerDisplayName: GENERAL_DETAILS.enemyPlayerDisplayName,
//   //       primaryPlayerTotalVotes: processedData.primaryPlayerTotalVotes,
//   //     })
//   //   }
//   // }, [data])
// }

// export default useData
