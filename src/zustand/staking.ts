import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface StakingState {
  stakedAmount: string | null
  stakedDenom: string | null
  lastUpdated: number | null
  setStakedAmount: (amount: string, denom: string) => void
  clearStakedAmount: () => void
}

export const useStakingStore = create<StakingState>()(
  persist(
    (set) => ({
      stakedAmount: null,
      stakedDenom: null,
      lastUpdated: null,
      setStakedAmount: (amount: string, denom: string) => 
        set({ 
          stakedAmount: amount, 
          stakedDenom: denom, 
          lastUpdated: Date.now() 
        }),
      clearStakedAmount: () => 
        set({ 
          stakedAmount: null, 
          stakedDenom: null, 
          lastUpdated: null 
        }),
    }),
    {
      name: 'staking-storage',
    }
  )
)
