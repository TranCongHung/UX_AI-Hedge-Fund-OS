import { create } from 'zustand';

interface AppState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  rightPanelOpen: boolean;
  toggleRightPanel: () => void;
  activePanel: string | null;
  setActivePanel: (panel: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  rightPanelOpen: false,
  toggleRightPanel: () => set((state) => ({ rightPanelOpen: !state.rightPanelOpen })),
  activePanel: null,
  setActivePanel: (panel) => set({ activePanel: panel }),
}));
