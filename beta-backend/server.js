const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize connection pool to PostgreSQL (beta_db)
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'beta_db',
  password: process.env.DB_PASSWORD || 'Satnam123',
  port: process.env.DB_PORT || 5432,
});

// GET Route: Stream assets out of PostgreSQL
app.get('/api/assets', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM asset_register ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Database internal stream failure.');
  }
});

// POST Route: Ingest entries and handle Unique violations explicitly
app.post('/api/assets', async (req, res) => {
  const { asset_name, serial_number, ip_address, department } = req.body;
  try {
    const newAsset = await pool.query(
      'INSERT INTO asset_register (asset_name, serial_number, ip_address, department) VALUES ($1, $2, $3, $4) RETURNING *',
      [asset_name, serial_number, ip_address, department]
    );
    res.status(201).json(newAsset.rows[0]);
  } catch (err) {
    // Check if the database thrown error is code '23505' (PostgreSQL code for Unique Key Violation)
    if (err.code === '23505') {
      console.log(`[BLOCKED] Duplicate serial number key: ${serial_number}`);
      res.status(409).send('Conflict: Unique serial constraint validation failed.');
    } else {
      console.error(err.message);
      res.status(500).send('Server runtime pipeline error.');
    }
  }
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`[LIVE] Beta Backend engine active on http://localhost:5001`);
});