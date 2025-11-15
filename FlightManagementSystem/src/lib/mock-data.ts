export interface Route {
  id: string;
  airline: string;
  airlineId: string;
  sourceAirport: string;
  sourceAirportId: string;
  destinationAirport: string;
  destinationAirportId: string;
  codeshare: string;
  stops: number;
  equipment: string;
}

export interface Airport {
  airportId: string;
  name: string;
  city: string;
  country: string;
  iata: string;
  icao: string;
  latitude: number;
  longitude: number;
  altitude: number;
  timezone: number;
  dst: string;
  tzDatabase: string;
  type: string;
}

export interface Airline {
  airlineId: string;
  name: string;
  alias: string;
  iata: string;
  icao: string;
  callsign: string;
  country: string;
  active: string;
}

// Sample data based on OpenFlights dataset structure
export const mockAirlines: Airline[] = [
  { airlineId: '324', name: 'All Nippon Airways', alias: 'ANA', iata: 'NH', icao: 'ANA', callsign: 'ALL NIPPON', country: 'Japan', active: 'Y' },
  { airlineId: '137', name: 'Air France', alias: '', iata: 'AF', icao: 'AFR', callsign: 'AIRFRANS', country: 'France', active: 'Y' },
  { airlineId: '2009', name: 'Air Canada', alias: '', iata: 'AC', icao: 'ACA', callsign: 'AIR CANADA', country: 'Canada', active: 'Y' },
  { airlineId: '24', name: 'American Airlines', alias: '', iata: 'AA', icao: 'AAL', callsign: 'AMERICAN', country: 'United States', active: 'Y' },
  { airlineId: '1355', name: 'British Airways', alias: '', iata: 'BA', icao: 'BAW', callsign: 'SPEEDBIRD', country: 'United Kingdom', active: 'Y' },
  { airlineId: '2179', name: 'Delta Air Lines', alias: '', iata: 'DL', icao: 'DAL', callsign: 'DELTA', country: 'United States', active: 'Y' },
  { airlineId: '2279', name: 'Emirates', alias: '', iata: 'EK', icao: 'UAE', callsign: 'EMIRATES', country: 'United Arab Emirates', active: 'Y' },
  { airlineId: '3320', name: 'Lufthansa', alias: '', iata: 'LH', icao: 'DLH', callsign: 'LUFTHANSA', country: 'Germany', active: 'Y' },
  { airlineId: '3576', name: 'KLM', alias: 'KLM Royal Dutch Airlines', iata: 'KL', icao: 'KLM', callsign: 'KLM', country: 'Netherlands', active: 'Y' },
  { airlineId: '4869', name: 'Qantas', alias: '', iata: 'QF', icao: 'QFA', callsign: 'QANTAS', country: 'Australia', active: 'Y' },
  { airlineId: '4788', name: 'Singapore Airlines', alias: '', iata: 'SQ', icao: 'SIA', callsign: 'SINGAPORE', country: 'Singapore', active: 'Y' },
  { airlineId: '4951', name: 'Turkish Airlines', alias: '', iata: 'TK', icao: 'THY', callsign: 'TURKISH', country: 'Turkey', active: 'Y' },
  { airlineId: '1868', name: 'Cathay Pacific', alias: '', iata: 'CX', icao: 'CPA', callsign: 'CATHAY', country: 'Hong Kong', active: 'Y' },
];

export const mockAirports: Airport[] = [
  { airportId: '3484', name: 'John F Kennedy Intl', city: 'New York', country: 'United States', iata: 'JFK', icao: 'KJFK', latitude: 40.639751, longitude: -73.778925, altitude: 13, timezone: -5, dst: 'A', tzDatabase: 'America/New_York', type: 'airport' },
  { airportId: '3682', name: 'Los Angeles Intl', city: 'Los Angeles', country: 'United States', iata: 'LAX', icao: 'KLAX', latitude: 33.942536, longitude: -118.408075, altitude: 125, timezone: -8, dst: 'A', tzDatabase: 'America/Los_Angeles', type: 'airport' },
  { airportId: '507', name: 'London Heathrow', city: 'London', country: 'United Kingdom', iata: 'LHR', icao: 'EGLL', latitude: 51.4706, longitude: -0.461941, altitude: 83, timezone: 0, dst: 'E', tzDatabase: 'Europe/London', type: 'airport' },
  { airportId: '1382', name: 'Charles de Gaulle', city: 'Paris', country: 'France', iata: 'CDG', icao: 'LFPG', latitude: 49.012779, longitude: 2.55, altitude: 392, timezone: 1, dst: 'E', tzDatabase: 'Europe/Paris', type: 'airport' },
  { airportId: '2188', name: 'Dubai Intl', city: 'Dubai', country: 'United Arab Emirates', iata: 'DXB', icao: 'OMDB', latitude: 25.252778, longitude: 55.364444, altitude: 62, timezone: 4, dst: 'U', tzDatabase: 'Asia/Dubai', type: 'airport' },
  { airportId: '3316', name: 'Singapore Changi', city: 'Singapore', country: 'Singapore', iata: 'SIN', icao: 'WSSS', latitude: 1.35019, longitude: 103.994003, altitude: 22, timezone: 8, dst: 'N', tzDatabase: 'Asia/Singapore', type: 'airport' },
  { airportId: '2279', name: 'Tokyo Narita Intl', city: 'Tokyo', country: 'Japan', iata: 'NRT', icao: 'RJAA', latitude: 35.764722, longitude: 140.386389, altitude: 141, timezone: 9, dst: 'N', tzDatabase: 'Asia/Tokyo', type: 'airport' },
  { airportId: '3361', name: 'Sydney Kingsford Smith', city: 'Sydney', country: 'Australia', iata: 'SYD', icao: 'YSSY', latitude: -33.946111, longitude: 151.177222, altitude: 21, timezone: 10, dst: 'O', tzDatabase: 'Australia/Sydney', type: 'airport' },
  { airportId: '3339', name: 'Melbourne Tullamarine', city: 'Melbourne', country: 'Australia', iata: 'MEL', icao: 'YMML', latitude: -37.673333, longitude: 144.843333, altitude: 434, timezone: 10, dst: 'O', tzDatabase: 'Australia/Melbourne', type: 'airport' },
  { airportId: '193', name: 'Toronto Pearson Intl', city: 'Toronto', country: 'Canada', iata: 'YYZ', icao: 'CYYZ', latitude: 43.677223, longitude: -79.630556, altitude: 569, timezone: -5, dst: 'A', tzDatabase: 'America/Toronto', type: 'airport' },
  { airportId: '156', name: 'Vancouver Intl', city: 'Vancouver', country: 'Canada', iata: 'YVR', icao: 'CYVR', latitude: 49.193889, longitude: -123.184444, altitude: 14, timezone: -8, dst: 'A', tzDatabase: 'America/Vancouver', type: 'airport' },
  { airportId: '3077', name: 'Hong Kong Intl', city: 'Hong Kong', country: 'Hong Kong', iata: 'HKG', icao: 'VHHH', latitude: 22.308919, longitude: 113.914603, altitude: 28, timezone: 8, dst: 'N', tzDatabase: 'Asia/Hong_Kong', type: 'airport' },
  { airportId: '3448', name: 'Hartsfield Jackson Atlanta Intl', city: 'Atlanta', country: 'United States', iata: 'ATL', icao: 'KATL', latitude: 33.636719, longitude: -84.428067, altitude: 1026, timezone: -5, dst: 'A', tzDatabase: 'America/New_York', type: 'airport' },
  { airportId: '580', name: 'Amsterdam Schiphol', city: 'Amsterdam', country: 'Netherlands', iata: 'AMS', icao: 'EHAM', latitude: 52.308613, longitude: 4.763889, altitude: -11, timezone: 1, dst: 'E', tzDatabase: 'Europe/Amsterdam', type: 'airport' },
  { airportId: '1229', name: 'Barcelona El Prat', city: 'Barcelona', country: 'Spain', iata: 'BCN', icao: 'LEBL', latitude: 41.297078, longitude: 2.078464, altitude: 12, timezone: 1, dst: 'E', tzDatabase: 'Europe/Madrid', type: 'airport' },
  { airportId: '3469', name: 'San Francisco Intl', city: 'San Francisco', country: 'United States', iata: 'SFO', icao: 'KSFO', latitude: 37.618972, longitude: -122.374889, altitude: 13, timezone: -8, dst: 'A', tzDatabase: 'America/Los_Angeles', type: 'airport' },
  { airportId: '1701', name: 'Istanbul Airport', city: 'Istanbul', country: 'Turkey', iata: 'IST', icao: 'LTFM', latitude: 41.275278, longitude: 28.751944, altitude: 325, timezone: 3, dst: 'E', tzDatabase: 'Europe/Istanbul', type: 'airport' },
  { airportId: '340', name: 'Frankfurt Main', city: 'Frankfurt', country: 'Germany', iata: 'FRA', icao: 'EDDF', latitude: 50.033333, longitude: 8.570556, altitude: 364, timezone: 1, dst: 'E', tzDatabase: 'Europe/Berlin', type: 'airport' },
];

export const mockRoutes: Route[] = [
  { id: '1', airline: 'AA', airlineId: '24', sourceAirport: 'LAX', sourceAirportId: '3682', destinationAirport: 'JFK', destinationAirportId: '3484', codeshare: '', stops: 0, equipment: 'Boeing 777 Airbus A321' },
  { id: '2', airline: 'BA', airlineId: '1355', sourceAirport: 'LHR', sourceAirportId: '507', destinationAirport: 'CDG', destinationAirportId: '1382', codeshare: 'Y', stops: 0, equipment: 'Airbus A320 Boeing 787' },
  { id: '3', airline: 'EK', airlineId: '2279', sourceAirport: 'DXB', sourceAirportId: '2188', destinationAirport: 'SIN', destinationAirportId: '3316', codeshare: '', stops: 0, equipment: 'Airbus A380 Boeing 777' },
  { id: '4', airline: 'LH', airlineId: '3320', sourceAirport: 'FRA', sourceAirportId: '340', destinationAirport: 'NRT', destinationAirportId: '2279', codeshare: '', stops: 0, equipment: 'Boeing 747 Airbus A340' },
  { id: '5', airline: 'QF', airlineId: '4869', sourceAirport: 'SYD', sourceAirportId: '3361', destinationAirport: 'MEL', destinationAirportId: '3339', codeshare: '', stops: 0, equipment: 'Boeing 737 Airbus A330' },
  { id: '6', airline: 'AC', airlineId: '2009', sourceAirport: 'YYZ', sourceAirportId: '193', destinationAirport: 'YVR', destinationAirportId: '156', codeshare: 'Y', stops: 0, equipment: 'Boeing 787 Airbus A321' },
  { id: '7', airline: 'SQ', airlineId: '4788', sourceAirport: 'SIN', sourceAirportId: '3316', destinationAirport: 'HKG', destinationAirportId: '3077', codeshare: '', stops: 0, equipment: 'Airbus A350 Boeing 777' },
  { id: '8', airline: 'DL', airlineId: '2179', sourceAirport: 'ATL', sourceAirportId: '3448', destinationAirport: 'LAX', destinationAirportId: '3682', codeshare: '', stops: 0, equipment: 'Boeing 757 Airbus A321' },
  { id: '9', airline: 'KL', airlineId: '3576', sourceAirport: 'AMS', sourceAirportId: '580', destinationAirport: 'BCN', destinationAirportId: '1229', codeshare: 'Y', stops: 0, equipment: 'Boeing 737 Embraer E190' },
  { id: '10', airline: 'AF', airlineId: '137', sourceAirport: 'CDG', sourceAirportId: '1382', destinationAirport: 'DXB', destinationAirportId: '2188', codeshare: '', stops: 0, equipment: 'Airbus A380 Boeing 777' },
  { id: '11', airline: 'CX', airlineId: '1868', sourceAirport: 'HKG', sourceAirportId: '3077', destinationAirport: 'SFO', destinationAirportId: '3469', codeshare: '', stops: 0, equipment: 'Boeing 777 Airbus A350' },
  { id: '12', airline: 'TK', airlineId: '4951', sourceAirport: 'IST', sourceAirportId: '1701', destinationAirport: 'LHR', destinationAirportId: '507', codeshare: 'Y', stops: 0, equipment: 'Airbus A330 Boeing 787' },
  { id: '13', airline: 'NH', airlineId: '324', sourceAirport: 'NRT', sourceAirportId: '2279', destinationAirport: 'SFO', destinationAirportId: '3469', codeshare: '', stops: 0, equipment: 'Boeing 787' },
  { id: '14', airline: 'BA', airlineId: '1355', sourceAirport: 'LHR', sourceAirportId: '507', destinationAirport: 'JFK', destinationAirportId: '3484', codeshare: '', stops: 0, equipment: 'Boeing 777 Airbus A350' },
  { id: '15', airline: 'EK', airlineId: '2279', sourceAirport: 'DXB', sourceAirportId: '2188', destinationAirport: 'LHR', destinationAirportId: '507', codeshare: '', stops: 0, equipment: 'Airbus A380' },
  { id: '16', airline: 'QF', airlineId: '4869', sourceAirport: 'SYD', sourceAirportId: '3361', destinationAirport: 'SIN', destinationAirportId: '3316', codeshare: '', stops: 0, equipment: 'Airbus A330' },
  { id: '17', airline: 'AA', airlineId: '24', sourceAirport: 'JFK', sourceAirportId: '3484', destinationAirport: 'LHR', destinationAirportId: '507', codeshare: '', stops: 0, equipment: 'Boeing 777' },
  { id: '18', airline: 'DL', airlineId: '2179', sourceAirport: 'ATL', sourceAirportId: '3448', destinationAirport: 'AMS', destinationAirportId: '580', codeshare: '', stops: 0, equipment: 'Airbus A330' },
  { id: '19', airline: 'LH', airlineId: '3320', sourceAirport: 'FRA', sourceAirportId: '340', destinationAirport: 'SIN', destinationAirportId: '3316', codeshare: '', stops: 0, equipment: 'Airbus A350' },
  { id: '20', airline: 'AF', airlineId: '137', sourceAirport: 'CDG', sourceAirportId: '1382', destinationAirport: 'JFK', destinationAirportId: '3484', codeshare: '', stops: 0, equipment: 'Boeing 777 Airbus A350' },
];

export const countries = Array.from(new Set(mockAirports.map(a => a.country))).sort();

export const planeTypes = [
  'Boeing 737',
  'Boeing 747',
  'Boeing 757',
  'Boeing 777',
  'Boeing 787',
  'Airbus A320',
  'Airbus A321',
  'Airbus A330',
  'Airbus A340',
  'Airbus A350',
  'Airbus A380',
  'Embraer E190'
];
