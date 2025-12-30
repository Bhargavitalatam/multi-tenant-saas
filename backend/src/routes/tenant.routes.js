const express = require('express');
const router = express.Router();
const tenantController = require('../controllers/tenant.controller');
// Use the correct names from your auth.js middleware
const { protect, authorize } = require('../middlewares/auth');

// Get All Tenants (Super Admin Only)
router.get('/', protect, authorize('super_admin'), tenantController.getAllTenants);

// Create New Tenant (Super Admin Only)
router.post('/', protect, authorize('super_admin'), tenantController.createTenant);

// Get Single Tenant
router.get('/:id', protect, tenantController.getTenantById);

// Update Tenant
router.put('/:id', protect, authorize('super_admin'), tenantController.updateTenant);

// Delete Tenant
router.delete('/:id', protect, authorize('super_admin'), tenantController.deleteTenant);

module.exports = router;