const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const protect = require('../middlewares/auth'); // Updated path and name

// Registration and Login
router.post('/register', authController.register);
router.post('/login', authController.login);

// Profile Route (Point #4)
router.get('/profile', protect, authController.getProfile); 

module.exports = router;