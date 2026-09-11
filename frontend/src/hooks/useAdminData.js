import { useQuery } from '@tanstack/react-query'
import { adminApi } from '../services/admin'

export function useDashboard() {
  return useQuery({ queryKey: ['admin-dashboard'], queryFn: adminApi.dashboard })
}

export function useAdminList(key, fn, params) {
  return useQuery({ queryKey: [key, params], queryFn: () => fn(params) })
}

export function useProjectsAdmin(params) {
  return useAdminList('admin-projects', adminApi.projects, params)
}

export function useSkillsAdmin(params) {
  return useAdminList('admin-skills', adminApi.skills, params)
}

export function useExperiencesAdmin(params) {
  return useAdminList('admin-experiences', adminApi.experiences, params)
}

export function useEducationsAdmin(params) {
  return useAdminList('admin-educations', adminApi.educations, params)
}

export function useCertificatesAdmin(params) {
  return useAdminList('admin-certificates', adminApi.certificates, params)
}

export function usePostsAdmin(params) {
  return useAdminList('admin-posts', adminApi.posts, params)
}

export function useMediaAdmin(params) {
  return useAdminList('admin-media', adminApi.media, params)
}

export function useMessagesAdmin(params) {
  return useAdminList('admin-messages', adminApi.messages, params)
}

export function useCategoriesAdmin() {
  return useQuery({ queryKey: ['admin-categories'], queryFn: adminApi.categories })
}

export function useTagsAdmin() {
  return useQuery({ queryKey: ['admin-tags'], queryFn: adminApi.tags })
}

export function useSeoAdmin() {
  return useQuery({ queryKey: ['admin-seo'], queryFn: adminApi.seo })
}

export function useProfileAdmin() {
  return useQuery({ queryKey: ['admin-profile'], queryFn: adminApi.profile })
}

export function useSettingsAdmin() {
  return useQuery({ queryKey: ['admin-settings'], queryFn: adminApi.settings })
}