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
  airportId: string | number;
  name?: string;
  city?: string;
  country?: string;
  iata?: string;
  icao?: string;
  latitude?: number;
  longitude?: number;
  altitude?: number;
  timezone?: number;
  dst?: string;
  tzDatabase?: string;
  type?: string;
}

export interface Airline {
  airlineId: string | number;
  name?: string;
  alias?: string;
  iata?: string;
  icao?: string;
  callsign?: string;
  country?: string;
  active?: string;
}

export type PlaneType = string;
