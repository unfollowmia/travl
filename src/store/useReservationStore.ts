import { create } from 'zustand';
import { reservationService, type ReservationResponse } from '../services/reservation';

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
  // Form fields
  departureAirport: string;
  destinationAirport: string;
  travelDate: string;
  returnDate: string;
  tripType: TripType;
  passenger: Passenger;
  status: ReservationStatus;

  // Reservation response (populated after successful submission)
  pnr: string;
  airlineName: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  bookingReference: string;

  // Actions
  setField: <K extends keyof ReservationState>(
    key: K,
    value: ReservationState[K],
  ) => void;
  setPassengerField: <K extends keyof Passenger>(
    key: K,
    value: Passenger[K],
  ) => void;
  setReservationResponse: (response: ReservationResponse) => void;
  submitReservation: () => Promise<void>;
  resetReservation: () => void;
}

const initialPassenger: Passenger = {
  name: '',
  passportNumber: '',
  nationality: '',
  dateOfBirth: '',
};

const initialReservationFields = {
  departureAirport: '',
  destinationAirport: '',
  travelDate: '',
  returnDate: '',
  tripType: 'one-way' as TripType,
  passenger: { ...initialPassenger },
  status: 'idle' as ReservationStatus,
  pnr: '',
  airlineName: '',
  flightNumber: '',
  departureTime: '',
  arrivalTime: '',
  bookingReference: '',
};

export const useReservationStore = create<ReservationState>((set, get) => ({
  ...initialReservationFields,

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

  setReservationResponse: (response) =>
    set({
      pnr: response.pnr,
      airlineName: response.airlineName,
      flightNumber: response.flightNumber,
      departureTime: response.departureTime,
      arrivalTime: response.arrivalTime,
      bookingReference: response.bookingReference,
      status: 'completed',
    }),

  submitReservation: async () => {
    const state = get();
    set({ status: 'processing' });

    try {
      const response = await reservationService.submitReservation({
        departureAirport: state.departureAirport,
        destinationAirport: state.destinationAirport,
        travelDate: state.travelDate,
        returnDate: state.returnDate || undefined,
        tripType: state.tripType,
        passengerName: state.passenger.name,
        passengerPassport: state.passenger.passportNumber,
      });

      set({
        pnr: response.pnr,
        airlineName: response.airlineName,
        flightNumber: response.flightNumber,
        departureTime: response.departureTime,
        arrivalTime: response.arrivalTime,
        bookingReference: response.bookingReference,
        status: 'completed',
      });
    } catch {
      set({ status: 'failed' });
    }
  },

  resetReservation: () =>
    set({
      ...initialReservationFields,
      passenger: { ...initialPassenger },
    }),
}));

// Re-export ReservationResponse type for convenience
export type { ReservationResponse } from '../services/reservation';
