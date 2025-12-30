const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');

// 1. Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

// 2. Database Configuration
const pool = new Pool({
  host: process.env.DB_HOST || 'database',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'saas_db',
  port: parseInt(process.env.DB_PORT || '5432'),
});

// Export database object for use in controllers
const db = {
  query: (text, params) => pool.query(text, params),
  pool: pool
};

// 3. CORS Configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// 4. Routes Integration - FIXED PATHS
// We use './routes' because server.js is already inside 'src'
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const projectRoutes = require('./routes/project.routes');
const taskRoutes = require('./routes/task.routes');
const healthRoute = require('./routes/health'); 

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/health', healthRoute);

// 5. Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend service running on port ${PORT}`);
});

// Exporting db so other files can use it
module.exports = db;