import { useState } from 'react';
import { FlightSearch } from './components/flight-search';
import { RouteTable } from './components/route-table';
import { Plane } from 'lucide-react';
import { Route, mockRoutes } from './lib/mock-data';

export default function App() {
  // By default, show all routes (paginated client-side by RouteTable)
  const [searchResults, setSearchResults] = useState<Route[]>(mockRoutes);

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
          <FlightSearch onSearch={setSearchResults} />
          <RouteTable routes={searchResults} onRoutesChange={setSearchResults} />
        </div>
      </div>
    </div>
  );
}