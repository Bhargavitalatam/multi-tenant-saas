const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect, authorize } = require('../middlewares/auth');

// Management routes
router.get('/', protect, authorize('tenant_admin', 'super_admin'), userController.getUsers);
router.get('/:id', protect, userController.getUserById);
router.delete('/:id', protect, authorize('super_admin'), userController.deleteUser);

module.exports = router;