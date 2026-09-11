import { apiClient } from './apiClient'

/**
 * Public API — setiap fungsi mengembalikan body JSON dari API
 * (response.data = { success, message, data }), sehingga:
 *   query.data             = body
 *   query.data.data        = payload
 * Komponen membaca `query.data?.data` dan children Async menerima body.
 */
export const publicApi = {
  profile: () => apiClient.get('/profile').then((r) => r.data),
  site: () => apiClient.get('/site').then((r) => r.data),
  skills: () => apiClient.get('/skills').then((r) => r.data),
  projects: (params) => apiClient.get('/projects', { params }).then((r) => r.data),
  project: (slug) => apiClient.get(`/projects/${slug}`).then((r) => r.data),
  experiences: () => apiClient.get('/experiences').then((r) => r.data),
  educations: () => apiClient.get('/educations').then((r) => r.data),
  certificates: () => apiClient.get('/certificates').then((r) => r.data),
  posts: (params) => apiClient.get('/posts', { params }).then((r) => r.data),
  post: (slug) => apiClient.get(`/posts/${slug}`).then((r) => r.data),
  categories: () => apiClient.get('/categories').then((r) => r.data),
  contact: (payload) => apiClient.post('/contact', payload).then((r) => r.data),
}