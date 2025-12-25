const express = require('express');
const router = express.Router();
const tenantController = require('../controllers/tenant.controller');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');

// Get All Tenants (Super Admin Only)
router.get('/', auth, role(['super_admin']), tenantController.getAllTenants);

// Create New Tenant (Super Admin Only)
router.post('/', auth, role(['super_admin']), tenantController.createTenant);

// Get Single Tenant
router.get('/:id', auth, tenantController.getTenantById);

// Update Tenant
router.put('/:id', auth, role(['super_admin']), tenantController.updateTenant);

// Delete Tenant
router.delete('/:id', auth, role(['super_admin']), tenantController.deleteTenant);

module.exports = router;