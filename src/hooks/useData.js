import fetcher from '@/lib/fetcher'
import React from 'react'
import useSWR from 'swr'
import { API } from '@/data/api'
import { GENERAL_DETAILS } from '@/data/generalDetails'
import processData from './processData'
import { useDataStore } from '@/store/dataStore'

function useData() {
  const { data, error, isLoading } = useSWR(API.endpoint, fetcher, {
    refreshInterval: 1000, // This will poll the API every second.
  })

  const setState = useDataStore((state) => state.setState)

  React.useEffect(() => {
    console.log(data)
    if (data) {
      const processedData = processData(data)
      console.log(processedData)
      setState({
        data,
        error,
        isLoading,
        lastApiUpdate: processedData.lastUpdated,
        allParticipantsData: processedData.participantData,
        primaryPlayerData: processedData.primaryPlayer,
        enemyPlayerData: processedData.enemyPlayer,
        gapBetweenPrimaryAndEnemy: processedData.gapBetweenPrimaryAndEnemy,
        isPrimaryPlayerLeading: processedData.isPrimaryPlayerLeading,
        primaryPlayerDisplayName: GENERAL_DETAILS.primaryPlayerDisplayName,
        enemyPlayerDisplayName: GENERAL_DETAILS.enemyPlayerDisplayName,
        primaryPlayerTotalVotes: processedData.primaryPlayerTotalVotes,
      })
    }
  }, [data])
}

export default useData
