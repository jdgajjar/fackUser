import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const api = {
  getTasks: () => axios.get(`${API_BASE_URL}/tasks`),
  
  getTask: (id) => axios.get(`${API_BASE_URL}/tasks/${id}`),
  
  createTask: (taskData) => axios.post(`${API_BASE_URL}/tasks`, taskData),
  
  stopTask: (id) => axios.post(`${API_BASE_URL}/tasks/${id}/stop`),
  
  deleteTask: (id) => axios.delete(`${API_BASE_URL}/tasks/${id}`),
  
  getTaskStats: (id) => axios.get(`${API_BASE_URL}/tasks/${id}/stats`)
};

export default api;
