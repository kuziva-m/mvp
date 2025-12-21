import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface LayoutState {
  sidebarOpen: boolean
  sidebarCollapsed: boolean
  theme: 'light' | 'dark'
  toggleSidebar: () => void
  collapseSidebar: () => void
  setTheme: (theme: 'light' | 'dark') => void
}

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      sidebarCollapsed: false,
      theme: 'light',
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      collapseSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'layout-storage',
    }
  )
)
