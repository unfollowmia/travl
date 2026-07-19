/**
 * travl — Reservation Service
 *
 * Clean interface for reservation submission so a real travel-agency
 * API can be swapped in later with zero changes to the UI layer.
 */

export interface ReservationRequest {
  departureAirport: string;
  destinationAirport: string;
  travelDate: string;
  returnDate?: string;
  tripType: 'one-way' | 'return';
  passengerName: string;
  passengerPassport: string;
}

export interface ReservationResponse {
  pnr: string;
  airlineName: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  bookingReference: string;
  status: 'Confirmed' | 'Pending';
}

export interface ReservationService {
  submitReservation(data: ReservationRequest): Promise<ReservationResponse>;
}

const AIRLINES = [
  { name: 'United Airlines', code: 'UA' },
  { name: 'Delta Air Lines', code: 'DL' },
  { name: 'American Airlines', code: 'AA' },
  { name: 'British Airways', code: 'BA' },
  { name: 'Emirates', code: 'EK' },
  { name: 'Singapore Airlines', code: 'SQ' },
  { name: 'Qatar Airways', code: 'QR' },
  { name: 'Lufthansa', code: 'LH' },
];

function generatePNR(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let pnr = '';
  for (let i = 0; i < 6; i++) {
    pnr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pnr;
}

function generateTimeFromDate(dateStr: string): string {
  // Generate a plausible flight time from the date
  const hour = 6 + Math.floor(Math.random() * 16); // 6 AM to 10 PM
  const min = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, 45
  return `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
}

function generateArrivalTime(dateStr: string, depTime: string): string {
  const depHour = parseInt(depTime.split(':')[0], 10);
  const depMin = parseInt(depTime.split(':')[1], 10);
  const flightDuration = 2 + Math.floor(Math.random() * 14); // 2-15 hours
  let arrHour = depHour + flightDuration;
  if (arrHour >= 24) arrHour -= 24;
  return `${String(arrHour).padStart(2, '0')}:${String(depMin).padStart(2, '0')}`;
}

function makeBookingRef(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let ref = '';
  for (let i = 0; i < 8; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ref;
}

/**
 * Mock reservation service.
 *
 * Simulates a travel agency API call. Returns realistic reservation data
 * with a valid-format PNR, airline information, and confirmed status.
 */
export class MockReservationService implements ReservationService {
  async submitReservation(data: ReservationRequest): Promise<ReservationResponse> {
    // Simulate API processing
    await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 1000));

    const airline = AIRLINES[Math.floor(Math.random() * AIRLINES.length)];
    const departureTime = generateTimeFromDate(data.travelDate);
    const arrivalTime = generateArrivalTime(data.travelDate, departureTime);

    return {
      pnr: generatePNR(),
      airlineName: airline.name,
      flightNumber: `${airline.code}${100 + Math.floor(Math.random() * 9000)}`,
      departureTime: `${data.travelDate}T${departureTime}:00`,
      arrivalTime: `${data.travelDate}T${arrivalTime}:00`,
      bookingReference: makeBookingRef(),
      status: 'Confirmed',
    };
  }
}

/** Singleton instance — swap for real implementation later */
export const reservationService: ReservationService = new MockReservationService();
