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
import {
  Route,
  mockAirlines,
  mockAirports,
  planeTypes,
} from "../lib/mock-data";

interface RouteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  route?: Route | null;
  onSave: (route: Route) => void;
}

export function RouteDialog({
  open,
  onOpenChange,
  route,
  onSave,
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
      const airline = mockAirlines.find(
        (a) => a.iata === route.airline,
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

  const airlineSuggestions = mockAirlines.filter(
    (airline) =>
      airline.name
        .toLowerCase()
        .includes(formData.airline.toLowerCase()) ||
      airline.iata
        .toLowerCase()
        .includes(formData.airline.toLowerCase()),
  );

  const sourceSuggestions = mockAirports.filter(
    (airport) =>
      airport.name
        .toLowerCase()
        .includes(formData.sourceAirport.toLowerCase()) ||
      airport.iata
        .toLowerCase()
        .includes(formData.sourceAirport.toLowerCase()) ||
      airport.city
        .toLowerCase()
        .includes(formData.sourceAirport.toLowerCase()),
  );

  const destSuggestions = mockAirports.filter(
    (airport) =>
      airport.name
        .toLowerCase()
        .includes(formData.destinationAirport.toLowerCase()) ||
      airport.iata
        .toLowerCase()
        .includes(formData.destinationAirport.toLowerCase()) ||
      airport.city
        .toLowerCase()
        .includes(formData.destinationAirport.toLowerCase()),
  );

  const equipmentSuggestions = planeTypes.filter((plane) =>
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

    const airline = mockAirlines.find(
      (a) =>
        a.name.toLowerCase() ===
          formData.airline.toLowerCase() ||
        a.iata.toLowerCase() === formData.airline.toLowerCase(),
    );

    const sourceAirport = mockAirports.find(
      (a) =>
        a.iata.toLowerCase() ===
        formData.sourceAirport.toLowerCase(),
    );

    const destAirport = mockAirports.find(
      (a) =>
        a.iata.toLowerCase() ===
        formData.destinationAirport.toLowerCase(),
    );

    if (!airline || !sourceAirport || !destAirport) {
      return;
    }

    const newRoute: Route = {
      id: route?.id || Date.now().toString(),
      airline: airline.iata,
      airlineId: airline.airlineId,
      sourceAirport: sourceAirport.iata,
      sourceAirportId: sourceAirport.airportId,
      destinationAirport: destAirport.iata,
      destinationAirportId: destAirport.airportId,
      codeshare: route?.codeshare || "",
      stops: parseInt(formData.stops),
      equipment: formData.equipment,
    };

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
            </Label>
            <Input
              id="airline"
              placeholder="Search airline..."
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
              formData.airline &&
              airlineSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-auto">
                  {airlineSuggestions.map((airline) => (
                    <div
                      key={airline.airlineId}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onMouseDown={() => {
                        setFormData({
                          ...formData,
                          airline: airline.name,
                        });
                        setShowAirlineSuggestions(false);
                      }}
                    >
                      <div>{airline.name}</div>
                      <div className="text-sm text-gray-500">
                        {airline.iata}
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>

          {/* Route Start (Origin) */}
          <div className="space-y-2 relative">
            <Label htmlFor="origin">
              Route Start (Origin){" "}
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="origin"
              placeholder="Airport code (e.g., JFK)"
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
                          sourceAirport: airport.iata,
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
            </Label>
            <Input
              id="destination"
              placeholder="Airport code (e.g., LAX)"
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
                          destinationAirport: airport.iata,
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
            </Label>
            <Input
              id="equipment"
              placeholder="Search aircraft..."
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