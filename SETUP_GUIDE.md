# PostgreSQL Setup and Data Loading Guide

This guide will walk you through setting up PostgreSQL and loading your airline data from .dat files.

## Prerequisites
- Windows operating system
- Administrator access

---

## Step 1: Verify that postgres is installed

1. Run:
   ```bash
   psql --version
   ```
---

## Step 2: Set Up Your Database

### 2.1 Connect to PostgreSQL
1. Open Command Prompt
2. Connect to PostgreSQL:
   ```bash
   psql
   ```
3. Enter the password you set during installation

### 2.2 Create the Database
In the `psql` prompt (you'll see `postgres=#`), run:

```sql
CREATE DATABASE jet2holidays;
```

You should see: `CREATE DATABASE`

### 2.3 Connect to Your New Database
```sql
\c jet2holidays
```

You should see: `You are now connected to database "jet2holidays"`

### 2.4 Exit psql for Now
```sql
\q
```

---

## Step 3: Create Database Tables

### 3.1 Run the SQL Script
From Command Prompt, navigate to your project directory:

```bash
cd C:\Users\mitan\Jet2Holidays
```

Run the table creation script:

```bash
psql -d jet2holidays -f create_table.sql
```

You should see multiple `CREATE TABLE` messages.

### 3.2 Verify Tables Were Created
```bash
psql -d jet2holidays
```

Then in psql:
```sql
\dt
```

You should see a list of 5 tables: airlines, airports, countries, planes, routes

---

## Step 4: Load Data from .dat Files

### 4.1 Understanding the File Format
Your .dat files are **comma-separated values (CSV)** with:
- Delimiter: `,` (comma)
- NULL values: `\N`
- No header row

### 4.2 Load Data in Order

**IMPORTANT:** Load in this specific order due to foreign key dependencies!

#### 4.2.1 Connect to Database
```bash
psql -d jet2holidays
```

#### 4.2.2 Load Countries (First - No Dependencies)
```sql
\COPY Countries(Name, ISO_Code, DAFIF_Code) 
FROM 'countries_small.dat' 
WITH (FORMAT csv, DELIMITER ',', NULL '\N');
```

#### 4.2.3 Load Airlines (Depends on Countries)
```sql
\COPY Airlines(AirlineID, Name, Alias, IATA, ICAO, Callsign, Country, Active) 
FROM 'airlines_small.dat' 
WITH (FORMAT csv, DELIMITER ',', NULL '\N');
```

#### 4.2.4 Load Airports (Depends on Countries)
```sql
\COPY Airports(AirportID, Name, City, Country, IATA, ICAO, Latitude, Longitude, Altitude, Timezone, DST, TzDatabaseTimezone, TYPE, Source) FROM 'airports_small.dat' 
WITH (FORMAT csv, DELIMITER ',', NULL '\N');
```

#### 4.2.5 Load Planes (No Dependencies)
```sql
\COPY Planes(Name, IATACode, ICAOCode) 
FROM 'planes_small.dat' 
WITH (FORMAT csv, DELIMITER ',', NULL '\N');
```

#### 4.2.6 Load Routes (Depends on Airlines, Airports, Planes)
```sql
\COPY Routes(Airline, AirlineID, SourceAirport, SourceAirportID, DestinationAirport, DestinationAirportID, Codeshare, Stops, Equipment) 
FROM 'routes_small.dat' 
WITH (FORMAT csv, DELIMITER ',', NULL '\N');
```

After each `\COPY` command, you should see output like: `COPY 5` (indicating 5 rows were loaded).

---

## Step 5: Verify Data Was Loaded

### 5.1 Check Row Counts
In psql, run:

```sql
SELECT 'Countries' as table_name, COUNT(*) as row_count FROM Countries
UNION ALL
SELECT 'Airlines', COUNT(*) FROM Airlines
UNION ALL
SELECT 'Airports', COUNT(*) FROM Airports
UNION ALL
SELECT 'Planes', COUNT(*) FROM Planes
UNION ALL
SELECT 'Routes', COUNT(*) FROM Routes;
```

### 5.2 Sample Data Queries

**View some countries:**
```sql
SELECT * FROM Countries LIMIT 5;
```

**View some airlines:**
```sql
SELECT * FROM Airlines LIMIT 5;
```

**View routes with airline names:**
```sql
SELECT
    r.AirlineID,
    a.Name as AirlineName,
    r.SourceAirport,
    r.DestinationAirport
FROM Routes r
JOIN Airlines a ON r.AirlineID = a.AirlineID
LIMIT 10;
```

---

## Step 6: Exit and Reconnect Later

### 6.1 Exit psql
```sql
\q
```

### 6.2 To Reconnect Later
```bash
psql -U postgres -d jet2holidays
```

---

## Troubleshooting

### Issue: "psql: command not found"
**Solution:** Add PostgreSQL to your PATH:
1. Search "Environment Variables" in Windows
2. Click "Environment Variables"
3. Under "System variables", find "Path"
4. Click "Edit"
5. Click "New"
6. Add: `C:\Program Files\PostgreSQL\16\bin`
7. Click OK and restart Command Prompt

### Issue: "FATAL: password authentication failed"
**Solution:** You entered the wrong password. Reset it:
1. Open pgAdmin 4
2. Right-click on the server → Properties
3. Use the password you set during installation

### Issue: "ERROR: duplicate key value violates unique constraint"
**Solution:** You've already loaded the data. To reload:
```sql
-- Delete all data from tables (in reverse order)
DELETE FROM Routes;
DELETE FROM Planes;
DELETE FROM Airports;
DELETE FROM Airlines;
DELETE FROM Countries;
```

### Issue: Foreign key constraint violations
**Solution:** Make sure you load tables in the correct order (see Step 4.2)

### Issue: File path not found in \COPY command
**Solution:**
- Use forward slashes `/` instead of backslashes `\` in the path
- Use absolute paths, not relative
- Correct: `C:/Users/mitan/Jet2Holidays/countries_small.dat`
- Incorrect: `C:\Users\mitan\Jet2Holidays\countries_small.dat`

---

## Useful psql Commands

| Command | Description |
|---------|-------------|
| `\l` | List all databases |
| `\c database_name` | Connect to a database |
| `\dt` | List all tables |
| `\d table_name` | Describe a table structure |
| `\q` | Quit psql |
| `\?` | Help with psql commands |
| `\h` | Help with SQL commands |

---

## Next Steps

Once your data is loaded, you can:
- Write SQL queries to analyze airline routes
- Create views for common queries
- Add indexes for better performance
- Connect to the database from Python, Java, or other applications

---

## Quick Reference: Complete Loading Script

Save this as a file if you need to reload data later:

```sql
-- Connect to database first: psql -U postgres -d jet2holidays

-- Clear existing data (if reloading)
DELETE FROM Routes;
DELETE FROM Planes;
DELETE FROM Airports;
DELETE FROM Airlines;
DELETE FROM Countries;

-- Load data in correct order
\COPY Countries(Name, ISO_Code, DAFIF_Code) FROM 'C:/Users/mitan/Jet2Holidays/countries_small.dat' WITH (FORMAT csv, DELIMITER ',', NULL '\N');

\COPY Airlines(AirlineID, Name, Alias, IATA, ICAO, Callsign, Country, Active) FROM 'C:/Users/mitan/Jet2Holidays/airlines_small.dat' WITH (FORMAT csv, DELIMITER ',', NULL '\N');

\COPY Airports(AirportID, Name, City, Country, IATA, ICAO, Latitude, Longitude, Altitude, Timezone, DST, TzDatabaseTimezone, TYPE, Source) FROM 'C:/Users/mitan/Jet2Holidays/airports_small.dat' WITH (FORMAT csv, DELIMITER ',', NULL '\N');

\COPY Planes(Name, IATACode, ICAOCode) FROM 'C:/Users/mitan/Jet2Holidays/planes_small.dat' WITH (FORMAT csv, DELIMITER ',', NULL '\N');

\COPY Routes(Airline, AirlineID, SourceAirport, SourceAirportID, DestinationAirport, DestinationAirportID, Codeshare, Stops, Equipment) FROM 'C:/Users/mitan/Jet2Holidays/routes_small.dat' WITH (FORMAT csv, DELIMITER ',', NULL '\N');

-- Verify counts
SELECT 'Countries' as table_name, COUNT(*) as row_count FROM Countries
UNION ALL
SELECT 'Airlines', COUNT(*) FROM Airlines
UNION ALL
SELECT 'Airports', COUNT(*) FROM Airports
UNION ALL
SELECT 'Planes', COUNT(*) FROM Planes
UNION ALL
SELECT 'Routes', COUNT(*) FROM Routes;
```
