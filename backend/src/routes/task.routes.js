const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const { protect, authorize } = require('../middlewares/auth');

// All task routes require authentication
router.use(protect);

// 1. List Tasks
router.get('/', taskController.getTasks);

// 2. Create Task
router.post('/', taskController.createTask);

// 3. Get Single Task
router.get('/:id', taskController.getTaskById);

// 4. Update Task (Admins and Users can update tasks they work on)
router.put('/:id', taskController.updateTask);

// 5. Delete Task (Only Admins can delete tasks for security)
router.delete('/:id', authorize('tenant_admin', 'super_admin'), taskController.deleteTask);

module.exports = router;
