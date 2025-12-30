const express = require('express');
const router = express.Router();
const { getAuditLogs } = require('../controllers/audit.controller');
const { protect } = require('../middlewares/auth');

router.get('/', protect, getAuditLogs);

module.exports = router;