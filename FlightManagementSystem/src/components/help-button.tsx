import { useState } from 'react';
import { HelpCircle, X, Search, Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

export function HelpButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Help Button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Help"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          backgroundColor: 'black',
          color: 'white',
          borderRadius: '50%',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          zIndex: 99999,
        }}
      >
        <HelpCircle style={{ width: '28px', height: '28px' }} />
      </button>

      {/* Help Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent style={{ maxWidth: '700px' }} className="sm:max-w-[300px]">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-indigo-600" />
              How to Use Jet2Holiday Flight Management System
            </DialogTitle>
            <DialogDescription>
              Learn about the available actions and features
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Search Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Search className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold">Search Routes</h3>
              </div>
              <p className="text-sm text-gray-600 ml-13">
                Use the search filters to find flights by origin, destination, airline, or aircraft type.
                Leave fields empty to see all routes.
              </p>
            </div>

            {/* Insert Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold">Insert New Route</h3>
              </div>
              <p className="text-sm text-gray-600 ml-13">
                Click the "Insert" button to add a new flight route. All fields are required.
                Select airline, origin, destination, equipment, and number of stops.
              </p>
            </div>

            {/* Update Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Pencil className="w-5 h-5 text-amber-600" />
                </div>
                <h3 className="text-lg font-semibold">Update Route</h3>
              </div>
              <p className="text-sm text-gray-600 ml-13">
                Click the pencil icon on any route to edit it. You can modify the number of stops
                and equipment. Note: Airline, origin, and destination cannot be changed.
              </p>
            </div>

            {/* Delete Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold">Delete Routes</h3>
              </div>
              <p className="text-sm text-gray-600 ml-13">
                Select one or more routes using the checkboxes, then click the "Delete" button.
                You can select all routes on the current page using the header checkbox.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t mt-4">
            <Button onClick={() => setOpen(false)} variant="default">
              Got it!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
