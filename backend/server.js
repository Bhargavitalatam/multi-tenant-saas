const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

// 1. Database Configuration
const pool = new Pool({
  host: process.env.DB_HOST || 'database',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'saas_db',
  port: 5432,
});

// 2. Database Initialization Logic
const initializeDatabase = async () => {
  const createTablesQuery = `
    CREATE TABLE IF NOT EXISTS tenants (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      subdomain VARCHAR(255) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      tenant_id INTEGER REFERENCES tenants(id) ON DELETE CASCADE,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(createTablesQuery);
    console.log("✅ Database tables verified/created successfully.");
  } catch (err) {
    console.error("❌ Database initialization error:", err);
  }
};

initializeDatabase();

// 3. CORS Configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// 4. MANDATORY Health Check Endpoint
// This is what Docker uses to see if the container is "Healthy"
app.get('/api/health', async (req, res) => {
  try {
    // Check if DB is reachable
    await pool.query('SELECT 1');
    res.status(200).json({ 
      status: "ok", 
      database: "connected",
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ status: "error", database: "disconnected" });
  }
});

// 5. Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend service running on port ${PORT}`);
});