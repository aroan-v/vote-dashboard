import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import { GENERAL_DETAILS } from '@/data/generalDetails'

export const useDataStore = create((set) => ({
  data: null,
  error: null,
  isLoading: true,
  lastApiUpdate: '--',
  lastSnapshotDate: '--',
  primaryPlayerData: null,
  allParticipantsData: null,
  enemyPlayerData: null,
  gapBetweenPrimaryAndEnemy: 0,
  isPrimaryPlayerLeading: false,
  fiveMinuteVoteMovement: null,
  fiveMinuteGapMovement: null,

  lastVotesSnapshot: null,
  votesGainedAfterLastSnapshot: null,

  primaryPlayerDisplayName: GENERAL_DETAILS.primaryPlayerDisplayName,
  enemyPlayerDisplayName: GENERAL_DETAILS.enemyPlayerDisplayName,
  primaryPlayerTotalVotes: null,

  // State setter
  setState: (newState) => set(newState),
}))
