import axios from 'axios'
import { apiClient } from './apiClient'

const csrfClient = axios.create({
  baseURL: import.meta.env.VITE_SITE_URL || 'http://localhost:8000',
  withCredentials: true,
})

export const authApi = {
  csrf: () => csrfClient.get('/sanctum/csrf-cookie'),
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  me: () => apiClient.get('/auth/me'),
  logout: () => apiClient.post('/auth/logout'),
}