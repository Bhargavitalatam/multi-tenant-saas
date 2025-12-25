const express = require('express');
const cors = require('cors');
const db = require('./config/db'); // Your database config

const app = express(); // <--- THIS MUST BE FIRST

app.use(cors());
app.use(express.json());

// MANDATORY HEALTH CHECK (Requirement [cite: 97])
app.get('/api/health', async (req, res) => {
  try {
    await db.pool.query('SELECT 1');
    res.status(200).json({ 
      success: true, 
      message: "System status: Healthy", 
      database: "Connected" 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: "System status: Unhealthy", 
      database: "Disconnected" 
    });
  }
});

// ... your other routes (auth, projects, etc) ...

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});