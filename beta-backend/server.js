// 🚀 THE VIRTUAL CAREER SERVICES PORTAL INTAKE ENGINE
app.post('/api/users/intake', async (req, res) => {
  const { name, email, location, languages, careerGoals } = req.body;
  
  try {
    // 1. Insert the seeker profile into PostgreSQL
    const userResult = await pool.query(
      `INSERT INTO public.users (name, email, role, languages, location, career_goals) 
       VALUES ($1, $2, 'Seeker', $3, $4, $5) 
       RETURNING *`,
      [name, email, languages, location, careerGoals]
    );
    const newUser = userResult.rows[0];

    // 2. The Algorithmic Matching Query
    // Looks for an active advisor who shares at least one common language
    const matchResult = await pool.query(
      `SELECT a.*, u.name as advisor_name, u.email as advisor_email 
       FROM public.advisors a
       JOIN public.users u ON a.user_id = u.id
       WHERE a.is_active = TRUE 
       AND $1 = ANY(u.languages)
       LIMIT 1`,
      [newUser.languages[0]] // Match based on primary language selection
    );
    
    const matchedAdvisor = matchResult.rows[0] || null;

    // 3. Automated Scheduling Automation
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

    // 4. Send the data back to the React UI
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