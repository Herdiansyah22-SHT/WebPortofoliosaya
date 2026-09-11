import { useState, useEffect } from 'react'
import { Modal, Input, Textarea, Select, Toggle, FormActions } from '../../components/ui'
import { ImageField } from '../../features/media/ImageField'
import { extractApiError } from '../../services/apiClient'
import { useToast } from '../../components/ui'
import { projectMutations } from '../../hooks/useAdminMutations'

export function ProjectFormModal({ open, onClose, initialData, refetch }) {
  const [form, setForm] = useState({})
  const [errors, setErrors] = useState({})
  
  const m = projectMutations
  const createMut = m.useCreate()
  const updateMut = m.useUpdate()
  const toast = useToast()
  const isPending = createMut.isPending || updateMut.isPending

  useEffect(() => {
    if (open) {
      setForm(initialData || { status: 'draft', is_featured: false, technologies: '' })
      setErrors({})
    }
  }, [open, initialData])

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
    setErrors(p => ({ ...p, [e.target.name]: '' }))
  }

  const handleToggle = (name, value) => {
    setForm(p => ({ ...p, [name]: value }))
    setErrors(p => ({ ...p, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    try {
      const payload = { ...form }
      if (typeof payload.technologies === 'string') {
        payload.technologies = payload.technologies.split(',').map(t => t.trim()).filter(Boolean)
      }

      if (initialData) {
        await updateMut.mutateAsync({ id: initialData.id, ...payload })
        toast.success('Project berhasil diperbarui.')
      } else {
        await createMut.mutateAsync(payload)
        toast.success('Project berhasil dibuat.')
      }
      onClose()
      refetch()
    } catch (error) {
      const { message, errors: fieldErrors } = extractApiError(error)
      toast.error(message)
      setErrors(fieldErrors)
    }
  }

  return (
    <Modal open={open} onClose={() => !isPending && onClose()} title={initialData ? 'Edit Project' : 'Tambah Project'} className="max-w-2xl">
<form onSubmit={handleSubmit} className="space-y-4">
        <div className="max-h-[70vh] overflow-y-auto space-y-4 px-1 py-2">
          <ImageField
            label="Gambar Thumbnail"
            currentUrl={initialData?.thumbnail_url}
            onChange={(mediaId) => handleToggle('thumbnail_media_id', mediaId)}
            hint="JPG / PNG / WebP / GIF, maks 2MB. Tampil di kartu project & detail."
          />
          <Input label="Judul Project" name="title" value={form.title || ''} onChange={handleChange} error={errors.title?.[0]} required />
          <Input label="Slug" name="slug" value={form.slug || ''} onChange={handleChange} error={errors.slug?.[0]} hint="Kosongkan untuk generate otomatis dari judul." />
          <Textarea label="Ringkasan (Summary)" name="summary" value={form.summary || ''} onChange={handleChange} error={errors.summary?.[0]} rows={2} />
          <Textarea label="Deskripsi Lengkap" name="description" value={form.description || ''} onChange={handleChange} error={errors.description?.[0]} rows={5} hint="Mendukung HTML dasar." />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="URL Live Demo" name="live_url" type="url" value={form.live_url || ''} onChange={handleChange} error={errors.live_url?.[0]} />
            <Input label="URL Repository" name="repo_url" type="url" value={form.repo_url || ''} onChange={handleChange} error={errors.repo_url?.[0]} />
            <Input label="Tanggal Mulai" name="start_date" type="date" value={form.start_date || ''} onChange={handleChange} error={errors.start_date?.[0]} />
            <Input label="Tanggal Selesai" name="end_date" type="date" value={form.end_date || ''} onChange={handleChange} error={errors.end_date?.[0]} />
          </div>

          <Input label="Teknologi" name="technologies" value={form.technologies || ''} onChange={handleChange} error={errors.technologies?.[0]} hint="Pisahkan dengan koma. Contoh: Laravel, React, MySQL" />
          <Input label="Urutan" name="sort_order" type="number" value={form.sort_order || 0} onChange={handleChange} error={errors.sort_order?.[0]} />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <Select label="Status Publikasi" name="status" value={form.status || 'draft'} onChange={handleChange} error={errors.status?.[0]}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </Select>
            <div className="pt-7">
              <Toggle label="Featured Project" checked={form.is_featured || false} onChange={(v) => handleToggle('is_featured', v)} />
            </div>
          </div>
        </div>
        <FormActions submitLabel="Simpan Project" onCancel={onClose} loading={isPending} />
      </form>
    </Modal>
  )
}
