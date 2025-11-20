import React, { useState, useEffect } from 'react';
import './App.css';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskDetails from './components/TaskDetails';
import api from './services/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
    // Auto-refresh tasks every 3 seconds
    const interval = setInterval(fetchTasks, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.getTasks();
      setTasks(response.data.tasks);
      
      // Update selected task if it exists
      if (selectedTask) {
        const updatedTask = response.data.tasks.find(t => t.id === selectedTask.id);
        if (updatedTask) {
          setSelectedTask(updatedTask);
        }
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  const handleCreateTask = async (taskData) => {
    setLoading(true);
    setError(null);
    try {
      await api.createTask(taskData);
      await fetchTasks();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const handleStopTask = async (taskId) => {
    try {
      await api.stopTask(taskId);
      await fetchTasks();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to stop task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await api.deleteTask(taskId);
      setTasks(tasks.filter(t => t.id !== taskId));
      if (selectedTask && selectedTask.id === taskId) {
        setSelectedTask(null);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete task');
    }
  };

  const handleSelectTask = (task) => {
    setSelectedTask(task);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎭 Fake User Generator</h1>
        <p>Create and manage fake user generation tasks</p>
      </header>

      <div className="App-container">
        <div className="App-left">
          <TaskForm onSubmit={handleCreateTask} loading={loading} />
          {error && (
            <div className="error-message">
              <strong>Error:</strong> {error}
            </div>
          )}
          <TaskList
            tasks={tasks}
            selectedTask={selectedTask}
            onSelectTask={handleSelectTask}
            onStopTask={handleStopTask}
            onDeleteTask={handleDeleteTask}
          />
        </div>

        <div className="App-right">
          <TaskDetails task={selectedTask} />
        </div>
      </div>

      <footer className="App-footer">
        <p>⚠️ For educational purposes only. Use responsibly and with permission.</p>
      </footer>
    </div>
  );
}

export default App;
