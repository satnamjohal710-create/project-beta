const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// 1. Parse incoming JSON payloads
app.use(express.json());

// 2. Bulletproof Manual CORS Header Injection Middleware
app.use((req, res, next) => {
  // Explicitly allow your live Azure Static Web App domain
  res.header("Access-Control-Allow-Origin", "https://purple-glacier-04bbf080f.7.azurestaticapps.net");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  // Instantly approve the browser's hidden "Preflight" OPTIONS query
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// 3. PostgreSQL Connection Pool Setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for secure Azure PostgreSQL connections
  }
});

// Test database connection on startup
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client from database pool:', err.stack);
  }
  console.log('Connected to Azure PostgreSQL Database successfully.');
  release();
});

// 4. Health Check Route
app.get('/', (req, res) => {
  res.send('Virtual Career Services Platform API is running live.');
});

// 5. 🚀 THE CAREER SERVICES PORTAL INTAKE ENGINE
app.post('/api/users/intake', async (req, res) => {
  const { name, email, location, languages, careerGoals } = req.body;
  
  try {
    // Stage A: Insert the candidate seeker profile into PostgreSQL
    const userResult = await pool.query(
      `INSERT INTO public.users (name, email, role, languages, location, career_goals) 
       VALUES ($1, $2, 'Seeker', $3, $4, $5) 
       RETURNING *`,
      [name, email, languages, location, careerGoals]
    );
    const newUser = userResult.rows[0];

    // Stage B: Algorithmic Matching Query
    // Look for an active advisor sharing the primary language selected
    const matchResult = await pool.query(
      `SELECT a.*, u.name as advisor_name, u.email as advisor_email 
       FROM public.advisors a
       JOIN public.users u ON a.user_id = u.id
       WHERE a.is_active = TRUE 
       AND $1 = ANY(u.languages)
       LIMIT 1`,
      [newUser.languages[0]]
    );
    
    const matchedAdvisor = matchResult.rows[0] || null;

    // Stage C: Automated Placement Scheduling
    let appointment = null;
    if (matchedAdvisor) {
      const appointmentResult = await pool.query(
        `INSERT INTO public.appointments (seeker_id, advisor_id, scheduled_time, status)
         VALUES ($1, $2, NOW() + INTERVAL '2 days', 'Pending')
         RETURNING *`,
        [newUser.id, matchedAdvisor.id]
      );
      appointment = appointmentResult.rows[0];
    }

    // Stage D: Send the combined data structure back to the React UI
    res.status(201).json({
      message: "Intake registration transaction successfully completed.",
      user: newUser,
      matchedAdvisor: matchedAdvisor ? {
        id: matchedAdvisor.id,
        name: matchedAdvisor.advisor_name,
        email: matchedAdvisor.advisor_email
      } : null,
      appointment: appointment
    });

  } catch (error) {
    console.error("Critical Backend Pipeline Crash:", error);
    res.status(500).json({ 
      error: "Intake processing aborted.",
      details: error.message 
    });
  }
});

// Start the server instance
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});