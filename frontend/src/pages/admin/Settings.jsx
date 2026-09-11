import { useDocumentMeta } from '../../hooks/useDocumentMeta'
import { useSettingsAdmin } from '../../hooks/useAdminData'
import { useUpdateSettings } from '../../hooks/useAdminMutations'
import { Async } from '../../components/common/Async'
import { Card, FormActions, Input, Skeleton, Textarea } from '../../components/ui'
import { useToast } from '../../components/ui'
import { useState, useEffect } from 'react'
import { extractApiError } from '../../services/apiClient'

export default function Settings() {
  useDocumentMeta({ title: 'Settings — Admin' })
  const query = useSettingsAdmin()
  const mutation = useUpdateSettings()
  const toast = useToast()

  const [form, setForm] = useState({ name: '', tagline: '', description: '', social_links: { github: '', linkedin: '' } })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (query.data?.data?.site) {
      setForm({
        ...query.data.data.site,
        social_links: query.data.data.site.social_links || { github: '', linkedin: '' }
      })
    }
  }, [query.data])

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
    setErrors((p) => ({ ...p, [`site.${e.target.name}`]: '' }))
  }

  const handleSocial = (e) => {
    setForm((p) => ({ ...p, social_links: { ...p.social_links, [e.target.name]: e.target.value } }))
    setErrors((p) => ({ ...p, [`site.social_links.${e.target.name}`]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    try {
      await mutation.mutateAsync({ site: form })
      toast.success('Pengaturan situs berhasil diperbarui.')
    } catch (error) {
      const { message, errors: fieldErrors } = extractApiError(error)
      toast.error(message)
      setErrors(fieldErrors)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-slate-900">Settings</h2>
        <p className="mt-1 text-sm text-slate-700">Pengaturan umum situs.</p>
      </div>

      <Async
        isLoading={query.isLoading}
        isError={query.isError}
        errorMessage={query.error?.message}
        onRetry={query.refetch}
        loading={<div className="space-y-4"><Skeleton className="h-48" /></div>}
      >
        {() => (
          <form onSubmit={handleSubmit} className="max-w-2xl">
            <Card className="space-y-4 p-6">
              <Input label="Nama Situs" name="name" value={form.name || ''} onChange={handleChange} error={errors['site.name']?.[0]} />
              <Input label="Tagline" name="tagline" value={form.tagline || ''} onChange={handleChange} error={errors['site.tagline']?.[0]} />
              <Textarea label="Deskripsi" name="description" value={form.description || ''} onChange={handleChange} error={errors['site.description']?.[0]} rows={3} />
              <Input label="GitHub URL" name="github" value={form.social_links.github || ''} onChange={handleSocial} error={errors['site.social_links.github']?.[0]} />
              <Input label="LinkedIn URL" name="linkedin" value={form.social_links.linkedin || ''} onChange={handleSocial} error={errors['site.social_links.linkedin']?.[0]} />
              <FormActions submitLabel="Simpan Settings" loading={mutation.isPending} />
            </Card>
          </form>
        )}
      </Async>
    </div>
  )
}
