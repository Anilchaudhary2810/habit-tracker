import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
});

export const getApiErrorMessage = (error, fallbackMessage = 'Something went wrong.') => {
  if (!error?.response) {
    return 'Unable to reach server. Please check backend is running.';
  }

  const data = error.response.data;
  if (typeof data === 'string' && data.trim()) return data;
  if (data?.detail) return data.detail;
  if (data?.error) return data.error;

  if (typeof data === 'object' && data !== null) {
    for (const value of Object.values(data)) {
      if (Array.isArray(value) && value.length > 0) return String(value[0]);
      if (typeof value === 'string' && value.trim()) return value;
    }
  }

  return fallbackMessage;
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post('http://localhost:8000/api/accounts/token/refresh/', {
            refresh: refreshToken,
          });
          localStorage.setItem('access_token', response.data.access);
          api.defaults.headers.Authorization = `Bearer ${response.data.access}`;
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
      } else {
        localStorage.removeItem('access_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
