// store/useRecordedVotes.js
import { create } from 'zustand'

const getTodayKey = () => {
  const today = new Date()
  return today.toLocaleDateString() // e.g., "8/26/2025"
}

export const useRecordedVotes = create((set, get) => ({
  dailyRecordedVotes: 0,
  totalRecordedVotes: 0,
  lastRecordedDate: getTodayKey(),

  // Increment counters
  addVote: () => {
    const todayKey = getTodayKey()
    const { dailyRecordedVotes, totalRecordedVotes, lastRecordedDate } = get()

    let newDaily = dailyRecordedVotes

    // reset daily counter if date changed
    if (todayKey !== lastRecordedDate) {
      newDaily = 0
    }

    const updatedDaily = newDaily + 1
    const updatedTotal = totalRecordedVotes + 1

    // persist to localStorage
    localStorage.setItem(
      'voteCounters',
      JSON.stringify({
        dailyRecordedVotes: updatedDaily,
        totalRecordedVotes: updatedTotal,
        lastRecordedDate: todayKey,
      })
    )

    // update store
    set({
      dailyRecordedVotes: updatedDaily,
      totalRecordedVotes: updatedTotal,
      lastRecordedDate: todayKey,
    })
  },

  // Hydrate from localStorage on mount
  hydrate: () => {
    const stored = localStorage.getItem('voteCounters')
    if (stored) {
      set(JSON.parse(stored))
    }
  },

  // Optional: reset daily counter manually
  resetDaily: () => {
    const todayKey = getTodayKey()
    set({ dailyRecordedVotes: 0, lastRecordedDate: todayKey })
    localStorage.setItem(
      'voteCounters',
      JSON.stringify({ ...get(), dailyRecordedVotes: 0, lastRecordedDate: todayKey })
    )
  },
}))
