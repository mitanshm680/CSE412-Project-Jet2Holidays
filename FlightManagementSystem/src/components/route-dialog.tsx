import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { X } from "lucide-react";
import { Route, Airline, Airport, PlaneType } from "../lib/types";

interface RouteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  route?: Route | null;
  onSave: (route: Route) => void;
  airlines: Airline[];
  airports: Airport[];
  planeTypes: PlaneType[];
}

export function RouteDialog({
  open,
  onOpenChange,
  route,
  onSave,
  airlines,
  airports,
  planeTypes,
}: RouteDialogProps) {
  const [formData, setFormData] = useState({
    airline: "",
    sourceAirport: "",
    destinationAirport: "",
    stops: "",
    equipment: "",
  });

  const [showAirlineSuggestions, setShowAirlineSuggestions] =
    useState(false);
  const [showSourceSuggestions, setShowSourceSuggestions] =
    useState(false);
  const [showDestSuggestions, setShowDestSuggestions] =
    useState(false);
  const [
    showEquipmentSuggestions,
    setShowEquipmentSuggestions,
  ] = useState(false);

  useEffect(() => {
    if (route) {
      const airline = (airlines || []).find(
        (a) => a.iata === route.airline || String(a.airlineId) === route.airlineId,
      );

      setFormData({
        airline: airline?.name || "",
        sourceAirport: route.sourceAirport,
        destinationAirport: route.destinationAirport,
        stops: route.stops.toString(),
        equipment: route.equipment,
      });
    } else {
      setFormData({
        airline: "",
        sourceAirport: "",
        destinationAirport: "",
        stops: "0",
        equipment: "",
      });
    }
  }, [route, open]);

  const airlineSuggestions = (airlines || []).filter(
    (airline) =>
      (airline.name || '')
        .toLowerCase()
        .includes(formData.airline.toLowerCase()) ||
      (airline.iata || '')
        .toLowerCase()
        .includes(formData.airline.toLowerCase()),
  );

  const sourceSuggestions = (airports || []).filter(
    (airport) =>
      (airport.name || '')
        .toLowerCase()
        .includes(formData.sourceAirport.toLowerCase()) ||
      (airport.iata || '')
        .toLowerCase()
        .includes(formData.sourceAirport.toLowerCase()) ||
      (airport.city || '')
        .toLowerCase()
        .includes(formData.sourceAirport.toLowerCase()),
  );

  const destSuggestions = (airports || []).filter(
    (airport) =>
      (airport.name || '')
        .toLowerCase()
        .includes(formData.destinationAirport.toLowerCase()) ||
      (airport.iata || '')
        .toLowerCase()
        .includes(formData.destinationAirport.toLowerCase()) ||
      (airport.city || '')
        .toLowerCase()
        .includes(formData.destinationAirport.toLowerCase()),
  );

  const equipmentSuggestions = (planeTypes || []).filter((plane) =>
    plane
      .toLowerCase()
      .includes(formData.equipment.toLowerCase()),
  );

  const handleSubmit = () => {
    if (
      !formData.airline ||
      !formData.sourceAirport ||
      !formData.destinationAirport ||
      !formData.stops ||
      !formData.equipment
    ) {
      return;
    }

    // Look up the IDs based on the form data (for both new and edited routes)
    const airline = (airlines || []).find(
      (a) =>
        (a.name || '').toLowerCase() ===
          formData.airline.toLowerCase() ||
        (a.iata || '').toLowerCase() === formData.airline.toLowerCase(),
    );

    const sourceAirport = (airports || []).find(
      (a) =>
        (a.iata || '').toLowerCase() ===
        formData.sourceAirport.toLowerCase(),
    );

    const destAirport = (airports || []).find(
      (a) =>
        (a.iata || '').toLowerCase() ===
        formData.destinationAirport.toLowerCase(),
    );

    if (!airline || !sourceAirport || !destAirport) {
      console.error('Lookup failed:', {
        airline: formData.airline,
        foundAirline: airline,
        sourceAirport: formData.sourceAirport,
        foundSource: sourceAirport,
        destAirport: formData.destinationAirport,
        foundDest: destAirport,
      });
      alert('Failed to find airline or airport. Please select from the dropdown suggestions.');
      return;
    }

    // Ensure IDs are valid numbers
    if (!airline.airlineId || !sourceAirport.airportId || !destAirport.airportId) {
      console.error('Invalid IDs:', { airline, sourceAirport, destAirport });
      alert('Invalid airline or airport data. Please try again.');
      return;
    }

    // If editing an existing route, update with new values from form
    if (route) {
      const updatedRoute: Route = {
        ...route,
        airline: airline.iata || '',
        airlineId: String(airline.airlineId),
        sourceAirport: sourceAirport.iata || '',
        sourceAirportId: String(sourceAirport.airportId),
        destinationAirport: destAirport.iata || '',
        destinationAirportId: String(destAirport.airportId),
        stops: parseInt(formData.stops),
        equipment: formData.equipment,
      };
      console.log('Updating route:', updatedRoute);
      onSave(updatedRoute);
      onOpenChange(false);
      return;
    }

    // For new routes
    const newRoute: Route = {
      id: Date.now().toString(),
      airline: airline.iata || '',
      airlineId: String(airline.airlineId),
      sourceAirport: sourceAirport.iata || '',
      sourceAirportId: String(sourceAirport.airportId),
      destinationAirport: destAirport.iata || '',
      destinationAirportId: String(destAirport.airportId),
      codeshare: "",
      stops: parseInt(formData.stops),
      equipment: formData.equipment,
    };

    console.log('Creating new route:', newRoute);
    onSave(newRoute);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {route ? "Update Route" : "Insert New Route"}
          </DialogTitle>
          <DialogDescription>
            {route
              ? "Update the route information below."
              : "Fill in the route information below. All fields are required."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Airline */}
          <div className="space-y-2 relative">
            <Label htmlFor="airline">
              Airline <span className="text-red-500">*</span>
              <span className="text-xs text-gray-500 ml-2">(Select from dropdown)</span>
            </Label>
            <Input
              id="airline"
              placeholder="Type to search airlines..."
              value={formData.airline}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  airline: e.target.value,
                });
                setShowAirlineSuggestions(true);
              }}
              onFocus={() => setShowAirlineSuggestions(true)}
              onBlur={() =>
                setTimeout(
                  () => setShowAirlineSuggestions(false),
                  200,
                )
              }
            />
            {showAirlineSuggestions &&
              airlineSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-auto">
                  {airlineSuggestions.slice(0, 10).map((airline) => (
                    <div
                      key={airline.airlineId}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onMouseDown={() => {
                        setFormData({
                          ...formData,
                          airline: airline.name || (airline.iata || ''),
                        });
                        setShowAirlineSuggestions(false);
                      }}
                    >
                      <div className="font-medium">{airline.name}</div>
                      <div className="text-sm text-gray-500">
                        {airline.iata} {airline.country && `• ${airline.country}`}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            {showAirlineSuggestions && formData.airline && airlineSuggestions.length === 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg p-3 text-sm text-red-600">
                No airlines found. Try a different search term.
              </div>
            )}
          </div>

          {/* Route Start (Origin) */}
          <div className="space-y-2 relative">
            <Label htmlFor="origin">
              Route Start (Origin){" "}
              <span className="text-red-500">*</span>
              <span className="text-xs text-gray-500 ml-2">(Select from dropdown)</span>
            </Label>
            <Input
              id="origin"
              placeholder="Type airport code or city..."
              value={formData.sourceAirport}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  sourceAirport: e.target.value,
                });
                setShowSourceSuggestions(true);
              }}
              onFocus={() => setShowSourceSuggestions(true)}
              onBlur={() =>
                setTimeout(
                  () => setShowSourceSuggestions(false),
                  200,
                )
              }
            />
            {showSourceSuggestions &&
              formData.sourceAirport &&
              sourceSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-auto">
                  {sourceSuggestions.map((airport) => (
                    <div
                      key={airport.airportId}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onMouseDown={() => {
                        setFormData({
                          ...formData,
                          sourceAirport: airport.iata || String(airport.airportId || ''),
                        });
                        setShowSourceSuggestions(false);
                      }}
                    >
                      <div>{airport.name}</div>
                      <div className="text-sm text-gray-500">
                        {airport.iata} - {airport.city}
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>

          {/* Route End (Destination) */}
          <div className="space-y-2 relative">
            <Label htmlFor="destination">
              Route End (Destination){" "}
              <span className="text-red-500">*</span>
              <span className="text-xs text-gray-500 ml-2">(Select from dropdown)</span>
            </Label>
            <Input
              id="destination"
              placeholder="Type airport code or city..."
              value={formData.destinationAirport}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  destinationAirport: e.target.value,
                });
                setShowDestSuggestions(true);
              }}
              onFocus={() => setShowDestSuggestions(true)}
              onBlur={() =>
                setTimeout(
                  () => setShowDestSuggestions(false),
                  200,
                )
              }
            />
            {showDestSuggestions &&
              formData.destinationAirport &&
              destSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-auto">
                  {destSuggestions.map((airport) => (
                    <div
                      key={airport.airportId}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onMouseDown={() => {
                        setFormData({
                          ...formData,
                          destinationAirport: airport.iata || String(airport.airportId || ''),
                        });
                        setShowDestSuggestions(false);
                      }}
                    >
                      <div>{airport.name}</div>
                      <div className="text-sm text-gray-500">
                        {airport.iata} - {airport.city}
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>

          {/* Stops */}
          <div className="space-y-2">
            <Label htmlFor="stops">
              Stops <span className="text-red-500">*</span>
            </Label>
            <Input
              id="stops"
              type="number"
              min="0"
              placeholder="0"
              value={formData.stops}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  stops: e.target.value,
                })
              }
            />
          </div>

          {/* Equipment */}
          <div className="space-y-2 relative">
            <Label htmlFor="equipment">
              Equipment <span className="text-red-500">*</span>
              <span className="text-xs text-gray-500 ml-2">(Select from dropdown)</span>
            </Label>
            <Input
              id="equipment"
              placeholder="Type aircraft code (e.g., 737, 77W)..."
              value={formData.equipment}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  equipment: e.target.value,
                });
                setShowEquipmentSuggestions(true);
              }}
              onFocus={() => setShowEquipmentSuggestions(true)}
              onBlur={() =>
                setTimeout(
                  () => setShowEquipmentSuggestions(false),
                  200,
                )
              }
            />
            {showEquipmentSuggestions &&
              formData.equipment &&
              equipmentSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-auto">
                  {equipmentSuggestions.map((plane) => (
                    <div
                      key={plane}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onMouseDown={() => {
                        setFormData({
                          ...formData,
                          equipment: plane,
                        });
                        setShowEquipmentSuggestions(false);
                      }}
                    >
                      {plane}
                    </div>
                  ))}
                </div>
              )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {route ? "Update" : "Insert"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}