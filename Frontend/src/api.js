import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Default to localhost backend
});

export default api;
