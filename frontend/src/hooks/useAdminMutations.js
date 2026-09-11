import { useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '../services/admin'

function useGenericMutation(mutationFn, queryKeys) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryKeys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] })
      })
    },
  })
}

// System
export const useUpdateProfile = () => useGenericMutation(adminApi.updateProfile, ['admin-profile', 'profile'])
export const useUpdateSeo = () => useGenericMutation(adminApi.updateSeo, ['admin-seo'])
export const useUpdateSettings = () => useGenericMutation(adminApi.updateSettings, ['admin-settings'])

// Messages
export const useUpdateMessage = () => useGenericMutation(({ id, ...data }) => adminApi.updateMessage(id, data), ['admin-messages', 'admin-dashboard'])
export const useDeleteMessage = () => useGenericMutation(adminApi.deleteMessage, ['admin-messages', 'admin-dashboard'])

// Media
export const useUploadMedia = () => useGenericMutation(adminApi.uploadMedia, ['admin-media', 'admin-dashboard'])
export const useDeleteMedia = () => useGenericMutation(adminApi.deleteMedia, ['admin-media', 'admin-dashboard'])

// Simple CRUD generator
const createCrudMutations = (resourceKey, publicKey, apiKey) => ({
  useCreate: () => useGenericMutation(adminApi[`create${apiKey}`], [resourceKey, publicKey, 'admin-dashboard']),
  useUpdate: () => useGenericMutation(({ id, ...data }) => adminApi[`update${apiKey}`](id, data), [resourceKey, publicKey]),
  useDelete: () => useGenericMutation(adminApi[`delete${apiKey}`], [resourceKey, publicKey, 'admin-dashboard']),
})

export const categoryMutations = createCrudMutations('admin-categories', 'categories', 'Category')
export const tagMutations = createCrudMutations('admin-tags', 'posts', 'Tag') // invalidates posts cache
export const skillMutations = createCrudMutations('admin-skills', 'skills', 'Skill')
export const experienceMutations = createCrudMutations('admin-experiences', 'experiences', 'Experience')
export const educationMutations = createCrudMutations('admin-educations', 'educations', 'Education')
export const certificateMutations = createCrudMutations('admin-certificates', 'certificates', 'Certificate')
export const projectMutations = createCrudMutations('admin-projects', 'projects', 'Project')
export const postMutations = createCrudMutations('admin-posts', 'posts', 'Post')