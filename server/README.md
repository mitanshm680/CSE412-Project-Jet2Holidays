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
