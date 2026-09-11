import { useState, useEffect } from 'react'
import { Modal, Input, Textarea, Select, FormActions } from '../../components/ui'
import { extractApiError } from '../../services/apiClient'
import { useToast } from '../../components/ui'
import { postMutations } from '../../hooks/useAdminMutations'
import { useCategoriesAdmin } from '../../hooks/useAdminData'

export function PostFormModal({ open, onClose, initialData, refetch }) {
  const [form, setForm] = useState({})
  const [errors, setErrors] = useState({})
  
  const m = postMutations
  const createMut = m.useCreate()
  const updateMut = m.useUpdate()
  const categoriesQuery = useCategoriesAdmin()
  const toast = useToast()
  const isPending = createMut.isPending || updateMut.isPending

  useEffect(() => {
    if (open) {
      setForm(initialData || { status: 'draft', tags: '' })
      setErrors({})
    }
  }, [open, initialData])

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
    setErrors(p => ({ ...p, [e.target.name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    try {
      const payload = { ...form }
      if (typeof payload.tags === 'string') {
        payload.tags = payload.tags.split(',').map(t => t.trim()).filter(Boolean)
      }

      if (initialData) {
        await updateMut.mutateAsync({ id: initialData.id, ...payload })
        toast.success('Post berhasil diperbarui.')
      } else {
        await createMut.mutateAsync(payload)
        toast.success('Post berhasil dibuat.')
      }
      onClose()
      refetch()
    } catch (error) {
      const { message, errors: fieldErrors } = extractApiError(error)
      toast.error(message)
      setErrors(fieldErrors)
    }
  }

  const categories = categoriesQuery.data?.data || []

  return (
    <Modal open={open} onClose={() => !isPending && onClose()} title={initialData ? 'Edit Post' : 'Tambah Post'} className="max-w-3xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="max-h-[75vh] overflow-y-auto space-y-4 px-1 py-2">
          <Input label="Judul Post" name="title" value={form.title || ''} onChange={handleChange} error={errors.title?.[0]} required />
          <Input label="Slug" name="slug" value={form.slug || ''} onChange={handleChange} error={errors.slug?.[0]} hint="Kosongkan untuk generate otomatis dari judul." />
          <Textarea label="Ringkasan (Excerpt)" name="excerpt" value={form.excerpt || ''} onChange={handleChange} error={errors.excerpt?.[0]} rows={2} />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="Kategori" name="category_id" value={form.category_id || ''} onChange={handleChange} error={errors.category_id?.[0]}>
              <option value="">-- Pilih Kategori --</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
            <Select label="Status Publikasi" name="status" value={form.status || 'draft'} onChange={handleChange} error={errors.status?.[0]}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </Select>
          </div>

          <Input label="Tags" name="tags" value={form.tags || ''} onChange={handleChange} error={errors.tags?.[0]} hint="Pisahkan dengan koma. Contoh: React, Tutorial" />
          
          <Textarea label="Konten Artikel" name="body" value={form.body || ''} onChange={handleChange} error={errors.body?.[0]} rows={12} hint="Mendukung format HTML." />
        </div>
        <FormActions submitLabel="Simpan Post" onCancel={onClose} loading={isPending} />
      </form>
    </Modal>
  )
}
