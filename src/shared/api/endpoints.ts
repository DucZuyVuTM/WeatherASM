import { apiClient } from './client';

// Auth endpoints
export const authApi = {
  register: (data: { email: string; username: string; password: string; full_name?: string }) =>
    apiClient.post('/auth/register', data),
  login: (username: string, password: string) => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    return apiClient.post('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  },
  refresh: (refresh_token: string) =>
    apiClient.post('/auth/refresh', { refresh_token }),
};

// User endpoints
export const userApi = {
  getMe: () => apiClient.get('/users/me'),
  updateMe: (data: { full_name?: string; email?: string }) =>
    apiClient.put('/users/me', data),
  deleteMe: () => apiClient.delete('/users/me'),
  changePassword: (data: { current_password: string; new_password: string }) =>
    apiClient.post('/users/me/change-password', data),
  listUsers: (skip?: number, limit?: number) =>
    apiClient.get('/users/', { params: { skip, limit } }),
  getUser: (userId: number) => apiClient.get(`/users/${userId}`),
  deactivateUser: (userId: number) =>
    apiClient.patch(`/users/${userId}/deactivate`),
};

// Locations endpoints
export const locationsApi = {
  getMyLocations: () => apiClient.get('/locations/'),
  addLocation: (city_name: string) => apiClient.post('/locations/', { city_name }),
  deleteLocation: (locationId: number) => apiClient.delete(`/locations/${locationId}`),
};

// Weather endpoints
export const weatherApi = {
  getCurrent: (city: string) => apiClient.get('/weather/current', { params: { city } }),
  getForecast: (city: string, days?: number) =>
    apiClient.get('/weather/forecast', { params: { city, days } }),
  getAlerts: (city: string, include_forecast?: boolean) =>
    apiClient.get('/weather/alerts', { params: { city, include_forecast } }),
  getHistory: (city: string, limit?: number) =>
    apiClient.get('/weather/history', { params: { city, limit } }),
  getAnalysis: (city: string, days?: number) =>
    apiClient.get('/weather/analysis', { params: { city, days } }),
  compareCities: (cities: string[]) =>
    apiClient.get('/weather/compare', { params: { cities: cities.join(',') } }),
};
