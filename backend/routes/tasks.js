const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Get all tasks
router.get('/', taskController.getAllTasks);

// Get task by ID
router.get('/:id', taskController.getTaskById);

// Create new task
router.post('/', taskController.createTask);

// Stop task
router.post('/:id/stop', taskController.stopTask);

// Delete task
router.delete('/:id', taskController.deleteTask);

// Get task statistics
router.get('/:id/stats', taskController.getTaskStats);

module.exports = router;
