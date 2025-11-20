import React from 'react';
import './TaskDetails.css';

function TaskDetails({ task }) {
  if (!task) {
    return (
      <div className="task-details-container">
        <div className="empty-state">
          <h2>No Task Selected</h2>
          <p>Select a task from the list to view details</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const calculateDuration = () => {
    if (!task.startedAt) return 'Not started';
    const start = new Date(task.startedAt);
    const end = task.completedAt ? new Date(task.completedAt) : new Date();
    const seconds = Math.floor((end - start) / 1000);
    
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  };

  const progress = Math.round((task.createdUsersCount / task.userCount) * 100);

  return (
    <div className="task-details-container">
      <div className="details-header">
        <h2>Task Details</h2>
        <span className={`status-badge-large status-${task.status}`}>
          {task.status}
        </span>
      </div>

      <div className="details-section">
        <h3>General Information</h3>
        <div className="details-grid">
          <div className="detail-item">
            <label>Task ID:</label>
            <span className="detail-value mono">{task.id}</span>
          </div>
          <div className="detail-item">
            <label>Target URL:</label>
            <a href={task.targetUrl} target="_blank" rel="noopener noreferrer" className="detail-value link">
              {task.targetUrl}
            </a>
          </div>
          <div className="detail-item">
            <label>Created At:</label>
            <span className="detail-value">{formatDate(task.createdAt)}</span>
          </div>
          <div className="detail-item">
            <label>Started At:</label>
            <span className="detail-value">{formatDate(task.startedAt)}</span>
          </div>
          <div className="detail-item">
            <label>Duration:</label>
            <span className="detail-value">{calculateDuration()}</span>
          </div>
        </div>
      </div>

      <div className="details-section">
        <h3>Progress</h3>
        <div className="progress-details">
          <div className="progress-bar-large">
            <div className="progress-fill-large" style={{ width: `${progress}%` }}>
              <span className="progress-percentage">{progress}%</span>
            </div>
          </div>
          <div className="progress-stats">
            <div className="stat-item">
              <span className="stat-label">Created:</span>
              <span className="stat-value">{task.createdUsersCount}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Target:</span>
              <span className="stat-value">{task.userCount}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Remaining:</span>
              <span className="stat-value">{task.userCount - task.createdUsersCount}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="details-section">
        <h3>Recent Activity</h3>
        <div className="logs-container">
          {task.logs.length === 0 ? (
            <p className="no-logs">No activity logs yet</p>
          ) : (
            <div className="logs-list">
              {task.logs.slice(-10).reverse().map((log, index) => (
                <div key={index} className="log-item">
                  <span className="log-time">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  <span className="log-message">{log.message}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {task.errors.length > 0 && (
        <div className="details-section">
          <h3>Errors ({task.errors.length})</h3>
          <div className="errors-container">
            <div className="errors-list">
              {task.errors.slice(-5).reverse().map((error, index) => (
                <div key={index} className="error-item">
                  <span className="error-time">{new Date(error.timestamp).toLocaleTimeString()}</span>
                  <span className="error-message">{error.error}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskDetails;
