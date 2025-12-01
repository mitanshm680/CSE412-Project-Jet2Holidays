const express = require('express');
const cors = require('cors');
const { query } = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

// Logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);

  // Log request body for POST/PUT/PATCH/DELETE
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method) && Object.keys(req.body).length > 0) {
    console.log('  Body:', JSON.stringify(req.body, null, 2));
  }

  // Log query params if they exist
  if (Object.keys(req.query).length > 0) {
    console.log('  Query:', JSON.stringify(req.query));
  }

  next();
});

// Return all routes (joined info). Useful for frontend that wants full dataset.
app.get('/api/all-routes', async (req, res) => {
  try {
    const sql = `SELECT r.*, al.Name as airline_name, a1.Name as source_name, a1.City as source_city, a2.Name as dest_name, a2.City as dest_city
      FROM Routes r
      LEFT JOIN Airports a1 ON r.SourceAirportID = a1.AirportID
      LEFT JOIN Airports a2 ON r.DestinationAirportID = a2.AirportID
      LEFT JOIN Airlines al ON r.AirlineID = al.AirlineID`;
    const result = await query(sql);
    res.json({ routes: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal_error' });
  }
});

// Paginated routes
app.get('/api/routes', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const offset = (page - 1) * limit;
    const { origin, destination, airline, plane } = req.query;

    const filters = [];
    const params = [];

    if (origin) {
      params.push(`%${origin.toLowerCase()}%`);
      filters.push(`(LOWER(a1.city) LIKE $${params.length} OR LOWER(a1.name) LIKE $${params.length} OR LOWER(r.SourceAirport) LIKE $${params.length})`);
    }

    if (destination) {
      params.push(`%${destination.toLowerCase()}%`);
      filters.push(`(LOWER(a2.city) LIKE $${params.length} OR LOWER(a2.name) LIKE $${params.length} OR LOWER(r.DestinationAirport) LIKE $${params.length})`);
    }

    if (airline) {
      params.push(`%${airline.toLowerCase()}%`);
      filters.push(`(LOWER(al.name) LIKE $${params.length} OR LOWER(al.iata) LIKE $${params.length})`);
    }

    if (plane) {
      params.push(`%${plane.toLowerCase()}%`);
      filters.push(`LOWER(r.Equipment) LIKE $${params.length}`);
    }

    const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

    const countSql = `SELECT COUNT(*)::int AS total FROM Routes r
      LEFT JOIN Airports a1 ON r.SourceAirportID = a1.AirportID
      LEFT JOIN Airports a2 ON r.DestinationAirportID = a2.AirportID
      LEFT JOIN Airlines al ON r.AirlineID = al.AirlineID
      ${where}`;

    const countRes = await query(countSql, params);
    const total = countRes.rows[0]?.total || 0;

    const sql = `SELECT r.*, al.Name as airline_name, a1.Name as source_name, a1.City as source_city, a2.Name as dest_name, a2.City as dest_city
      FROM Routes r
      LEFT JOIN Airports a1 ON r.SourceAirportID = a1.AirportID
      LEFT JOIN Airports a2 ON r.DestinationAirportID = a2.AirportID
      LEFT JOIN Airlines al ON r.AirlineID = al.AirlineID
      ${where}
      ORDER BY r.AirlineID, r.SourceAirportID
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;

    const allParams = params.concat([limit, offset]);
    const result = await query(sql, allParams);

    res.json({ total, page, limit, routes: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal_error' });
  }
});

// Airlines lookup
app.get('/api/airlines', async (req, res) => {
  try {
    const sql = `SELECT AirlineID as "airlineId", Name as "name", Alias as "alias", IATA as "iata", ICAO as "icao", Callsign as "callsign", Country as "country", Active as "active" FROM Airlines ORDER BY Name`;
    const result = await query(sql);
    res.json({ airlines: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal_error' });
  }
});

// Airports lookup
app.get('/api/airports', async (req, res) => {
  try {
    const sql = `SELECT AirportID as "airportId", Name as "name", City as "city", Country as "country", IATA as "iata", ICAO as "icao" FROM Airports ORDER BY Name`;
    const result = await query(sql);
    res.json({ airports: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal_error' });
  }
});

// CREATE: Add a new route
app.post('/api/routes', async (req, res) => {
  try {
    const {
      airline,
      airlineId,
      sourceAirport,
      sourceAirportId,
      destinationAirport,
      destinationAirportId,
      codeshare,
      stops,
      equipment
    } = req.body;

    console.log(`✅ Creating new route: ${airline} ${sourceAirport} → ${destinationAirport} (${equipment})`);

    // Validate required fields
    if (!airlineId || !sourceAirportId || !destinationAirportId || !equipment) {
      console.log('❌ Validation failed: Missing required fields');
      return res.status(400).json({
        error: 'Missing required fields: airlineId, sourceAirportId, destinationAirportId, equipment'
      });
    }

    const sql = `INSERT INTO Routes
      (Airline, AirlineID, SourceAirport, SourceAirportID,
       DestinationAirport, DestinationAirportID, Codeshare, Stops, Equipment)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`;

    const params = [
      airline || null,
      airlineId,
      sourceAirport || null,
      sourceAirportId,
      destinationAirport || null,
      destinationAirportId,
      codeshare || null,
      stops || 0,
      equipment
    ];

    const result = await query(sql, params);
    console.log(`✅ Route created successfully:`, result.rows[0]);
    res.status(201).json({ message: 'Route created', route: result.rows[0] });
  } catch (err) {
    console.error('❌ Error creating route:', err.message);
    if (err.code === '23505') {
      res.status(409).json({ error: 'Route already exists with this combination' });
    } else if (err.code === '23503') {
      res.status(400).json({ error: 'Invalid airline, airport, or equipment reference' });
    } else {
      res.status(500).json({ error: 'internal_error', details: err.message });
    }
  }
});

// UPDATE: Modify an existing route
app.put('/api/routes', async (req, res) => {
  try {
    const {
      airlineId,
      sourceAirportId,
      destinationAirportId,
      oldEquipment,
      newEquipment,
      newStops,
      newCodeshare,
      airline,
      sourceAirport,
      destinationAirport
    } = req.body;

    console.log(`🔄 Updating route: AirlineID=${airlineId}, SourceID=${sourceAirportId}, DestID=${destinationAirportId}, Equipment=${oldEquipment} → ${newEquipment || oldEquipment}`);

    // Validate required fields for composite key
    if (!airlineId || !sourceAirportId || !destinationAirportId || !oldEquipment) {
      console.log('❌ Validation failed: Missing composite key fields');
      return res.status(400).json({
        error: 'Missing required fields for route identification: airlineId, sourceAirportId, destinationAirportId, oldEquipment'
      });
    }

    // If equipment changed, we need to DELETE and INSERT (can't UPDATE primary key)
    if (newEquipment && newEquipment !== oldEquipment) {
      console.log(`⚠️  Equipment changed: ${oldEquipment} → ${newEquipment}. Deleting old route and inserting new one.`);

      // First, delete the old route
      const deleteSql = `DELETE FROM Routes
        WHERE AirlineID = $1
          AND SourceAirportID = $2
          AND DestinationAirportID = $3
          AND Equipment = $4
        RETURNING *`;

      const deleteParams = [airlineId, sourceAirportId, destinationAirportId, oldEquipment];
      const deleteResult = await query(deleteSql, deleteParams);

      if (deleteResult.rows.length === 0) {
        console.log('❌ Route not found');
        return res.status(404).json({ error: 'Route not found' });
      }

      const oldRoute = deleteResult.rows[0];
      console.log(`✅ Old route deleted:`, oldRoute);

      // Then, insert the new route with updated equipment
      const insertSql = `INSERT INTO Routes
        (Airline, AirlineID, SourceAirport, SourceAirportID,
         DestinationAirport, DestinationAirportID, Codeshare, Stops, Equipment)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *`;

      const insertParams = [
        airline || oldRoute.airline,
        airlineId,
        sourceAirport || oldRoute.sourceairport,
        sourceAirportId,
        destinationAirport || oldRoute.destinationairport,
        destinationAirportId,
        newCodeshare !== undefined ? newCodeshare : oldRoute.codeshare,
        newStops !== undefined ? newStops : oldRoute.stops,
        newEquipment
      ];

      const insertResult = await query(insertSql, insertParams);
      console.log(`✅ New route inserted:`, insertResult.rows[0]);
      res.json({ message: 'Route updated (via delete/insert)', route: insertResult.rows[0] });
    } else {
      // Equipment didn't change, just UPDATE normally
      const sql = `UPDATE Routes
        SET Stops = $1, Codeshare = $2
        WHERE AirlineID = $3
          AND SourceAirportID = $4
          AND DestinationAirportID = $5
          AND Equipment = $6
        RETURNING *`;

      const params = [
        newStops !== undefined ? newStops : 0,
        newCodeshare || null,
        airlineId,
        sourceAirportId,
        destinationAirportId,
        oldEquipment
      ];

      const result = await query(sql, params);

      if (result.rows.length === 0) {
        console.log('❌ Route not found');
        res.status(404).json({ error: 'Route not found' });
      } else {
        console.log(`✅ Route updated successfully:`, result.rows[0]);
        res.json({ message: 'Route updated', route: result.rows[0] });
      }
    }
  } catch (err) {
    console.error('❌ Error updating route:', err.message);
    if (err.code === '23505') {
      res.status(409).json({ error: 'Route already exists with this equipment' });
    } else if (err.code === '23503') {
      res.status(400).json({ error: 'Invalid airline, airport, or equipment reference' });
    } else {
      res.status(500).json({ error: 'internal_error', details: err.message });
    }
  }
});

// DELETE: Remove a route
app.delete('/api/routes', async (req, res) => {
  try {
    const { airlineId, sourceAirportId, destinationAirportId, equipment } = req.body;

    console.log(`🗑️  Deleting route: AirlineID=${airlineId}, SourceID=${sourceAirportId}, DestID=${destinationAirportId}, Equipment=${equipment}`);

    // Validate required fields for composite key
    if (!airlineId || !sourceAirportId || !destinationAirportId || !equipment) {
      console.log('❌ Validation failed: Missing composite key fields');
      return res.status(400).json({
        error: 'Missing required fields for route identification: airlineId, sourceAirportId, destinationAirportId, equipment'
      });
    }

    const sql = `DELETE FROM Routes
      WHERE AirlineID = $1
        AND SourceAirportID = $2
        AND DestinationAirportID = $3
        AND Equipment = $4
      RETURNING *`;

    const params = [airlineId, sourceAirportId, destinationAirportId, equipment];
    const result = await query(sql, params);

    if (result.rows.length === 0) {
      console.log('❌ Route not found');
      res.status(404).json({ error: 'Route not found' });
    } else {
      console.log(`✅ Route deleted successfully:`, result.rows[0]);
      res.json({ message: 'Route deleted', route: result.rows[0] });
    }
  } catch (err) {
    console.error('❌ Error deleting route:', err.message);
    res.status(500).json({ error: 'internal_error', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
