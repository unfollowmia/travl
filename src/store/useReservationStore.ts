import { create } from 'zustand';

export type TripType = 'one-way' | 'return';

export interface Passenger {
  name: string;
  passportNumber: string;
  nationality: string;
  dateOfBirth: string;
}

export type ReservationStatus =
  | 'idle'
  | 'filling'
  | 'reviewing'
  | 'processing'
  | 'completed'
  | 'failed';

export interface ReservationState {
  departureAirport: string;
  destinationAirport: string;
  travelDate: string;
  returnDate: string;
  tripType: TripType;
  passenger: Passenger;
  status: ReservationStatus;
  pnr: string;

  setField: <K extends keyof ReservationState>(
    key: K,
    value: ReservationState[K]
  ) => void;
  setPassengerField: <K extends keyof Passenger>(
    key: K,
    value: Passenger[K]
  ) => void;
  resetReservation: () => void;
}

const initialPassenger: Passenger = {
  name: '',
  passportNumber: '',
  nationality: '',
  dateOfBirth: '',
};

const initialState = {
  departureAirport: '',
  destinationAirport: '',
  travelDate: '',
  returnDate: '',
  tripType: 'one-way' as TripType,
  passenger: { ...initialPassenger },
  status: 'idle' as ReservationStatus,
  pnr: '',
};

export const useReservationStore = create<ReservationState>((set) => ({
  ...initialState,

  setField: (key, value) =>
    set((state) => ({
      ...state,
      [key]: value,
    })),

  setPassengerField: (key, value) =>
    set((state) => ({
      ...state,
      passenger: {
        ...state.passenger,
        [key]: value,
      },
    })),

  resetReservation: () =>
    set({
      ...initialState,
      passenger: { ...initialPassenger },
    }),
}));
