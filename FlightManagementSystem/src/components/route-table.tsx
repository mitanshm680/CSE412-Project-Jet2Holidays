import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Route, Airline, Airport, PlaneType } from '../lib/types';
import { ArrowRight, Plane, ChevronLeft, ChevronRight, Plus, Trash2, Pencil } from 'lucide-react';
import { RouteDialog } from './route-dialog';

interface RouteTableProps {
  routes: Route[];
  onRoutesChange: (routes: Route[]) => void;
  airlines: Airline[];
  airports: Airport[];
  planeTypes: PlaneType[];
  allRoutes?: Route[];
  onAllRoutesChange?: (routes: Route[]) => void;
}

export function RouteTable({ routes, onRoutesChange, airlines, airports, planeTypes, allRoutes, onAllRoutesChange }: RouteTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    setSelectedRows(new Set());
    setSelectAll(false);
  }, [routes]);

  if (routes.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardContent className="py-12">
          <div className="text-center text-gray-500">
            <Plane className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No routes found. Try adjusting your search filters.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalPages = Math.ceil(routes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRoutes = routes.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setSelectedRows(new Set());
    setSelectAll(false);
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      const allIds = new Set(currentRoutes.map(r => r.id));
      setSelectedRows(allIds);
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
      setSelectAll(false);
    }
    setSelectedRows(newSelected);
  };

  const handleDelete = async () => {
    if (selectedRows.size === 0) return;

    try {
      // Delete each selected route via API
      const deletePromises = Array.from(selectedRows).map(async (routeId) => {
        const route = routes.find(r => r.id === routeId);
        if (!route) return;

        const response = await fetch('/api/routes', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            airlineId: Number(route.airlineId),
            sourceAirportId: Number(route.sourceAirportId),
            destinationAirportId: Number(route.destinationAirportId),
            equipment: route.equipment,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to delete route');
        }
      });

      await Promise.all(deletePromises);

      // Update local state after successful deletion
      const updatedRoutes = routes.filter(route => !selectedRows.has(route.id));
      onRoutesChange(updatedRoutes);

      // Also update allRoutes if provided
      if (allRoutes && onAllRoutesChange) {
        const updatedAllRoutes = allRoutes.filter(route => !selectedRows.has(route.id));
        onAllRoutesChange(updatedAllRoutes);
      }

      setSelectedRows(new Set());
      setSelectAll(false);

      console.log(`Successfully deleted ${selectedRows.size} route(s)`);
    } catch (error) {
      console.error('Error deleting routes:', error);
      alert('Failed to delete routes. Check console for details.');
    }
  };

  const handleInsert = () => {
    setEditingRoute(null);
    setDialogOpen(true);
  };

  const handleEdit = (route: Route) => {
    setEditingRoute(route);
    setDialogOpen(true);
  };

  const handleSave = async (route: Route) => {
    try {
      if (editingRoute) {
        // Update existing route via PUT API
        const response = await fetch('/api/routes', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            airlineId: Number(route.airlineId),
            sourceAirportId: Number(route.sourceAirportId),
            destinationAirportId: Number(route.destinationAirportId),
            oldEquipment: editingRoute.equipment, // Original equipment value
            newEquipment: route.equipment, // New equipment value
            newStops: route.stops,
            newCodeshare: route.codeshare || null,
            // Additional fields needed for delete/insert if equipment changes
            airline: route.airline,
            sourceAirport: route.sourceAirport,
            destinationAirport: route.destinationAirport,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to update route');
        }

        const result = await response.json();
        console.log('Route updated:', result);

        // Update local state
        const updatedRoutes = routes.map(r => r.id === route.id ? route : r);
        onRoutesChange(updatedRoutes);

        // Also update allRoutes if provided
        if (allRoutes && onAllRoutesChange) {
          const updatedAllRoutes = allRoutes.map(r => r.id === route.id ? route : r);
          onAllRoutesChange(updatedAllRoutes);
        }
      } else {
        // Insert new route via POST API
        const response = await fetch('/api/routes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            airline: route.airline,
            airlineId: Number(route.airlineId),
            sourceAirport: route.sourceAirport,
            sourceAirportId: Number(route.sourceAirportId),
            destinationAirport: route.destinationAirport,
            destinationAirportId: Number(route.destinationAirportId),
            codeshare: route.codeshare || null,
            stops: route.stops,
            equipment: route.equipment,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to create route');
        }

        const result = await response.json();
        console.log('Route created:', result);

        // Update local state
        onRoutesChange([...routes, route]);

        // Also update allRoutes if provided
        if (allRoutes && onAllRoutesChange) {
          onAllRoutesChange([...allRoutes, route]);
        }
      }
    } catch (error) {
      console.error('Error saving route:', error);
      alert(`Failed to ${editingRoute ? 'update' : 'create'} route: ${error}`);
    }
  };

  const getStopsBadge = (stops: number) => {
    if (stops === 0) {
      return <Badge variant="default" className="bg-green-600">Non-stop</Badge>;
    }
    return <Badge variant="secondary">{stops} stop{stops > 1 ? 's' : ''}</Badge>;
  };

  return (
    <>
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Search Results</CardTitle>
              <CardDescription>
                Found {routes.length} route{routes.length !== 1 ? 's' : ''} matching your criteria
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleInsert} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Insert
              </Button>
              <Button 
                onClick={handleDelete} 
                variant="destructive" 
                size="sm"
                disabled={selectedRows.size === 0}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={selectAll}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Airline</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Origin</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Stops</TableHead>
                  <TableHead>Equipment</TableHead>
                  <TableHead className="w-12">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentRoutes.map((route) => {
                  const sourceAirport = (airports || []).find(a => a.iata === route.sourceAirport || String(a.airportId) === route.sourceAirportId);
                  const destAirport = (airports || []).find(a => a.iata === route.destinationAirport || String(a.airportId) === route.destinationAirportId);
                  const airline = (airlines || []).find(a => a.iata === route.airline || String(a.airlineId) === route.airlineId);
                  
                  return (
                    <TableRow key={route.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedRows.has(route.id)}
                          onCheckedChange={(checked: boolean) => handleSelectRow(route.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div>{airline?.name}</div>
                          <div className="text-sm text-gray-500">
                            {route.airline}
                            {route.codeshare && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                Codeshare
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{route.sourceAirport}</span>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                          <span>{route.destinationAirport}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div>{sourceAirport?.name}</div>
                          <div className="text-sm text-gray-500">{sourceAirport?.city}, {sourceAirport?.country}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div>{destAirport?.name}</div>
                          <div className="text-sm text-gray-500">{destAirport?.city}, {destAirport?.country}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getStopsBadge(route.stops)}</TableCell>
                      <TableCell>
                        <div className="text-sm">{route.equipment}</div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(route)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Showing {startIndex + 1}-{Math.min(endIndex, routes.length)} of {routes.length} routes
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <div className="text-sm">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <RouteDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        route={editingRoute}
        onSave={handleSave}
        airlines={airlines}
        airports={airports}
        planeTypes={planeTypes}
      />
    </>
  );
}
