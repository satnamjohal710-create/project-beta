const express = require('express');
const cors = require('cors');
const { Pool } = require('pg'); // Declared once cleanly at the top

const app = express();
const port = process.env.PORT || 5001;

// Middlewares
app.use(cors({ origin: '*' })); // Allows your frontend deployed anywhere (like Azure) to communicate with this API
app.use(express.json());

// Database Connection Pool Initialization
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

// Structural Schema Initialization Function
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

// API Endpoint: Fetch all assets
app.get('/api/assets', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM assets ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error("Endpoint GET error:", err.message);
    res.status(500).send("Server Error");
  }
});

// API Endpoint: Register a new hardware asset
app.post('/api/assets', async (req, res) => {
  try {
    const { assetName, serialNumber, status } = req.body;
    const result = await pool.query(
      'INSERT INTO assets (asset_name, serial_number, status) VALUES ($1, $2, $3) RETURNING *',
      [assetName, serialNumber, status]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Endpoint POST error:", err.message);
    res.status(500).send("Server Error");
  }
});

// Root Health-Check Endpoint (Helps Render monitor container uptime)
app.get('/', (req, res) => {
  res.send("🚀 Project Beta API Engine Status: ONLINE & FUNCTIONAL");
});

// Start listening for connections
app.listen(port, () => {
  console.log(`🚀 Server is running smoothly on port ${port}`);
});