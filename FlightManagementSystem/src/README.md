# Jet2Holiday Flight Management System

A comprehensive flight route management system built with React and TypeScript that uses the OpenFlights dataset structure to allow users to search, manage, and query flight routes between airports worldwide.

## 🌟 Features

### Route Search & Filtering
- **Smart Airport Search**: Search by airport code (IATA/ICAO), city name, or full airport name
- **Aircraft Type Filtering**: Filter routes by specific aircraft types
- **Autocomplete Suggestions**: Real-time suggestions for airports and aircraft
- **Clean Results Display**: Shows only essential route information in an organized table

### Route Management (CRUD Operations)
- **Insert New Routes**: Add routes with complete details including airline, airports, stops, and equipment
- **Update Existing Routes**: Edit route information with pre-populated forms
- **Delete Routes**: Remove single or multiple routes using checkbox selection
- **Batch Operations**: Select multiple routes for deletion using checkboxes

### Smart Input Fields
- **Airline Autocomplete**: Search airlines by name or IATA code
- **Airport Autocomplete**: Search airports by name, IATA code, or city
- **Equipment Search**: Select aircraft types from predefined list
- **Validation**: All required fields marked with asterisk (*)

### OpenFlights Dataset Compliance
- Airline data with IDs, IATA/ICAO codes, and callsigns
- Airport data with coordinates, timezone, and altitude information
- Route data with proper airline/airport ID references
- Complete geographic information (latitude, longitude, timezone)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16.0.0 or higher)
- **npm** (v7.0.0 or higher) or **yarn** (v1.22.0 or higher)

## 🚀 Installation

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd jet2holiday-flight-management
```

### Step 2: Install Dependencies
```bash
npm install
```

Or if you're using yarn:
```bash
yarn install
```

### Step 3: Start the Development Server
```bash
npm run dev
```

Or with yarn:
```bash
yarn dev
```

The application will start at `http://localhost:5173` (or the next available port).

## 📦 Dependencies

### Core Dependencies
- **react** (^18.2.0): UI library
- **react-dom** (^18.2.0): React DOM rendering

### UI Components
- **@radix-ui/react-***: Accessible UI primitives for:
  - Dialog
  - Checkbox
  - Label
  - Slot
  - And other UI components

### Utilities
- **lucide-react**: Icon library for UI elements
- **class-variance-authority**: Utility for managing component variants
- **clsx**: Utility for conditional classNames
- **tailwind-merge**: Merge Tailwind CSS classes intelligently

### Styling
- **tailwindcss** (v4.0): Utility-first CSS framework
- **postcss**: CSS processing tool

### Development Dependencies
- **typescript**: Type safety
- **vite**: Build tool and development server
- **@vitejs/plugin-react**: React plugin for Vite
- **@types/react**: TypeScript definitions for React
- **@types/react-dom**: TypeScript definitions for React DOM

## 📂 Project Structure

```
jet2holiday-flight-management/
├── components/
│   ├── ui/                          # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── badge.tsx
│   │   ├── checkbox.tsx
│   │   ├── table.tsx
│   │   └── ...
│   ├── figma/
│   │   └── ImageWithFallback.tsx    # Protected image component
│   ├── flight-search.tsx            # Route search component
│   ├── route-dialog.tsx             # Add/Edit route dialog
│   └── route-table.tsx              # Routes data table
├── lib/
│   └── mock-data.ts                 # OpenFlights dataset structure
├── styles/
│   └── globals.css                  # Global styles and Tailwind config
├── App.tsx                          # Main application component
├── README.md                        # This file
└── package.json                     # Project dependencies
```

## 💾 Data Structure

The system follows the OpenFlights dataset format:

### Route Interface
```typescript
interface Route {
  id: string;                    // Unique identifier
  airline: string;               // Airline IATA code
  airlineId: string;             // Airline database ID
  sourceAirport: string;         // Source airport IATA code
  sourceAirportId: string;       // Source airport database ID
  destinationAirport: string;    // Destination airport IATA code
  destinationAirportId: string;  // Destination airport database ID
  codeshare: string;             // Codeshare indicator (Y/empty)
  stops: number;                 // Number of stops (0 = direct)
  equipment: string;             // Aircraft type(s)
}
```

### Airport Interface
```typescript
interface Airport {
  airportId: string;      // Unique airport ID
  name: string;           // Full airport name
  city: string;           // City name
  country: string;        // Country name
  iata: string;           // 3-letter IATA code
  icao: string;           // 4-letter ICAO code
  latitude: number;       // Decimal degrees
  longitude: number;      // Decimal degrees
  altitude: number;       // Feet above sea level
  timezone: number;       // Hours offset from UTC
  dst: string;            // Daylight savings time flag
  tzDatabase: string;     // Timezone database name
  type: string;           // Airport type
}
```

### Airline Interface
```typescript
interface Airline {
  airlineId: string;      // Unique airline ID
  name: string;           // Full airline name
  alias: string;          // Airline alias
  iata: string;           // 2-letter IATA code
  icao: string;           // 3-letter ICAO code
  callsign: string;       // Airline callsign
  country: string;        // Country of registration
  active: string;         // Active status (Y/N)
}
```

## 🎯 Usage Guide

### Searching for Routes

1. **By Airport**:
   - Enter origin airport (code, city, or name)
   - Enter destination airport (code, city, or name)
   - Use autocomplete suggestions for quick selection

2. **By Aircraft**:
   - Select aircraft type from the dropdown
   - View only routes operated with that specific aircraft

3. **Clear Search**:
   - Click "Clear" button to reset all filters

### Managing Routes

#### Adding a New Route
1. Click "Insert New Route" button (green plus icon)
2. Fill in all required fields:
   - **Airline**: Search and select from available airlines
   - **Route Start (Origin)**: Enter airport code (e.g., JFK)
   - **Route End (Destination)**: Enter airport code (e.g., LAX)
   - **Stops**: Number of stops (0 for direct flight)
   - **Equipment**: Select aircraft type
3. Click "Insert" to save

#### Updating a Route
1. Select route(s) using checkboxes
2. Click "Update Route" button (blue pencil icon)
3. Modify the desired fields
4. Click "Update" to save changes

#### Deleting Routes
1. Select one or more routes using checkboxes
2. Click "Delete Selected" button (red trash icon)
3. Confirm the deletion

## 🎨 UI Components

The system uses shadcn/ui components built on Radix UI primitives:
- **Button**: Primary, outline, and destructive variants
- **Dialog**: Modal dialogs for route management
- **Input**: Text input with autocomplete support
- **Checkbox**: Multi-select functionality
- **Table**: Responsive data table with sorting
- **Badge**: Visual indicators for codeshare routes
- **Label**: Form field labels with required markers

## 🌍 Sample Data

The application comes with pre-populated data including:
- **13 Major Airlines**: American Airlines, British Airways, Emirates, Lufthansa, etc.
- **18 International Airports**: JFK, LAX, LHR, CDG, DXB, SIN, NRT, SYD, etc.
- **20 Flight Routes**: Covering major international connections
- **12 Aircraft Types**: Boeing 737/747/757/777/787, Airbus A320/A321/A330/A340/A350/A380, Embraer E190

## 🔧 Customization

### Adding More Data

Edit `/lib/mock-data.ts` to add:
- More airlines to `mockAirlines` array
- More airports to `mockAirports` array
- More routes to `mockRoutes` array
- Additional aircraft types to `planeTypes` array

### Styling

- Global styles: `/styles/globals.css`
- Tailwind configuration: Embedded in `/styles/globals.css` (Tailwind v4.0)
- Component-specific styles: Inline with Tailwind utility classes

## 🚫 Important Notes

### Protected Files
Do not modify these system files:
- `/components/figma/ImageWithFallback.tsx`

### Data Integrity
- Always maintain proper ID references between airlines, airports, and routes
- Ensure IATA codes are valid 2-letter (airlines) or 3-letter (airports) codes
- Keep latitude/longitude values in decimal degrees format
- Timezone values should be hours offset from UTC

### Performance Considerations
- The search is performed on the client-side with mock data
- For production use, consider implementing:
  - Backend API integration
  - Database persistence
  - Server-side search and pagination
  - Caching strategies

## 📝 Future Enhancements

Potential features for future development:
- Real-time flight status integration
- Distance and duration calculations
- Interactive route maps with geographic visualization
- Multi-leg route planning
- Historical route data and analytics
- Export functionality (CSV, PDF)
- Advanced filtering (by airline, country, stops, etc.)
- User authentication and preferences
- Backend API integration
- Database persistence (PostgreSQL, MongoDB)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **OpenFlights**: Dataset structure and format
- **shadcn/ui**: Beautiful and accessible UI components
- **Radix UI**: Unstyled, accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide**: Icon library

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact the development team
- Check the documentation in `/guidelines/Guidelines.md`

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**
