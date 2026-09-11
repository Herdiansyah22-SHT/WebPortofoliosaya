import { useDocumentMeta } from '../../hooks/useDocumentMeta'
import { useSeoAdmin } from '../../hooks/useAdminData'
import { useUpdateSeo } from '../../hooks/useAdminMutations'
import { Async } from '../../components/common/Async'
import { Card, FormActions, Input, Skeleton, Textarea } from '../../components/ui'
import { useToast } from '../../components/ui'
import { useState, useEffect } from 'react'
import { extractApiError } from '../../services/apiClient'

export default function Seo() {
  useDocumentMeta({ title: 'SEO — Admin' })
  const query = useSeoAdmin()
  const mutation = useUpdateSeo()
  const toast = useToast()

  const [form, setForm] = useState({})
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (query.data?.data?.seo) {
      setForm(query.data.data.seo)
    }
  }, [query.data])

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
    setErrors((p) => ({ ...p, [`seo.${e.target.name}`]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    try {
      const payload = { seo: form }
      await mutation.mutateAsync(payload)
      toast.success('Pengaturan SEO berhasil diperbarui.')
    } catch (error) {
      const { message, errors: fieldErrors } = extractApiError(error)
      toast.error(message)
      setErrors(fieldErrors)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-slate-900">SEO</h2>
        <p className="mt-1 text-sm text-slate-700">Metadata default, Open Graph, dan robots.txt.</p>
      </div>

      <Async
        isLoading={query.isLoading}
        isError={query.isError}
        errorMessage={query.error?.message}
        onRetry={query.refetch}
        loading={<div className="space-y-4"><Skeleton className="h-40" /></div>}
      >
        {() => (
          <form onSubmit={handleSubmit} className="max-w-2xl">
            <Card className="space-y-4 p-6">
              <Input label="Default Title" name="default_title" value={form.default_title || ''} onChange={handleChange} error={errors['seo.default_title']?.[0]} hint="Fallback title untuk halaman tanpa SEO khusus." />
              <Input label="Default Description" name="default_description" value={form.default_description || ''} onChange={handleChange} error={errors['seo.default_description']?.[0]} />
              <Input label="Default OG Type" name="default_og_type" value={form.default_og_type || 'website'} onChange={handleChange} error={errors['seo.default_og_type']?.[0]} />
              <Input label="Default OG Image" name="default_og_image" value={form.default_og_image || ''} onChange={handleChange} error={errors['seo.default_og_image']?.[0]} placeholder="URL gambar" />
              <Textarea label="robots.txt" name="robots_txt" value={form.robots_txt || ''} onChange={handleChange} error={errors['seo.robots_txt']?.[0]} rows={6} />
              <FormActions submitLabel="Simpan SEO" loading={mutation.isPending} />
            </Card>
          </form>
        )}
      </Async>
    </div>
  )
}
