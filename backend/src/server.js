require('dotenv').config();
const app = require('./app');
const { pool } = require('./config/db');

const PORT = process.env.PORT || 5000;

// Function to initialize DB tables and seed data
const initializeDB = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Database connected');
    
    // IMPORTANT: This is where you should trigger your table creation 
    // and seeding logic to meet the "Automatic Only" requirement.
    // Example: await client.query('CREATE TABLE IF NOT EXISTS tenants...');
    
    client.release();
  } catch (err) {
    console.error('❌ Database connection error', err.stack);
    process.exit(1); // Exit if DB fails
  }
};

initializeDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});