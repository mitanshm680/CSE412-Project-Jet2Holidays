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


# Server — Setup & Import Instructions

This document explains how to get the Node/Express server running and how to import the OpenFlights `.dat` files into a local PostgreSQL database so the frontend can consume real data.

Assumptions
- You have the project checked out at the repository root.
- The `.dat` dataset files are present under `FlightManagementSystem/public/data/`:
  - `countries_small.dat`
  - `airlines_small.dat`
  - `airports_small.dat`
  - `planes_small.dat`
  - `routes_small.dat`
- You are using macOS / zsh (commands in examples use zsh). Adjust for other shells/OS.

Quick overview
1. Install PostgreSQL (Homebrew or Docker).
2. Create database `jet2holidays` and apply `create_table.sql` schema.
3. Configure `server/.env` with `DATABASE_URL`.
4. Run the importer: `npm run import` in `server/`.
5. Start the API server: `npm start`.
6. Start the frontend (Vite) and verify it fetches `/api`.

Detailed steps

1) Install PostgreSQL (Homebrew)

```bash
# using Homebrew
brew update
brew install postgresql

# start postgres service
brew services start postgresql
```

If you prefer Docker:

```bash
docker run --name jet2pg -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:latest
```

2) Create the database and apply schema

```bash
# create database named jet2holidays (uses current user by default)
createdb jet2holidays

# apply schema from repo root
psql -d jet2holidays -f create_table.sql
```

3) Place dataset files

Make sure the importer can find the data files at the expected path:

```
FlightManagementSystem/public/data/
  ├─ countries_small.dat
  ├─ airlines_small.dat
  ├─ airports_small.dat
  ├─ planes_small.dat
  └─ routes_small.dat
```

4) Configure server environment

Copy the example env and edit it to match your DB connection string:

```bash
cd server
cp .env.example .env
# Edit server/.env and set DATABASE_URL
```

Example `server/.env` contents:

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/jet2holidays
PORT=4000
```

If you created a dedicated user, replace `postgres:postgres` with `user:password`.

5) Install server deps and run the importer

```bash
cd server
npm install
npm run import
```

Expected output (examples):

- Countries loaded
- Airlines loaded
- Airports loaded
- Planes loaded
- Routes loaded
- Import finished

If the importer reports "file not found" or other errors, check the data directory path and filenames.

6) Start the API server

```bash
npm start
```

You should see:

```
Server listening on port 4000
```

7) Start the frontend (Vite)

Open a new terminal and:

```bash
cd FlightManagementSystem
npm install
npm run dev
```

The frontend `vite.config.ts` is configured to proxy `/api` to `http://localhost:4000` in development. If you changed the backend port, update the proxy accordingly.

8) Verify endpoints and database

Using curl:

```bash
curl http://localhost:4000/api/all-routes | head -n 3
curl http://localhost:4000/api/airlines | head -n 3
curl http://localhost:4000/api/airports | head -n 3
```

Using psql to inspect counts:

```bash
psql -d jet2holidays
SELECT COUNT(*) FROM Airlines;
SELECT COUNT(*) FROM Airports;
SELECT COUNT(*) FROM Routes;
\q
```

Troubleshooting
- Backend crashes on start or importer fails:
  - Check `server/.env` and `server/db.js` connection string. Make sure the `DATABASE_URL` points to the same DB the importer used.
  - Ensure Postgres is running (Homebrew service or Docker container).
  - Check port conflicts.
- Frontend shows no data:
  - Confirm `/api/all-routes` returns data using curl or DevTools Network tab.
  - Restart Vite dev server after any `vite.config.ts` change (proxy changes require restart).
- Importer inserted 0 rows:
  - Confirm importer printed "Import finished".
  - Verify the importer used the same `DATABASE_URL` (the importer reads `server/.env`).

Re-importing / wiping data

To start from a clean slate:

```bash
# drop and recreate DB (careful: this deletes data)
dropdb jet2holidays
createdb jet2holidays
psql -d jet2holidays -f create_table.sql

# re-run importer
cd server
npm run import
```

Optional: use Docker Compose

If some teammates prefer Docker, bring up Postgres with the supplied compose file (repo root):

```bash
docker compose up -d
```

Then set `server/.env` to point at the composed container (if port forwarded to 5432 you can still use `localhost:5432`).
