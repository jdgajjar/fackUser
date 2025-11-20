import React from 'react';
import './TaskList.css';

function TaskList({ tasks, selectedTask, onSelectTask, onStopTask, onDeleteTask }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'running': return '🔄';
      case 'completed': return '✅';
      case 'stopped': return '⏹️';
      case 'failed': return '❌';
      default: return '❓';
    }
  };

  const getStatusClass = (status) => {
    return `status-${status}`;
  };

  const formatUrl = (url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return url;
    }
  };

  return (
    <div className="task-list-container">
      <h2>Tasks ({tasks.length})</h2>
      {tasks.length === 0 ? (
        <div className="empty-state">
          <p>No tasks yet. Create your first task above!</p>
        </div>
      ) : (
        <div className="task-list">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`task-item ${selectedTask?.id === task.id ? 'selected' : ''}`}
              onClick={() => onSelectTask(task)}
            >
              <div className="task-item-header">
                <span className={`status-badge ${getStatusClass(task.status)}`}>
                  {getStatusIcon(task.status)} {task.status}
                </span>
                <div className="task-actions">
                  {(task.status === 'running' || task.status === 'pending') && (
                    <button
                      className="btn-icon btn-stop"
                      onClick={(e) => {
                        e.stopPropagation();
                        onStopTask(task.id);
                      }}
                      title="Stop Task"
                    >
                      ⏹️
                    </button>
                  )}
                  {(task.status === 'completed' || task.status === 'stopped' || task.status === 'failed') && (
                    <button
                      className="btn-icon btn-delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteTask(task.id);
                      }}
                      title="Delete Task"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
              
              <div className="task-item-body">
                <div className="task-url" title={task.targetUrl}>
                  🌐 {formatUrl(task.targetUrl)}
                </div>
                <div className="task-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${(task.createdUsersCount / task.userCount) * 100}%` }}
                    />
                  </div>
                  <span className="progress-text">
                    {task.createdUsersCount} / {task.userCount} users
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskList;
