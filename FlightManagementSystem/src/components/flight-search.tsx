import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Search, X } from 'lucide-react';
import { mockRoutes, mockAirlines, mockAirports, planeTypes } from '../lib/mock-data';

interface FlightSearchProps {
  onSearch: (results: any[]) => void;
}

export function FlightSearch({ onSearch }: FlightSearchProps) {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedAirline, setSelectedAirline] = useState('');
  const [selectedPlane, setSelectedPlane] = useState('');
  const [showAirlineSuggestions, setShowAirlineSuggestions] = useState(false);
  const [showPlaneSuggestions, setShowPlaneSuggestions] = useState(false);

  const airlineSuggestions = mockAirlines.filter(airline =>
    airline.name.toLowerCase().includes(selectedAirline.toLowerCase()) ||
    airline.iata.toLowerCase().includes(selectedAirline.toLowerCase())
  );

  const planeSuggestions = planeTypes.filter(plane =>
    plane.toLowerCase().includes(selectedPlane.toLowerCase())
  );

  const handleSearch = () => {
    // If no filters are set, return all routes
    if (!origin.trim() && !destination.trim() && !selectedAirline.trim() && !selectedPlane.trim()) {
      onSearch(mockRoutes);
      return;
    }

    let results = [...mockRoutes];

    // Filter by origin
    if (origin) {
      const searchTerm = origin.toLowerCase();
      results = results.filter(route => {
        const airport = mockAirports.find(a => a.iata === route.sourceAirport);
        return route.sourceAirport.toLowerCase().includes(searchTerm) ||
               airport?.city.toLowerCase().includes(searchTerm) ||
               airport?.name.toLowerCase().includes(searchTerm);
      });
    }

    // Filter by destination
    if (destination) {
      const searchTerm = destination.toLowerCase();
      results = results.filter(route => {
        const airport = mockAirports.find(a => a.iata === route.destinationAirport);
        return route.destinationAirport.toLowerCase().includes(searchTerm) ||
               airport?.city.toLowerCase().includes(searchTerm) ||
               airport?.name.toLowerCase().includes(searchTerm);
      });
    }

    // Filter by airline
    if (selectedAirline) {
      results = results.filter(route => {
        const airline = mockAirlines.find(a => a.iata === route.airline);
        return airline?.name.toLowerCase().includes(selectedAirline.toLowerCase()) ||
               airline?.iata.toLowerCase().includes(selectedAirline.toLowerCase());
      });
    }

    // Filter by plane type
    if (selectedPlane) {
      results = results.filter(route =>
        route.equipment.toLowerCase().includes(selectedPlane.toLowerCase())
      );
    }

    onSearch(results);
  };

  const handleReset = () => {
    setOrigin('');
    setDestination('');
    setSelectedAirline('');
    setSelectedPlane('');
    onSearch(mockRoutes);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          Route Search
        </CardTitle>
        <CardDescription>
          Search for flight routes between airports with advanced filters
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Origin */}
          <div className="space-y-2">
            <Label htmlFor="origin">
              Origin <span className="text-red-500">*</span>
            </Label>
            <Input
              id="origin"
              placeholder="City, airport code, or name"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              required
            />
          </div>

          {/* Destination */}
          <div className="space-y-2">
            <Label htmlFor="destination">
              Destination <span className="text-red-500">*</span>
            </Label>
            <Input
              id="destination"
              placeholder="City, airport code, or name"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
            />
          </div>

          {/* Airline */}
          <div className="space-y-2 relative">
            <Label htmlFor="airline">Airline</Label>
            <Input
              id="airline"
              placeholder="Search airline..."
              value={selectedAirline}
              onChange={(e) => {
                setSelectedAirline(e.target.value);
                setShowAirlineSuggestions(true);
              }}
              onFocus={() => setShowAirlineSuggestions(true)}
              onBlur={() => setTimeout(() => setShowAirlineSuggestions(false), 200)}
            />
            {showAirlineSuggestions && selectedAirline && airlineSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                {airlineSuggestions.map((airline) => (
                  <div
                    key={airline.airlineId}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onMouseDown={() => {
                      setSelectedAirline(airline.name);
                      setShowAirlineSuggestions(false);
                    }}
                  >
                    <div>{airline.name}</div>
                    <div className="text-sm text-gray-500">{airline.iata}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Aircraft Type */}
          <div className="space-y-2 relative">
            <Label htmlFor="plane">Aircraft Type</Label>
            <Input
              id="plane"
              placeholder="Search aircraft..."
              value={selectedPlane}
              onChange={(e) => {
                setSelectedPlane(e.target.value);
                setShowPlaneSuggestions(true);
              }}
              onFocus={() => setShowPlaneSuggestions(true)}
              onBlur={() => setTimeout(() => setShowPlaneSuggestions(false), 200)}
            />
            {showPlaneSuggestions && selectedPlane && planeSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                {planeSuggestions.map((plane) => (
                  <div
                    key={plane}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onMouseDown={() => {
                      setSelectedPlane(plane);
                      setShowPlaneSuggestions(false);
                    }}
                  >
                    {plane}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button onClick={handleSearch} className="flex-1">
            <Search className="w-4 h-4 mr-2" />
            Search Routes
          </Button>
          <Button onClick={handleReset} variant="outline">
            <X className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}