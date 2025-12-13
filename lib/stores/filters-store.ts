import { create } from 'zustand'

interface FiltersState {
  searchQuery: string
  statusFilter: string
  dateRange: { from: Date | null; to: Date | null }
  setSearchQuery: (query: string) => void
  setStatusFilter: (status: string) => void
  setDateRange: (range: { from: Date | null; to: Date | null }) => void
  clearFilters: () => void
}

export const useFiltersStore = create<FiltersState>((set) => ({
  searchQuery: '',
  statusFilter: 'all',
  dateRange: { from: null, to: null },
  setSearchQuery: (query) => set({ searchQuery: query }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setDateRange: (range) => set({ dateRange: range }),
  clearFilters: () => set({
    searchQuery: '',
    statusFilter: 'all',
    dateRange: { from: null, to: null },
  }),
}))
