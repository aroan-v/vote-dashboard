import { create } from 'zustand'

export const useApiStore = create((set) => ({
  combinedData: null,
  combinedDelta: null,

  // State setter
  setApiState: (newState) => set(newState),
}))
