const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

// Structural baseline connectivity verification
pool.connect((err, client, release) => {
    if (err) {
        return console.error('DATABASE CONNECTIVITY ERROR:', err.stack);
    }
    console.log('[SUCCESS] Established active connection pipe with beta_db.');
    release();
});

// Route 1: POST - Write a new hardware asset to the register table
app.post('/assets', async (req, res) => {
    const { asset_name, serial_number, ip_address, department } = req.body;
    try {
        const queryText = 'INSERT INTO asset_register(asset_name, serial_number, ip_address, department) VALUES($1, $2, $3, $4) RETURNING *';
        const values = [asset_name, serial_number, ip_address, department];
        const result = await pool.query(queryText, values);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Database write error:", err.message);
        res.status(500).json({ error: "Failed to log asset payload." });
    }
});

// Route 2: GET - Fetch all logged network assets for the dynamic grid
app.get('/assets', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM asset_register ORDER BY id DESC');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Database retrieval error:", err.message);
        res.status(500).json({ error: "Failed to fetch asset array." });
    }
});

app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`[LIVE] Beta Backend running on http://localhost:${PORT}`);
    console.log(`Waiting for IT asset data transmissions...`);
    console.log(`==================================================`);
});