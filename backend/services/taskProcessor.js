const TaskStore = require('../models/taskStore');
const FakeUserService = require('./fakeUserService');

const taskStore = new TaskStore();
const fakeUserService = new FakeUserService();

// Store active task processing promises
const activeTaskProcessors = new Map();

/**
 * Process task queue continuously
 */
function processTaskQueue() {
  // Check for pending or running tasks every 5 seconds
  setInterval(async () => {
    const tasks = taskStore.getAllTasks();
    
    for (const task of tasks) {
      // Start pending tasks
      if (task.status === 'pending' && !activeTaskProcessors.has(task.id)) {
        console.log(`Starting task ${task.id}`);
        startTaskProcessing(task);
      }
      
      // Continue running tasks
      if (task.status === 'running' && !activeTaskProcessors.has(task.id)) {
        console.log(`Resuming task ${task.id}`);
        startTaskProcessing(task);
      }
    }
  }, 5000);
}

/**
 * Start processing a specific task
 */
async function startTaskProcessing(task) {
  if (activeTaskProcessors.has(task.id)) {
    return; // Already processing
  }

  task.status = 'running';
  task.startedAt = task.startedAt || new Date().toISOString();
  taskStore.updateTask(task);
  taskStore.addLog(task.id, `Task started - Creating ${task.userCount} fake users`);

  const processingPromise = processTask(task);
  activeTaskProcessors.set(task.id, processingPromise);

  try {
    await processingPromise;
  } catch (error) {
    console.error(`Error processing task ${task.id}:`, error);
    taskStore.addError(task.id, error);
  } finally {
    activeTaskProcessors.delete(task.id);
  }
}

/**
 * Process a single task
 */
async function processTask(task) {
  while (task.createdUsersCount < task.userCount) {
    // Check if task should continue
    const currentTask = taskStore.getTask(task.id);
    if (!currentTask || currentTask.status === 'stopped') {
      taskStore.addLog(task.id, 'Task stopped by user');
      break;
    }

    try {
      // Create a fake user
      const result = await fakeUserService.createFakeUser(task.targetUrl);
      
      taskStore.incrementCreatedUsers(task.id);
      taskStore.addLog(
        task.id, 
        `User ${task.createdUsersCount}/${task.userCount} created - Visited ${result.pagesVisited} pages in ${result.duration}ms`
      );

      // Random delay between users (1-5 seconds)
      const delay = Math.random() * 4000 + 1000;
      await sleep(delay);

    } catch (error) {
      console.error(`Error creating fake user for task ${task.id}:`, error);
      taskStore.addError(task.id, error);
      
      // If too many consecutive errors, pause the task
      if (task.errors.length > 10) {
        task.status = 'failed';
        taskStore.updateTask(task);
        taskStore.addLog(task.id, 'Task failed due to too many errors');
        break;
      }

      // Wait before retrying
      await sleep(5000);
    }
  }

  // Task completed
  const finalTask = taskStore.getTask(task.id);
  if (finalTask && finalTask.status !== 'stopped' && finalTask.status !== 'failed') {
    finalTask.status = 'completed';
    finalTask.completedAt = new Date().toISOString();
    taskStore.updateTask(finalTask);
    taskStore.addLog(task.id, `Task completed - ${finalTask.createdUsersCount} users created`);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  processTaskQueue,
  startTaskProcessing,
  taskStore // Export for use in controllers
};
