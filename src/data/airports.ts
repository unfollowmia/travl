/**
 * travl — Airport Database
 *
 * ~50 major international airports for the airport search.
 * Each entry: IATA code, full name, city, country.
 */

export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
}

export const airports: Airport[] = [
  // North America
  { code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'United States' },
  { code: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'United States' },
  { code: 'ORD', name: "O'Hare International Airport", city: 'Chicago', country: 'United States' },
  { code: 'SFO', name: 'San Francisco International Airport', city: 'San Francisco', country: 'United States' },
  { code: 'MIA', name: 'Miami International Airport', city: 'Miami', country: 'United States' },
  { code: 'ATL', name: 'Hartsfield-Jackson Atlanta International Airport', city: 'Atlanta', country: 'United States' },
  { code: 'DFW', name: 'Dallas/Fort Worth International Airport', city: 'Dallas', country: 'United States' },
  { code: 'BOS', name: 'Logan International Airport', city: 'Boston', country: 'United States' },
  { code: 'LAS', name: 'McCarran International Airport', city: 'Las Vegas', country: 'United States' },
  { code: 'SEA', name: 'Seattle-Tacoma International Airport', city: 'Seattle', country: 'United States' },
  { code: 'YYZ', name: 'Toronto Pearson International Airport', city: 'Toronto', country: 'Canada' },
  { code: 'YVR', name: 'Vancouver International Airport', city: 'Vancouver', country: 'Canada' },
  { code: 'MEX', name: 'Mexico City International Airport', city: 'Mexico City', country: 'Mexico' },
  { code: 'CUN', name: 'Cancún International Airport', city: 'Cancún', country: 'Mexico' },

  // Europe
  { code: 'LHR', name: 'London Heathrow Airport', city: 'London', country: 'United Kingdom' },
  { code: 'LGW', name: 'London Gatwick Airport', city: 'London', country: 'United Kingdom' },
  { code: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France' },
  { code: 'ORY', name: 'Paris Orly Airport', city: 'Paris', country: 'France' },
  { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany' },
  { code: 'MUC', name: 'Munich Airport', city: 'Munich', country: 'Germany' },
  { code: 'AMS', name: 'Amsterdam Airport Schiphol', city: 'Amsterdam', country: 'Netherlands' },
  { code: 'MAD', name: 'Adolfo Suárez Madrid–Barajas Airport', city: 'Madrid', country: 'Spain' },
  { code: 'BCN', name: 'Barcelona–El Prat Airport', city: 'Barcelona', country: 'Spain' },
  { code: 'FCO', name: 'Leonardo da Vinci–Fiumicino Airport', city: 'Rome', country: 'Italy' },
  { code: 'MXP', name: 'Milan Malpensa Airport', city: 'Milan', country: 'Italy' },
  { code: 'ZRH', name: 'Zurich Airport', city: 'Zurich', country: 'Switzerland' },
  { code: 'VIE', name: 'Vienna International Airport', city: 'Vienna', country: 'Austria' },
  { code: 'IST', name: 'Istanbul Airport', city: 'Istanbul', country: 'Turkey' },
  { code: 'LIS', name: 'Lisbon Airport', city: 'Lisbon', country: 'Portugal' },
  { code: 'DUB', name: 'Dublin Airport', city: 'Dublin', country: 'Ireland' },
  { code: 'CPH', name: 'Copenhagen Airport', city: 'Copenhagen', country: 'Denmark' },
  { code: 'ARN', name: 'Stockholm Arlanda Airport', city: 'Stockholm', country: 'Sweden' },
  { code: 'HEL', name: 'Helsinki-Vantaa Airport', city: 'Helsinki', country: 'Finland' },
  { code: 'SVO', name: 'Sheremetyevo International Airport', city: 'Moscow', country: 'Russia' },

  // Middle East
  { code: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'United Arab Emirates' },
  { code: 'AUH', name: 'Abu Dhabi International Airport', city: 'Abu Dhabi', country: 'United Arab Emirates' },
  { code: 'DOH', name: 'Hamad International Airport', city: 'Doha', country: 'Qatar' },
  { code: 'TLV', name: 'Ben Gurion Airport', city: 'Tel Aviv', country: 'Israel' },

  // Asia
  { code: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore' },
  { code: 'HND', name: 'Tokyo Haneda Airport', city: 'Tokyo', country: 'Japan' },
  { code: 'NRT', name: 'Narita International Airport', city: 'Tokyo', country: 'Japan' },
  { code: 'ICN', name: 'Incheon International Airport', city: 'Seoul', country: 'South Korea' },
  { code: 'HKG', name: 'Hong Kong International Airport', city: 'Hong Kong', country: 'Hong Kong' },
  { code: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand' },
  { code: 'DMK', name: 'Don Mueang International Airport', city: 'Bangkok', country: 'Thailand' },
  { code: 'KUL', name: 'Kuala Lumpur International Airport', city: 'Kuala Lumpur', country: 'Malaysia' },
  { code: 'CGK', name: 'Soekarno–Hatta International Airport', city: 'Jakarta', country: 'Indonesia' },
  { code: 'MNL', name: 'Ninoy Aquino International Airport', city: 'Manila', country: 'Philippines' },
  { code: 'DEL', name: 'Indira Gandhi International Airport', city: 'New Delhi', country: 'India' },
  { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Airport', city: 'Mumbai', country: 'India' },
  { code: 'KIX', name: 'Kansai International Airport', city: 'Osaka', country: 'Japan' },
  { code: 'TPE', name: 'Taiwan Taoyuan International Airport', city: 'Taipei', country: 'Taiwan' },
  { code: 'PVG', name: 'Shanghai Pudong International Airport', city: 'Shanghai', country: 'China' },
  { code: 'PEK', name: 'Beijing Capital International Airport', city: 'Beijing', country: 'China' },

  // Oceania
  { code: 'SYD', name: 'Sydney Kingsford Smith Airport', city: 'Sydney', country: 'Australia' },
  { code: 'MEL', name: 'Melbourne Airport', city: 'Melbourne', country: 'Australia' },
  { code: 'BNE', name: 'Brisbane Airport', city: 'Brisbane', country: 'Australia' },
  { code: 'AKL', name: 'Auckland Airport', city: 'Auckland', country: 'New Zealand' },

  // South America
  { code: 'GRU', name: 'São Paulo–Guarulhos International Airport', city: 'São Paulo', country: 'Brazil' },
  { code: 'EZE', name: 'Ministro Pistarini International Airport', city: 'Buenos Aires', country: 'Argentina' },
  { code: 'BOG', name: 'El Dorado International Airport', city: 'Bogotá', country: 'Colombia' },
  { code: 'LIM', name: 'Jorge Chávez International Airport', city: 'Lima', country: 'Peru' },
  { code: 'SCL', name: 'Arturo Merino Benítez International Airport', city: 'Santiago', country: 'Chile' },

  // Africa
  { code: 'JNB', name: 'O.R. Tambo International Airport', city: 'Johannesburg', country: 'South Africa' },
  { code: 'CPT', name: 'Cape Town International Airport', city: 'Cape Town', country: 'South Africa' },
  { code: 'CAI', name: 'Cairo International Airport', city: 'Cairo', country: 'Egypt' },
  { code: 'NBO', name: 'Jomo Kenyatta International Airport', city: 'Nairobi', country: 'Kenya' },
  { code: 'CMN', name: 'Mohammed V International Airport', city: 'Casablanca', country: 'Morocco' },
];

/**
 * Search airports by code, city, country, or name.
 * Case-insensitive. Returns up to 10 results.
 */
export function searchAirports(query: string): Airport[] {
  const q = query.toLowerCase().trim();
  if (!q) return airports.slice(0, 10);

  return airports
    .filter(
      (a) =>
        a.code.toLowerCase().includes(q) ||
        a.city.toLowerCase().includes(q) ||
        a.country.toLowerCase().includes(q) ||
        a.name.toLowerCase().includes(q),
    )
    .slice(0, 10);
}

/**
 * Find an airport by its IATA code.
 */
export function getAirportByCode(code: string): Airport | undefined {
  return airports.find((a) => a.code.toUpperCase() === code.toUpperCase());
}
