import { useState, useEffect } from 'react';
import { FlightSearch } from './components/flight-search';
import { RouteTable } from './components/route-table';
import { HelpButton } from './components/help-button';
import { Plane } from 'lucide-react';
import { Route, Airline, Airport, PlaneType } from './lib/types';

export default function App() {
  // All data loaded from backend
  const [allRoutes, setAllRoutes] = useState<Route[]>([]);
  const [searchResults, setSearchResults] = useState<Route[]>([]);
  const [airlines, setAirlines] = useState<Airline[]>([]);
  const [airports, setAirports] = useState<Airport[]>([]);
  const [planeTypes, setPlaneTypes] = useState<PlaneType[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const [rRes, aRes, apRes] = await Promise.all([
          fetch('/api/all-routes'),
          fetch('/api/airlines'),
          fetch('/api/airports'),
        ]);

        if (!rRes.ok) throw new Error('routes');
        if (!aRes.ok) throw new Error('airlines');
        if (!apRes.ok) throw new Error('airports');

        const rJson = await rRes.json();
        const aJson = await aRes.json();
        const apJson = await apRes.json();

        const routes: Route[] = (rJson.routes || []).map((row: any) => ({
          id: `${row.airlineid}-${row.sourceairportid}-${row.destinationairportid}-${row.equipment || ''}`,
          airline: row.airline || '',
          airlineId: String(row.airlineid || ''),
          sourceAirport: row.sourceairport || '',
          sourceAirportId: String(row.sourceairportid || ''),
          destinationAirport: row.destinationairport || '',
          destinationAirportId: String(row.destinationairportid || ''),
          codeshare: row.codeshare || '',
          stops: Number(row.stops) || 0,
          equipment: row.equipment || '',
        }));

        setAllRoutes(routes);
        setSearchResults(routes);
        setAirlines(aJson.airlines || []);
        setAirports(apJson.airports || []);

        // derive plane types from equipment fields
        const pt = new Set<string>();
        routes.forEach(r => {
          if (r.equipment) {
            r.equipment.split(' ').forEach((p) => pt.add(p));
          }
        });
        setPlaneTypes(Array.from(pt));
      } catch (err) {
        // Leave arrays empty - frontend can handle empty state or show helpful message
        console.error('Failed to load backend data', err);
      }
    }
    load();
  }, []);


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-indigo-900 mb-2">Jet2Holiday</h1>
          <p className="text-gray-600">
            Flight Management System
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <FlightSearch onSearch={setSearchResults} allRoutes={allRoutes} airlines={airlines} airports={airports} planeTypes={planeTypes} />
          <RouteTable
            routes={searchResults}
            onRoutesChange={setSearchResults}
            allRoutes={allRoutes}
            onAllRoutesChange={setAllRoutes}
            airlines={airlines}
            airports={airports}
            planeTypes={planeTypes}
          />
        </div>
      </div>

      {/* Floating Help Button */}
      <HelpButton />
    </div>
  );
}