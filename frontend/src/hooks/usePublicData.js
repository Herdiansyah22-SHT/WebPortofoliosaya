import { useQuery } from '@tanstack/react-query'
import { publicApi } from '../services/public'

export function useProfile() {
  return useQuery({ queryKey: ['profile'], queryFn: publicApi.profile })
}

export function useSiteSettings() {
  return useQuery({ queryKey: ['site'], queryFn: publicApi.site, staleTime: 300_000 })
}

export function useSkills() {
  return useQuery({ queryKey: ['skills'], queryFn: publicApi.skills })
}

export function useProjects(params) {
  return useQuery({ queryKey: ['projects', params], queryFn: () => publicApi.projects(params) })
}

export function useProject(slug) {
  return useQuery({
    queryKey: ['project', slug],
    queryFn: () => publicApi.project(slug),
    enabled: Boolean(slug),
  })
}

export function useExperiences() {
  return useQuery({ queryKey: ['experiences'], queryFn: publicApi.experiences })
}

export function useEducations() {
  return useQuery({ queryKey: ['educations'], queryFn: publicApi.educations })
}

export function useCertificates() {
  return useQuery({ queryKey: ['certificates'], queryFn: publicApi.certificates })
}

export function usePosts(params) {
  return useQuery({ queryKey: ['posts', params], queryFn: () => publicApi.posts(params) })
}

export function usePost(slug) {
  return useQuery({
    queryKey: ['post', slug],
    queryFn: () => publicApi.post(slug),
    enabled: Boolean(slug),
  })
}

export function useCategories() {
  return useQuery({ queryKey: ['categories'], queryFn: publicApi.categories })
}
