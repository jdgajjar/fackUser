import React, { useState } from 'react';
import './TaskForm.css';

function TaskForm({ onSubmit, loading }) {
  const [targetUrl, setTargetUrl] = useState('');
  const [userCount, setUserCount] = useState(10);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ targetUrl, userCount });
    setTargetUrl('');
    setUserCount(10);
  };

  return (
    <div className="task-form-container">
      <h2>Create New Task</h2>
      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label htmlFor="targetUrl">Target Website URL</label>
          <input
            type="url"
            id="targetUrl"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            placeholder="https://example.com"
            required
            disabled={loading}
          />
          <small>Enter the URL where fake users should be created</small>
        </div>

        <div className="form-group">
          <label htmlFor="userCount">Number of Users</label>
          <input
            type="number"
            id="userCount"
            value={userCount}
            onChange={(e) => setUserCount(e.target.value)}
            min="1"
            max="10000"
            required
            disabled={loading}
          />
          <small>How many fake users to create (1-10,000)</small>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Creating Task...' : 'Create Task'}
        </button>
      </form>
    </div>
  );
}

export default TaskForm;
