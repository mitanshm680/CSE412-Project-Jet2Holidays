const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/jet2holidays';
const pool = new Pool({ connectionString });

function parseLine(line) {
  const fields = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { cur += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      fields.push(cur === '\\N' ? null : cur);
      cur = '';
    } else cur += ch;
  }
  if (cur.length > 0 || line.endsWith(',')) fields.push(cur === '\\N' ? null : cur);
  return fields.map(f => (f === null ? null : f.trim()));
}

async function run() {
  const dataDir = path.resolve(__dirname, '..', 'FlightManagementSystem', 'public', 'data');
  if (!fs.existsSync(dataDir)) throw new Error('data directory not found: ' + dataDir);

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Countries
    const countriesPath = path.join(dataDir, 'countries_small.dat');
    if (fs.existsSync(countriesPath)) {
      const lines = fs.readFileSync(countriesPath, 'utf8').split(/\r?\n/).filter(Boolean);
      for (const l of lines) {
        const f = parseLine(l);
        await client.query('INSERT INTO Countries(Name, ISO_Code, DAFIF_Code) VALUES($1,$2,$3) ON CONFLICT (Name) DO NOTHING', [f[0], f[1] || null, f[2] || null]);
      }
      console.log('Countries loaded');
    }

    // Airlines
    const airlinesPath = path.join(dataDir, 'airlines_small.dat');
    if (fs.existsSync(airlinesPath)) {
      const lines = fs.readFileSync(airlinesPath, 'utf8').split(/\r?\n/).filter(Boolean);
      for (const l of lines) {
        const f = parseLine(l);
        const id = f[0] ? parseInt(f[0], 10) : null;
        await client.query('INSERT INTO Airlines(AirlineID, Name, Alias, IATA, ICAO, Callsign, Country, Active) VALUES($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT (AirlineID) DO NOTHING', [id, f[1] || null, f[2] || null, f[3] || null, f[4] || null, f[5] || null, f[6] || null, f[7] || null]);
      }
      console.log('Airlines loaded');
    }

    // Airports
    const airportsPath = path.join(dataDir, 'airports_small.dat');
    if (fs.existsSync(airportsPath)) {
      const lines = fs.readFileSync(airportsPath, 'utf8').split(/\r?\n/).filter(Boolean);
      for (const l of lines) {
        const f = parseLine(l);
        const id = f[0] ? parseInt(f[0], 10) : null;
        await client.query('INSERT INTO Airports(AirportID, Name, City, Country, IATA, ICAO, Latitude, Longitude, Altitude, Timezone, DST, TzDatabaseTimezone, TYPE, Source) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) ON CONFLICT (AirportID) DO NOTHING', [id, f[1] || null, f[2] || null, f[3] || null, f[4] || null, f[5] || null, f[6] ? parseFloat(f[6]) : null, f[7] ? parseFloat(f[7]) : null, f[8] ? parseFloat(f[8]) : null, f[9] ? parseFloat(f[9]) : null, f[10] || null, f[11] || null, f[12] || null, f[13] || null]);
      }
      console.log('Airports loaded');
    }

    // Planes
    const planesPath = path.join(dataDir, 'planes_small.dat');
    if (fs.existsSync(planesPath)) {
      const lines = fs.readFileSync(planesPath, 'utf8').split(/\r?\n/).filter(Boolean);
      for (const l of lines) {
        const f = parseLine(l);
        await client.query('INSERT INTO Planes(Name, IATACode, ICAOCode) VALUES($1,$2,$3) ON CONFLICT (IATACode) DO NOTHING', [f[0] || null, f[1] || null, f[2] || null]);
      }
      console.log('Planes loaded');
    }

    // Routes
    const routesPath = path.join(dataDir, 'routes_small.dat');
    if (fs.existsSync(routesPath)) {
      const lines = fs.readFileSync(routesPath, 'utf8').split(/\r?\n/).filter(Boolean);
      for (const l of lines) {
        const f = parseLine(l);
        const airline = f[0] || null;
        const airlineId = f[1] ? parseInt(f[1], 10) : null;
        const sourceAirport = f[2] || null;
        const sourceAirportId = f[3] ? parseInt(f[3], 10) : null;
        const destAirport = f[4] || null;
        const destAirportId = f[5] ? parseInt(f[5], 10) : null;
        const codeshare = f[6] || null;
        const stops = f[7] ? parseInt(f[7], 10) : 0;
        const equipment = f[8] || null;
        // If equipment not present in Planes table, insert with null to avoid FK error
        let equip = equipment;
        if (equip) {
          const r = await client.query('SELECT 1 FROM Planes WHERE IATACode=$1 LIMIT 1', [equip]);
          if (r.rowCount === 0) equip = null;
        }
        if (airlineId == null || sourceAirportId == null || destAirportId == null) continue;
        await client.query('INSERT INTO Routes(Airline, AirlineID, SourceAirport, SourceAirportID, DestinationAirport, DestinationAirportID, Codeshare, Stops, Equipment) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT DO NOTHING', [airline, airlineId, sourceAirport, sourceAirportId, destAirport, destAirportId, codeshare, stops, equip]);
      }
      console.log('Routes loaded');
    }

    await client.query('COMMIT');
    console.log('Import finished');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Import failed', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

run().catch(e => { console.error(e); process.exit(1); });
