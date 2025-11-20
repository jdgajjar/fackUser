const { v4: uuidv4 } = require('uuid');
const TaskStore = require('../models/taskStore');

const taskStore = new TaskStore();

// Get all tasks
const getAllTasks = (req, res) => {
  try {
    const tasks = taskStore.getAllTasks();
    res.status(200).json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get task by ID
const getTaskById = (req, res) => {
  try {
    const task = taskStore.getTask(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    res.status(200).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create new task
const createTask = (req, res) => {
  try {
    const { targetUrl, userCount } = req.body;

    // Validation
    if (!targetUrl || !userCount) {
      return res.status(400).json({ 
        success: false, 
        error: 'targetUrl and userCount are required' 
      });
    }

    if (userCount < 1 || userCount > 10000) {
      return res.status(400).json({ 
        success: false, 
        error: 'userCount must be between 1 and 10000' 
      });
    }

    // Validate URL format
    try {
      new URL(targetUrl);
    } catch (e) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid URL format' 
      });
    }

    const task = {
      id: uuidv4(),
      targetUrl,
      userCount: parseInt(userCount),
      createdUsersCount: 0,
      status: 'pending', // pending, running, paused, completed, failed, stopped
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      startedAt: null,
      completedAt: null,
      logs: [],
      errors: []
    };

    taskStore.addTask(task);
    res.status(201).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Stop task
const stopTask = (req, res) => {
  try {
    const task = taskStore.getTask(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    if (task.status === 'completed' || task.status === 'stopped') {
      return res.status(400).json({ 
        success: false, 
        error: 'Task is already stopped or completed' 
      });
    }

    task.status = 'stopped';
    task.updatedAt = new Date().toISOString();
    task.completedAt = new Date().toISOString();
    taskStore.updateTask(task);

    res.status(200).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete task
const deleteTask = (req, res) => {
  try {
    const task = taskStore.getTask(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    taskStore.deleteTask(req.params.id);
    res.status(200).json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get task statistics
const getTaskStats = (req, res) => {
  try {
    const task = taskStore.getTask(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    const stats = {
      id: task.id,
      targetUrl: task.targetUrl,
      totalUsers: task.userCount,
      createdUsers: task.createdUsersCount,
      progress: Math.round((task.createdUsersCount / task.userCount) * 100),
      status: task.status,
      createdAt: task.createdAt,
      startedAt: task.startedAt,
      completedAt: task.completedAt,
      duration: task.startedAt 
        ? Math.round((new Date(task.completedAt || new Date()) - new Date(task.startedAt)) / 1000)
        : 0,
      recentLogs: task.logs.slice(-10),
      errorCount: task.errors.length
    };

    res.status(200).json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  stopTask,
  deleteTask,
  getTaskStats
};
