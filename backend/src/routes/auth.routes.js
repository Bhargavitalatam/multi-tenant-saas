const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Matches the exports in the controller exactly
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;