const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

// ---------------------------------------------------------
// TASK 5.1.1: CORS Configuration (MANDATORY)
// ---------------------------------------------------------
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// ---------------------------------------------------------
// TASK 5.2.2: Health Check Endpoint (MANDATORY)
// ---------------------------------------------------------
// The evaluation script calls this to see if your DB is ready
app.get('/api/health', async (req, res) => {
  try {
    // This is a placeholder for your DB connection check. 
    // If using Sequelize: await sequelize.authenticate();
    // If using pg: await pool.query('SELECT 1');
    const dbConnected = true; // Set based on your actual DB connection logic

    if (dbConnected) {
      res.status(200).json({ status: "ok", database: "connected" });
    } else {
      throw new Error("Database not connected");
    }
  } catch (err) {
    res.status(500).json({ status: "error", database: "disconnected" });
  }
});

// Import your other routes here (Auth, Projects, Users)
// app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend service running on port ${PORT}`);
});