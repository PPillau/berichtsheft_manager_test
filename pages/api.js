// api.js
import Axios from 'axios';

const api = Axios.create({
  baseURL: 'http://localhost:3000/api/',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export default api;
