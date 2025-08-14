import { create } from 'zustand'
import { combine } from 'zustand/middleware'

export const useDataStore = create(combine())
