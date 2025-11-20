/**
 * In-memory task storage
 * For production, consider using a database like MongoDB or PostgreSQL
 */
class TaskStore {
  constructor() {
    this.tasks = new Map();
  }

  addTask(task) {
    this.tasks.set(task.id, task);
    return task;
  }

  getTask(id) {
    return this.tasks.get(id);
  }

  getAllTasks() {
    return Array.from(this.tasks.values()).sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
  }

  updateTask(task) {
    task.updatedAt = new Date().toISOString();
    this.tasks.set(task.id, task);
    return task;
  }

  deleteTask(id) {
    return this.tasks.delete(id);
  }

  addLog(taskId, message) {
    const task = this.getTask(taskId);
    if (task) {
      task.logs.push({
        timestamp: new Date().toISOString(),
        message
      });
      // Keep only last 100 logs
      if (task.logs.length > 100) {
        task.logs = task.logs.slice(-100);
      }
      this.updateTask(task);
    }
  }

  addError(taskId, error) {
    const task = this.getTask(taskId);
    if (task) {
      task.errors.push({
        timestamp: new Date().toISOString(),
        error: error.message || error
      });
      // Keep only last 50 errors
      if (task.errors.length > 50) {
        task.errors = task.errors.slice(-50);
      }
      this.updateTask(task);
    }
  }

  incrementCreatedUsers(taskId) {
    const task = this.getTask(taskId);
    if (task) {
      task.createdUsersCount++;
      this.updateTask(task);
    }
  }
}

module.exports = TaskStore;
