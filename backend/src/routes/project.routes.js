const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const { protect, authorize } = require('../middlewares/auth');

router.use(protect);

router.get('/', projectController.getProjects);
router.get('/:id', projectController.getProjectById);
router.post('/', authorize('tenant_admin', 'super_admin'), projectController.createProject);
router.put('/:id', authorize('tenant_admin', 'super_admin'), projectController.updateProject);
router.delete('/:id', authorize('tenant_admin', 'super_admin'), projectController.deleteProject);

module.exports = router;