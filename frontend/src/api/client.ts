import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8090',
  headers: { 'Content-Type': 'application/json' },
});

export const vendorApi = {
  getAll: (params?: { category?: string; city?: string }) => api.get('/api/vendors', { params }),
  getById: (id: string) => api.get(`/api/vendors/${id}`),
  create: (data: any) => api.post('/api/vendors', data),
};

export const eventApi = {
  getAll: (params?: { customerId?: string }) => api.get('/api/events', { params }),
  getById: (id: string) => api.get(`/api/events/${id}`),
  create: (data: any) => api.post('/api/events', data),
};

export const bookingApi = {
  create: (data: any) => api.post('/api/bookings', data),
  getAll: (params?: { customerId?: string; vendorId?: string }) => api.get('/api/bookings', { params }),
};

export const notificationApi = {
  getByCustomer: (customerId: string) => api.get('/api/notifications', { params: { customerId } }),
};

export const userApi = {
  register: (data: any) => api.post('/api/users/register', data),
  login: (data: any) => api.post('/api/users/login', data),
};

export default api;
