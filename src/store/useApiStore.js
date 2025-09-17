import { create } from 'zustand'
import { snapshotDates } from '@/data/api'

export const useApiStore = create((set, get) => ({
  isLoading: true,
  combinedData: null,
  combinedDelta: null,
  dailySnapshots: {},
  selectedDate: snapshotDates.at(-1) || null,
  finalSnapshot: null,
  selectedDelta: () => {
    const state = get()

    if (!state.selectedDate) {
      return null
    }
    return state.dailySnapshots[state.selectedDate]?.combinedDelta || null
  },
  selectedGapMovement: () => {
    const state = get()

    if (!state.selectedDate) {
      return null
    }
    return state.dailySnapshots[state.selectedDate]?.gapMovement || null
  },
  selectedCombinedData: () => {
    const state = get()

    if (!state.selectedDate) {
      return null
    }
    return state.dailySnapshots[state.selectedDate]?.combinedData || null
  },

  setApiState: (newState) => set(newState),
  setDailySnapshot: ({ date, times, gapMovement, combinedDelta, combinedData }) =>
    set((state) => ({
      dailySnapshots: {
        ...state.dailySnapshots,
        [date]: {
          times,
          gapMovement,
          combinedDelta,
          combinedData,
        },
      },
    })),
}))
