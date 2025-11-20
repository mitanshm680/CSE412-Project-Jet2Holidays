const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/jet2holidays';

const pool = new Pool({ connectionString });

async function query(text, params) {
  return pool.query(text, params);
}

module.exports = { pool, query };
