import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080', // Tu URL base del backend
  headers: {
    'Content-Type': 'application/json'
  }
});

// Opcional: Interceptor para añadir el token a todas las peticiones
apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;