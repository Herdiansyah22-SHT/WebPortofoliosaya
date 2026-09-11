import { useDocumentMeta } from '../../hooks/useDocumentMeta'
import { useProfileAdmin } from '../../hooks/useAdminData'
import { useUpdateProfile } from '../../hooks/useAdminMutations'
import { Async } from '../../components/common/Async'
import { Card, Skeleton, Button, Input, Textarea, Toggle, FormActions } from '../../components/ui'
import { ImageField } from '../../features/media/ImageField'
import { useToast } from '../../components/ui'
import { useState, useEffect } from 'react'
import { extractApiError } from '../../services/apiClient'

export function Profile() {
  useDocumentMeta({ title: 'Profile — Admin' })
  const query = useProfileAdmin()
  const mutation = useUpdateProfile()
  const toast = useToast()
  
  const [isEditing, setIsEditing] = useState(false)
  const [photoMediaId, setPhotoMediaId] = useState(null)
  const [form, setForm] = useState({})
  const [errors, setErrors] = useState({})

  const p = query.data?.data

  useEffect(() => {
    if (p && !isEditing) {
      setForm({
        name: p.name || '',
        headline: p.headline || '',
        bio: p.bio || '',
        location: p.location || '',
        email: p.email || '',
        phone: p.phone || '',
        is_available: p.is_available ?? true,
        social_links: p.social_links || { github: '', linkedin: '' }
      })
    }
  }, [p, isEditing])

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors(prev => ({ ...prev, [e.target.name]: '' }))
  }

  const handleSocial = (e) => {
    setForm(prev => ({ ...prev, social_links: { ...prev.social_links, [e.target.name]: e.target.value } }))
    setErrors(prev => ({ ...prev, [`social_links.${e.target.name}`]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    try {
      await mutation.mutateAsync({ ...form, photo_media_id: photoMediaId })
      toast.success('Profil berhasil diperbarui.')
      setIsEditing(false)
    } catch (error) {
      const { message, errors: fieldErrors } = extractApiError(error)
      toast.error(message)
      setErrors(fieldErrors)
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Profile</h2>
          <p className="mt-1 text-sm text-slate-700">Data diri yang tampil di public website.</p>
        </div>
        {!isEditing && p && (
          <Button onClick={() => setIsEditing(true)}>Edit Profil</Button>
        )}
      </div>

      <Async
        isLoading={query.isLoading}
        isError={query.isError}
        errorMessage={query.error?.message}
        onRetry={query.refetch}
        emptyTitle="Belum ada data profil."
        loading={<div className="space-y-3"><Skeleton className="h-40" /></div>}
      >
        {() => isEditing ? (
          <Card className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <ImageField
                label="Foto Profil"
                currentUrl={p?.photo_url}
                onChange={setPhotoMediaId}
                hint="JPG / PNG / WebP / GIF, maks 2MB. Ganti akan langsung tampil di Hero & About."
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Nama" name="name" value={form.name} onChange={handleChange} error={errors.name?.[0]} required />
                <Input label="Headline" name="headline" value={form.headline} onChange={handleChange} error={errors.headline?.[0]} required />
                <Input label="Lokasi" name="location" value={form.location} onChange={handleChange} error={errors.location?.[0]} />
                <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email?.[0]} />
                <Input label="Telepon" name="phone" value={form.phone} onChange={handleChange} error={errors.phone?.[0]} />
                <div className="sm:col-span-2">
                  <Textarea label="Bio" name="bio" value={form.bio} onChange={handleChange} error={errors.bio?.[0]} rows={4} />
                </div>
                <Input label="GitHub URL" name="github" value={form.social_links?.github || ''} onChange={handleSocial} error={errors['social_links.github']?.[0]} />
                <Input label="LinkedIn URL" name="linkedin" value={form.social_links?.linkedin || ''} onChange={handleSocial} error={errors['social_links.linkedin']?.[0]} />
                <div className="sm:col-span-2 pt-2">
                  <Toggle label="Terbuka untuk kesempatan kerja" checked={form.is_available} onChange={(v) => setForm(p => ({ ...p, is_available: v }))} />
                </div>
              </div>
              <FormActions submitLabel="Simpan Profil" onCancel={() => setIsEditing(false)} loading={mutation.isPending} />
            </form>
          </Card>
        ) : (
          <Card className="p-6 sm:p-8">
            {p?.photo_url ? (
              <img src={p.photo_url} alt={p.name} className="h-24 w-24 rounded-full object-cover" />
            ) : null}
            <h3 className="mt-4 text-xl font-semibold text-slate-900">{p?.name}</h3>
            <p className="mt-1 font-medium text-blue-600">{p?.headline}</p>
            {p?.bio && <p className="mt-4 leading-relaxed">{p.bio}</p>}

            <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {p?.location && (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-slate-700">Lokasi</dt>
                  <dd className="mt-1 text-sm text-slate-900">{p.location}</dd>
                </div>
              )}
              {p?.email && (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-slate-700">Email</dt>
                  <dd className="mt-1 text-sm text-slate-900">{p.email}</dd>
                </div>
              )}
              {p?.phone && (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-slate-700">Telepon</dt>
                  <dd className="mt-1 text-sm text-slate-900">{p.phone}</dd>
                </div>
              )}
            </dl>

            {p?.social_links && (
              <div className="mt-5 flex flex-wrap gap-2">
                {Object.entries(p.social_links).filter(([, v]) => v).map(([key, value]) => (
                  <a key={key} href={value} target="_blank" rel="noreferrer" className="rounded-md bg-slate-100 px-3 py-1 text-sm font-medium text-blue-600 hover:bg-slate-200">
                    {key}
                  </a>
                ))}
              </div>
            )}
          </Card>
        )}
      </Async>
    </div>
  )
}