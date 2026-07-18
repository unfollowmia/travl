import { create } from 'zustand';
import type { Passenger } from './useReservationStore';

export interface SavedPassenger extends Passenger {
  id: string;
  savedAt: string;
}

interface PassengerState {
  passengers: SavedPassenger[];

  addPassenger: (passenger: Omit<SavedPassenger, 'id' | 'savedAt'>) => void;
  removePassenger: (id: string) => void;
  updatePassenger: (id: string, updates: Partial<SavedPassenger>) => void;
}

export const usePassengerStore = create<PassengerState>((set) => ({
  passengers: [],

  addPassenger: (passenger) =>
    set((state) => ({
      passengers: [
        ...state.passengers,
        {
          ...passenger,
          id: Date.now().toString(),
          savedAt: new Date().toISOString(),
        },
      ],
    })),

  removePassenger: (id) =>
    set((state) => ({
      passengers: state.passengers.filter((p) => p.id !== id),
    })),

  updatePassenger: (id, updates) =>
    set((state) => ({
      passengers: state.passengers.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    })),
}));
