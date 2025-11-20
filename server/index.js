const express = require('express');
const cors = require('cors');
const { query } = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

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

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
