# Jet2Holiday Flight Management System

A small React + TypeScript frontend with a simple Node/Express backend that uses PostgreSQL and the OpenFlights-format `.dat` files as the data source.

This repository contains:
- `FlightManagementSystem/` — the Vite React frontend (TypeScript)
- `server/` — a minimal Node/Express API, a small importer (`import-dat.js`) and Postgres helper
- `create_table.sql` — database schema used by the importer

This top-level README explains how to set up PostgreSQL, import the datasets, run the backend API, and start the frontend for local development.

## Quick start (macOS / zsh)

1. Install and start PostgreSQL (Homebrew):

   ```bash
   brew update
   brew install postgresql
   brew services start postgresql
   ```

   Alternatively, if you prefer Docker for Postgres:

   ```bash
   docker run --name jet2pg -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:latest
   ```

2. Create the database and apply schema (from repo root):

   ```bash
   createdb jet2holidays
   psql -d jet2holidays -f create_table.sql
   ```

3. Ensure the dataset files are present at:

   ```text
   FlightManagementSystem/public/data/
     ├─ countries_small.dat
     ├─ airlines_small.dat
     ├─ airports_small.dat
     ├─ planes_small.dat
     └─ routes_small.dat
   ```

4. Configure the server environment:

   ```bash
   cd server
   cp .env.example .env
   # Edit server/.env and set DATABASE_URL and PORT if needed
   ```

   Example `server/.env`:

   ```env
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/jet2holidays
   PORT=4000
   ```

5. Install server dependencies and run the importer:

   ```bash
   cd server
   npm install
   npm run import
   ```

   Expected importer output examples:

   - Countries loaded
   - Airlines loaded
   - Airports loaded
   - Planes loaded
   - Routes loaded
   - Import finished

6. Start the API server:

   ```bash
   npm start
   ```

   You should see: `Server listening on port 4000` (or the port from your `.env`).

7. Start the frontend (new terminal):

   ```bash
   cd FlightManagementSystem
   npm install
   npm run dev
   ```

   The Vite dev server is configured to proxy `/api` requests to `http://localhost:4000` in development.

8. Verify the API and frontend:

   ```bash
   curl http://localhost:4000/api/all-routes | head -n 3
   curl http://localhost:4000/api/airlines | head -n 3
   curl http://localhost:4000/api/airports | head -n 3
   ```

   Or open the frontend in your browser and confirm routes appear in the table/search UI.

## Re-import / reset data

To wipe and re-import the data (destructive):

```bash
dropdb jet2holidays
createdb jet2holidays
psql -d jet2holidays -f create_table.sql
cd server
npm run import
```

## Troubleshooting

- Importer reports "file not found": confirm the data files are in `FlightManagementSystem/public/data/` and the filenames match.
- Backend cannot connect: confirm Postgres is running and `server/.env`'s `DATABASE_URL` points to the created database.
- Frontend shows no data: confirm `/api/all-routes` returns results (use curl or DevTools Network tab); restart Vite if you changed `vite.config.ts`.

## Short project overview

- Frontend: React + TypeScript + Vite. Key files changed to use the backend data are in `FlightManagementSystem/src/` (notably `App.tsx`, `components/flight-search.tsx`, `components/route-table.tsx`, `components/route-dialog.tsx`).
- Backend: Node.js + Express. `server/index.js` exposes endpoints used by the frontend. `server/import-dat.js` reads OpenFlights `.dat` files and inserts rows into the Postgres schema.
- Schema: `create_table.sql` describes the tables that the importer populates (Countries, Airlines, Airports, Planes, Routes).
