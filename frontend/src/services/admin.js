import { apiClient } from './apiClient'

/**
 * Admin API — setiap fungsi mengembalikan body JSON API
 * (response.data = { success, message, data, meta }), konsisten dengan publicApi.
 *   query.data                    = body
 *   query.data.data / query.data.meta  = payload
 */
const unwrap = (promise) => promise.then((r) => r.data)

export const adminApi = {
  dashboard: () => unwrap(apiClient.get('/admin/dashboard')),

  profile: () => unwrap(apiClient.get('/admin/profile')),
  updateProfile: (data) => unwrap(apiClient.put('/admin/profile', data)),

  seo: () => unwrap(apiClient.get('/admin/seo')),
  updateSeo: (data) => unwrap(apiClient.put('/admin/seo', data)),

  settings: () => unwrap(apiClient.get('/admin/settings')),
  updateSettings: (data) => unwrap(apiClient.put('/admin/settings', data)),

  messages: (params) => unwrap(apiClient.get('/admin/messages', { params })),
  updateMessage: (id, data) => unwrap(apiClient.put(`/admin/messages/${id}`, data)),
  deleteMessage: (id) => unwrap(apiClient.delete(`/admin/messages/${id}`)),

  media: (params) => unwrap(apiClient.get('/admin/media', { params })),
  uploadMedia: (data) => unwrap(apiClient.post('/admin/media', data, { headers: { 'Content-Type': 'multipart/form-data' } })),
  deleteMedia: (id) => unwrap(apiClient.delete(`/admin/media/${id}`)),

  categories: () => unwrap(apiClient.get('/admin/categories')),
  createCategory: (data) => unwrap(apiClient.post('/admin/categories', data)),
  updateCategory: (id, data) => unwrap(apiClient.put(`/admin/categories/${id}`, data)),
  deleteCategory: (id) => unwrap(apiClient.delete(`/admin/categories/${id}`)),

  tags: () => unwrap(apiClient.get('/admin/tags')),
  createTag: (data) => unwrap(apiClient.post('/admin/tags', data)),
  updateTag: (id, data) => unwrap(apiClient.put(`/admin/tags/${id}`, data)),
  deleteTag: (id) => unwrap(apiClient.delete(`/admin/tags/${id}`)),

  skills: (params) => unwrap(apiClient.get('/admin/skills', { params })),
  createSkill: (data) => unwrap(apiClient.post('/admin/skills', data)),
  updateSkill: (id, data) => unwrap(apiClient.put(`/admin/skills/${id}`, data)),
  deleteSkill: (id) => unwrap(apiClient.delete(`/admin/skills/${id}`)),

  experiences: (params) => unwrap(apiClient.get('/admin/experiences', { params })),
  createExperience: (data) => unwrap(apiClient.post('/admin/experiences', data)),
  updateExperience: (id, data) => unwrap(apiClient.put(`/admin/experiences/${id}`, data)),
  deleteExperience: (id) => unwrap(apiClient.delete(`/admin/experiences/${id}`)),

  educations: (params) => unwrap(apiClient.get('/admin/educations', { params })),
  createEducation: (data) => unwrap(apiClient.post('/admin/educations', data)),
  updateEducation: (id, data) => unwrap(apiClient.put(`/admin/educations/${id}`, data)),
  deleteEducation: (id) => unwrap(apiClient.delete(`/admin/educations/${id}`)),

  certificates: (params) => unwrap(apiClient.get('/admin/certificates', { params })),
  createCertificate: (data) => unwrap(apiClient.post('/admin/certificates', data)),
  updateCertificate: (id, data) => unwrap(apiClient.put(`/admin/certificates/${id}`, data)),
  deleteCertificate: (id) => unwrap(apiClient.delete(`/admin/certificates/${id}`)),

  projects: (params) => unwrap(apiClient.get('/admin/projects', { params })),
  project: (id) => unwrap(apiClient.get(`/admin/projects/${id}`)),
  createProject: (data) => unwrap(apiClient.post('/admin/projects', data)),
  updateProject: (id, data) => unwrap(apiClient.put(`/admin/projects/${id}`, data)),
  deleteProject: (id) => unwrap(apiClient.delete(`/admin/projects/${id}`)),

  posts: (params) => unwrap(apiClient.get('/admin/posts', { params })),
  post: (id) => unwrap(apiClient.get(`/admin/posts/${id}`)),
  createPost: (data) => unwrap(apiClient.post('/admin/posts', data)),
  updatePost: (id, data) => unwrap(apiClient.put(`/admin/posts/${id}`, data)),
  deletePost: (id) => unwrap(apiClient.delete(`/admin/posts/${id}`)),
}