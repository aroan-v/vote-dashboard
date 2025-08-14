import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import { GENERAL_DETAILS } from '@/data/generalDetails'

export const useDataStore = create((set) => ({
  data: null,
  error: null,
  isLoading: null,
  lastApiUpdate: '--',
  primaryPlayerData: null,
  allParticipantsData: null,
  enemyPlayerData: null,
  gapBetweenPrimaryAndEnemy: null,
  isPrimaryPlayerLeading: false,
  primaryPlayerDisplayName: GENERAL_DETAILS.primaryPlayerDisplayName,
  enemyPlayerDisplayName: GENERAL_DETAILS.enemyPlayerDisplayName,
  primaryPlayerTotalVotes: null,

  // State setter
  setState: (newState) => set(newState),
}))
