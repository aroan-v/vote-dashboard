import fetcher from '@/lib/fetcher'
import useSWR from 'swr'
import { API } from '@/data/api'
import { GENERAL_DETAILS } from '@/data/generalDetails'
import processData from './processData'

function useData() {
  const { data, error, isLoading } = useSWR(API.endpoint, fetcher, {
    refreshInterval: 1000, // This will poll the API every second.
  })

  let lastApiUpdate = 'Loading...'
  let participantData = {}
  let primaryPlayer
  let enemyPlayer
  let gapBetweenPrimaryAndEnemy
  let isPrimaryPlayerLeading
  let primaryPlayerTotalVotes

  if (data) {
    const processedData = processData(data)
    lastApiUpdate = processedData.lastUpdated
    participantData = processedData.participantData
    primaryPlayer = processedData.primaryPlayer
    enemyPlayer = processedData.enemyPlayer
    gapBetweenPrimaryAndEnemy = processedData.gapBetweenPrimaryAndEnemy
    isPrimaryPlayerLeading = processedData.isPrimaryPlayerLeading
    primaryPlayerTotalVotes = processedData.primaryPlayerTotalVotes
  }

  return {
    data,
    error,
    isLoading,
    lastApiUpdate,
    primaryPlayer,
    participantData,
    enemyPlayer,
    gapBetweenPrimaryAndEnemy,
    isPrimaryPlayerLeading: false,
    primaryPlayerDisplayName: GENERAL_DETAILS.primaryPlayerDisplayName,
    enemyPlayerDisplayName: GENERAL_DETAILS.enemyPlayerDisplayName,
    primaryPlayerTotalVotes,
  }
}

export default useData
