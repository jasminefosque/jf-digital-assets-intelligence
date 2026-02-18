import { create } from 'zustand';
import type { Asset, Event } from '../models/schemas';

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface AppState {
  // Filters
  selectedAsset: Asset;
  dateRange: DateRange;
  showEvents: boolean;
  
  // Data
  events: Event[];
  
  // UI State
  selectedEvent: Event | null;
  isMethodologyOpen: boolean;
  
  // Actions
  setSelectedAsset: (asset: Asset) => void;
  setDateRange: (range: DateRange) => void;
  setShowEvents: (show: boolean) => void;
  setEvents: (events: Event[]) => void;
  setSelectedEvent: (event: Event | null) => void;
  setMethodologyOpen: (open: boolean) => void;
}

// Default date range: last 12 months
const getDefaultDateRange = (): DateRange => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(endDate.getFullYear() - 1);
  
  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  };
};

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  selectedAsset: 'BTC',
  dateRange: getDefaultDateRange(),
  showEvents: true,
  events: [],
  selectedEvent: null,
  isMethodologyOpen: false,
  
  // Actions
  setSelectedAsset: (asset) => set({ selectedAsset: asset }),
  setDateRange: (range) => set({ dateRange: range }),
  setShowEvents: (show) => set({ showEvents: show }),
  setEvents: (events) => set({ events }),
  setSelectedEvent: (event) => set({ selectedEvent: event }),
  setMethodologyOpen: (open) => set({ isMethodologyOpen: open }),
}));
