const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 5001;

// 1. MIDDLEWARE: This fixes the "Network Error" by opening the security gates
app.use(cors()); 
app.use(express.json());

// 2. DATABASE CONNECTION: Connects to Render PostgreSQL with required SSL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Render requires this for database connections!
  }
});

// 3. AUTO-TABLE CREATOR: Automatically builds your database table if it's missing!
const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS assets (
        id SERIAL PRIMARY KEY,
        asset_name VARCHAR(255) NOT NULL,
        serial_number VARCHAR(255) NOT NULL,
        status VARCHAR(50) NOT NULL
      );
    `);
    console.log("✅ Database tables are ready to go!");
  } catch (err) {
    console.error("❌ Database initialization error:", err);
  }
};
initDB();

// 4. GET ROUTE: Fetches all assets to show in your frontend table
app.get('/api/assets', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM assets ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// 5. POST ROUTE: Receives data from your frontend form and saves it
app.post('/api/assets', async (req, res) => {
  try {
    const { assetName, serialNumber, status } = req.body;
    const result = await pool.query(
      'INSERT INTO assets (asset_name, serial_number, status) VALUES ($1, $2, $3) RETURNING *',
      [assetName, serialNumber, status]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// 6. START SERVER
app.listen(port, () => {
  console.log(`🚀 Server is running smoothly on port ${port}`);
});