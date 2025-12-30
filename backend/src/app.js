const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Route Imports
const authRoutes = require('./routes/auth.routes');
const projectRoutes = require('./routes/project.routes');
const taskRoutes = require('./routes/task.routes');
const auditRoutes = require('./routes/audit.routes'); // New Audit Routes

const app = express();

// 1. GLOBAL MIDDLEWARE
app.use(cors());
app.use(express.json()); // Essential for parsing curl -d "json"
app.use(morgan('dev'));  // Logs all incoming requests to the console

// 2. ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/audit-logs', auditRoutes); // Registering the audit log endpoint

// 3. HEALTH CHECK
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', timestamp: new Date() });
});

// 4. 404 HANDLER
app.use((req, res, next) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// 5. GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

module.exports = app;