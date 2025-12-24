const express = require('express');
const cors = require('cors');
const healthRoute = require('./routes/health');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/health', healthRoute);

module.exports = app;
